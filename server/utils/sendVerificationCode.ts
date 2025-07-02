import nodemailer from "nodemailer";

export const sendVerificationCode = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"VictorySync" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your VictorySync Verification Code",
    html: `<h2>Your verification code is:</h2><h3>${code}</h3>`,
  };

  await transporter.sendMail(mailOptions);
};
