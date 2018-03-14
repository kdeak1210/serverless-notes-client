import AWS from 'aws-sdk';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import config from '../config';

/** Returns true if we are able to authenticate the user, false otherwise */
export async function authUser() {
  if (
    AWS.config.credentials &&
    Date.now() < AWS.config.credentials.expireTime - 60000
  ) {
    return true;
  }
  
  const currentUser = getCurrentUser();

  if (currentUser === null) {
    return false;
  }

  const userToken = await getUserToken(currentUser);
  await getAwsCredentials(userToken);
 
  return true;
}

/** If there is a currentUser, sign them out using AWS Cognito JS SDK */
export function signOutUser() {
  const currentUser = getCurrentUser();

  if (currentUser !== null) {
    currentUser.signOut();
  }
}

/** Attempt to check session from current user, refreshing it in process */
function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function(err, session) {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

/** Attempts to retrieve the current user from AWS Cognito */
function getCurrentUser() {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  
  return userPool.getCurrentUser();
}

/** Generate temporary credentials from the userToken given to us by Cognito */
function getAwsCredentials(userToken) {
  const authenticator = `cognito-idp.${config.cognito.REGION}.amazonaws.com/${config.cognito.USER_POOL_ID}`;

  AWS.config.update({ region: config.cognito.REGION });

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.cognito.IDENTITY_POOL_ID,
    Logins: {
      [authenticator]: userToken
    }
  });

  return AWS.config.credentials.getPromise();
}