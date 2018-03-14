import AWS from 'aws-sdk';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import sigV4Client from './sigV4Client';
import config from '../config';

/** Make a signed request to API Gateway */
export async function invokeApig({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  body
}) {
  // Ensure user is authenticated, & generate temp credentials w/ authUser()
  if (!await authUser()) {
    throw new Error('User is not logged in.');
  }

  // Generate a signed request using sigV4Client w/ temp credentials
  const signedRequest = sigV4Client
    .newClient({
      accessKey: AWS.config.credentials.accessKeyId,
      secretKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: config.apiGateway.REGION,
      endpoint: config.apiGateway.URL
    })
    .signRequest({method, path, headers, queryParams, body});

  body = body ? JSON.stringify(body) : body;
  headers = signedRequest.headers;

  // Use the signed headers to make a HTTP fetch request
  const results = await fetch(signedRequest.url, {
    method,
    headers,
    body
  });

  if (results.status != 200) {
    throw new Error(await results.text());
  }

  return results.json();
}

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