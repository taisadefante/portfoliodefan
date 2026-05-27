import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function getSmtpPort() {
  return Number(process.env.SMTP_PORT || 465);
}

function getSecureMode() {
  return getSmtpPort() === 465;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const to = String(formData.get("to") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const resume = formData.get("resume");

    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Informe ao menos um e-mail." },
        { status: 400 },
      );
    }

    if (!subject) {
      return NextResponse.json(
        { ok: false, error: "Informe o assunto." },
        { status: 400 },
      );
    }

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Informe o texto do e-mail." },
        { status: 400 },
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "SMTP_USER e SMTP_PASS não configurados nas variáveis de ambiente.",
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: getSmtpPort(),
      secure: getSecureMode(),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const attachments = [];

    if (resume instanceof File && resume.size > 0) {
      const buffer = Buffer.from(await resume.arrayBuffer());

      attachments.push({
        filename: resume.name || "curriculo.pdf",
        content: buffer,
        contentType: resume.type || "application/octet-stream",
      });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: message,
      html: message
        .split("\n")
        .map((line) => `<p style="margin:0 0 12px">${line || "&nbsp;"}</p>`)
        .join(""),
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao enviar currículo:", error);

    return NextResponse.json(
      { ok: false, error: "Erro ao enviar currículo." },
      { status: 500 },
    );
  }
}
