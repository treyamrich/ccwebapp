import  { SESClient }  from  "@aws-sdk/client-ses";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

export function createSESObj(idToken) {
	let REGION = "us-west-2";
	let COGNITO_ID = "cognito-idp.us-west-2.amazonaws.com/us-west-2_HoWBljRN9"; // 'COGNITO_ID' has the format 'cognito-idp.REGION.amazonaws.com/COGNITO_USER_POOL_ID'
	let loginData = {
	[COGNITO_ID]: idToken.jwtToken,
	};
	const sesClient = new SESClient({
	  region: REGION,
	  credentials: fromCognitoIdentityPool({
	  clientConfig: { region: REGION }, // Configure the underlying CognitoIdentityClient.
	  identityPoolId: 'us-west-2:2402da71-0ac3-4182-97f0-b364bdc4991e',
	  logins: 
	    loginData })
	});
	return sesClient;
}
