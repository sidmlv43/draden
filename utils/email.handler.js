const nodemailer = require("nodemailer");
const pug = require("pug");

const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Draden ${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    });
    return transporter;
  }

  async send(template, subject) {
    console.log(__dirname);
    const html = pug.renderFile(`./views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
      // html: true
    };

    // 3. create a transport and send email
    this.newTransport();
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (Valid for only 10 minutes)"
    );
  }
};
