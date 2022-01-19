import { SendEmailCommand }  from "@aws-sdk/client-ses";
import  { SESClient }  from  "@aws-sdk/client-ses";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

export async function emailUser(token, email, event_name, organization_name, description, date, start_time, end_time, location) {
  
  // Set the parameters for the email
  const params = {
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
         email //RECEIVER_ADDRESS
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h4>Thank you for giving your time! Below are your event 
          details for the exact time and place of your chosen location to
          volunteer...</h4>
          <h4> Event Name: ${event_name} </h4>
              <h4> Host: ${organization_name}</h5>
              <h4> Description: ${description} </h5>
              <ul>
                <li>Date: ${date}</li>
                <li>Time: ${start_time} - ${end_time}</li>
                <li>Location: ${location}</li>
              </ul>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Compassion Connection: Thank you for volunteering!!!",
      },
    },
    Source: "thecompassionconnectionoahu@gmail.com" // SENDER_ADDRESS
  };

  let COGNITO_ID = "cognito-idp.us-west-2.amazonaws.com/us-west-2_HoWBljRN9"; // 'COGNITO_ID' has the format 'cognito-idp.REGION.amazonaws.com/COGNITO_USER_POOL_ID'

  const REGION = "us-west-2";
  let loginData = {
    [COGNITO_ID]: token.jwtToken,
  };
  const sesClient = new SESClient({
      region: REGION,
      credentials: fromCognitoIdentityPool({
      clientConfig: { region: REGION }, // Configure the underlying CognitoIdentityClient.
      identityPoolId: 'us-west-2:2402da71-0ac3-4182-97f0-b364bdc4991e',
      logins: 
        loginData
    })
  });

  //Send email
  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
}