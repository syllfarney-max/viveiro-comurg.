const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function sendEmail(name, email, message) {
  const msg = {
    to: process.env.CONTACT_EMAIL, // destino
    from: process.env.CONTACT_EMAIL, // remetente deve ser o mesmo verificado
    subject: `📩 Nova mensagem de contato - Viveiro Comurg`,
    text: `De: ${name} <${email}>\n\n${message}`,
    html: `<p><b>De:</b> ${name} (${email})</p><p>${message}</p>`,
  };
  await sgMail.send(msg);
};
