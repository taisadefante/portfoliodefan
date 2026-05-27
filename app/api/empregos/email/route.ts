import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function getSmtpPort() {
  return Number(process.env.SMTP_PORT || 465);
}

function getSmtpHost() {
  return process.env.SMTP_HOST || "smtp.gmail.com";
}

function getSmtpUser() {
  return process.env.SMTP_USER || "";
}

function getSmtpPass() {
  return process.env.SMTP_PASS || "";
}

function getSmtpFrom() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "";
}

function getSmtpFromName() {
  return process.env.SMTP_FROM_NAME || "Taís Defante";
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

    const smtpUser = getSmtpUser();
    const smtpPass = getSmtpPass();
    const smtpFrom = getSmtpFrom();
    const smtpFromName = getSmtpFromName();

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "SMTP_USER e SMTP_PASS não configurados nas variáveis de ambiente.",
        },
        { status: 500 },
      );
    }

    const attachments: {
      filename: string;
      content: Buffer;
      contentType: string;
    }[] = [];

    if (resume instanceof File && resume.size > 0) {
      const buffer = Buffer.from(await resume.arrayBuffer());

      attachments.push({
        filename: resume.name || "curriculo.pdf",
        content: buffer,
        contentType: resume.type || "application/octet-stream",
      });
    }

    const transporter = nodemailer.createTransport({
      host: getSmtpHost(),
      port: getSmtpPort(),
      secure: getSmtpPort() === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `"${smtpFromName}" <${smtpFrom}>`,
      replyTo: `"${smtpFromName}" <${smtpFrom}>`,
      to,
      subject,
      text: message,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;color:#111;line-height:1.6">
          ${message
            .split("\n")
            .map(
              (line) =>
                `<p style="margin:0 0 14px;line-height:1.6;">${
                  line || "&nbsp;"
                }</p>`,
            )
            .join("")}
        </div>
      `,
      attachments,
    });

    return NextResponse.json({
      ok: true,
      message: "E-mail enviado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao enviar currículo:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro ao enviar currículo.";

    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
