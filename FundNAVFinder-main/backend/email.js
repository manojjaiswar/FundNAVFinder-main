const SibApiV3Sdk = require('sib-api-v3-sdk');


class Email {

  //Sets up the email client and the default/sender settings. 
  constructor() {
    this.defaultClient = SibApiV3Sdk.ApiClient.instance;
    this.apiKey = this.defaultClient.authentications['api-key'];
    this.apiKey.apiKey = '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';
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    this.sendSmtpEmail.sender = {
      name: 'Dipen Vadodaria',
      email: 'dipen.vadodaria@pridevel.com',
    };
    this.sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
    this.sendSmtpEmail.replyTo = {
      email: 'virat.shah@pridevel.com',
      name: 'Virat Shah',
    };
    this.sendSmtpEmail.subject = '{{params.Subject}}';
    this.sendSmtpEmail.htmlContent = `<html> <body> <h1> {{params.Header}} </h1> <a href={{params.Link}}> {{params.LinkText}} </a> <p> Hey {{params.Name}} This is your access token {{params.Password}} </p> </body> </html>`;
  }

  // Returns a promise that needs to be handled upon sending the email. 
  verifyEmail = function (userEmail, password, name) {
    let ref = this;
    // console.log(verifyLink,'Link for verify')
    ref.sendSmtpEmail.to = [{ email: userEmail}];
    ref.sendSmtpEmail.params = {
      Header: 'Access given',
      Subject: 'Access granted to you',
      Link: 'https://ec2-18-222-140-217.us-east-2.compute.amazonaws.com/access',
      Name: name,
      Password: password,
      
      LinkText: 'Click to visit Plutus.',
    };
    return new Promise(function(resolve, reject){
      ref.apiInstance.sendTransacEmail(ref.sendSmtpEmail).then(
        (data) => {
          console.log(
            'API called successfully. Returned data: ' + JSON.stringify(data)
          );
          resolve({ success: true, data });
        },
        (error) => {
          console.error(error);
          reject({ success: false, error });
        }
      );
    })
  };
}
Email = new Email();
module.exports = Email;

