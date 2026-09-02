import "server-only";
import nodemailer from "nodemailer";

// Envio de e-mail transacional (por enquanto só "esqueci minha senha") via
// SMTP do Gmail, usando a mesma conta que já é o e-mail oficial do projeto.
// Precisa de GMAIL_USER + GMAIL_APP_PASSWORD no .env — a senha é uma "senha
// de app" gerada em myaccount.google.com/apppasswords, nunca a senha normal
// da conta do Gmail.
const transportador = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function enviarEmail(destinatario: string, assunto: string, html: string) {
  await transportador.sendMail({
    from: `"ItaGameficaEdu" <${process.env.GMAIL_USER}>`,
    to: destinatario,
    subject: assunto,
    html,
  });
}
