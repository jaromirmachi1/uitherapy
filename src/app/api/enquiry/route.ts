import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteEmail, siteName } from "@/seo/site";
import { buildEnquiryEmail } from "./email-template";

export const runtime = "nodejs";

type EnquiryBody = {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  budget?: string;
  start?: string;
  launch?: string;
  brief?: string;
  locale?: string;
};

const emailOk = (value: string) => /\S+@\S+\.\S+/.test(value);

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || siteEmail;

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  let body: EnquiryBody;
  try {
    body = (await request.json()) as EnquiryBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const website = body.website?.trim() ?? "";
  const budget = body.budget?.trim() ?? "";
  const start = body.start?.trim() ?? "";
  const launch = body.launch?.trim() ?? "";
  const brief = body.brief?.trim() ?? "";
  const locale = body.locale?.trim() ?? "";

  if (name.length < 2 || !emailOk(email) || !budget || brief.length < 3) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const subject = `New enquiry — ${name}${company ? ` (${company})` : ""}`;
  const { text, html } = buildEnquiryEmail({
    name,
    email,
    company,
    website,
    budget,
    start,
    launch,
    brief,
    locale,
  });

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: `${siteName} <${from}>`,
      to: [to],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to send." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch {
    return NextResponse.json({ error: "Failed to send." }, { status: 502 });
  }
}
