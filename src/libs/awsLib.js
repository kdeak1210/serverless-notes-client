import { CognitoUserPool } from 'amazon-cognito-identity-js';
import config from '../config';

/** Returns true if we are able to authenticate the user, false otherwise */
export async function authUser() {
  const currentUser = getCurrentUser();

  if (currentUser === null) {
    return false;
  }

  await getUserToken(currentUser);
 
  return true;
}

/**
 * Given a currentUser object, gets the user's session and user token.
 * 
 * Attempts to get the session from the current user. The currentUser object comes
 * from the cognito user pool. The currentUser.getSession method also refreshes the
 * user session in case it has expired.
 * 
 * @param {Object} currentUser The user currently logged in.
 * 
 * @return {Promise} resolves on session token, rejects session error
 *  
 */
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