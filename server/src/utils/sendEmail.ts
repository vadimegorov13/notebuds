// import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (to: string, html: string, subject: string) => {
  // const oAuth2Client = new google.auth.OAuth2(
  //   process.env.CLIENT_ID,
  //   process.env.CLIENT_SECRET,
  //   process.env.REDIRECT_URI
  // );

  // oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  // try {
  //   const accessToken = await oAuth2Client.getAccessToken();

  //   // create reusable transporter
  //   let transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     auth: {
  //       type: "OAuth2",
  //       user: "notebuds@gmail.com",
  //       clientId: process.env.CLIENT_ID,
  //       clientSecret: process.env.CLIENT_SECRET,
  //       refreshToken: process.env.REFRESH_TOKEN,
  //       accessToken: accessToken,
  //     },
  //   });

  //   const mailOptions = {
  //     from: "NoteBuds Team 📧 <notebuds@gmail.com>",
  //     to, // list of receivers
  //     subject, // Subject line
  //     test: html,
  //     html, // html body
  //   };

  //   await transporter.sendMail(mailOptions);
  // } catch (err) {
  //   console.log(err);
  // }

  console.log(to, html, subject);
  return null;
};
