import nodeMailer from "nodemailer";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = asyncHandler(async (data, req, res) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"Hello" <teste@email.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }
    return res.status(200).json({ msg: "Email enviado com sucesso!" });
  });
});
