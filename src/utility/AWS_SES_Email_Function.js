import { SendEmailCommand }  from "@aws-sdk/client-ses";

export async function email_register_user(sesClient, email, {event_name, organization_name, description, date, start_time, end_time, location}) {
  
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

  //Send email
  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
}
export async function email_removed_event(sesClient, volunteerBatch, {event_name, organization_name, description, date, start_time, end_time, location}) {
  
  // Set the parameters for the email
  const params = {
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: volunteerBatch //Array of emails to send to
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h4>Aloha! Unfortunately the host has cancelled the event you registered for. Here were the event details:</h4>
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
        Data: "Compassion Connection: We're sorry to let you hear...",
      },
    },
    Source: "thecompassionconnectionoahu@gmail.com" // SENDER_ADDRESS
  };

  //Send email
  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
}