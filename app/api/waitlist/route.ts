import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { Resend } from "resend";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    try {
      const normalizedEmail = email.toLowerCase();
      await prisma.waitlist.create({
        data: { email: normalizedEmail },
      });

      console.log(`New waitlist signup: ${normalizedEmail}`);

      let emailSent = false;
      try {
        if (process.env.RESEND_API_KEY) {
          console.log("Attempting to send email to:", normalizedEmail);
          const result = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "siddharth <siddharth@tryproven.com>",
            to: normalizedEmail,
            subject: "you're on the proven waitlist! 🚀",
            html: `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <title>Proven Waitlist</title>
                </head>
                <body style="background-color:#fefefe;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:32px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border:2px solid #050505;border-radius:28px;box-shadow:8px 8px 0 #050505;padding:40px 32px;text-align:center;">
                          <tr>
                            <td style="padding-bottom:24px;">
                              <div style="display:inline-block;padding:10px 20px;border-radius:999px;border:2px solid #050505;background:#ffe9e8;color:#050505;font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">
                                be early proven
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:24px;">
                              <h1 style="margin:0;font-size:32px;font-weight:800;line-height:1.15;color:#050505;">thanks for joining proven! 🏎️</h1>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:28px;">
                              <div style="display:inline-block;background:linear-gradient(135deg,#ff6361 0%,#ff7a5e 100%);color:#ffffff;font-weight:700;font-size:20px;padding:18px 38px;border-radius:20px;border:2px solid #050505;box-shadow:6px 6px 0 #050505;">
                                you're on the proven waitlist! 🎉
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:24px;">
                              <p style="margin:0;font-size:16px;line-height:1.6;color:#222222;">
                                you're part of the earliest crew. we'll hit your inbox the moment proven launches, plus sneak peeks as we drop them.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:8px;">
                              <p style="margin:0;font-size:14px;line-height:1.5;color:#050505;font-weight:600;">
                                follow along for updates:
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom:24px;">
                              <a href="https://x.com/tryprovenn" style="display:inline-block;font-size:14px;font-weight:700;color:#ff6361;text-decoration:none;border-bottom:2px solid #ff6361;">
                                @tryprovenn
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:13px;color:#8a8a8a;">
                              – siddharth
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>`,
          });
          console.log("Email sent successfully:", result);
          emailSent = true;
        } else {
          console.log("No RESEND_API_KEY found, skipping email");
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }

      const message = emailSent
        ? "thanks for joining!\n\nyou're in. not just the waitlist but the beginning of what's next.."
        : "thanks for joining!\n\nyou're in. keep an eye on your inbox for what's coming.";

      return Response.json({ message }, { status: 200 });
    } catch (dbError: unknown) {
      console.error("Database error:", dbError);

      if (
        typeof dbError === "object" &&
        dbError !== null &&
        "code" in dbError &&
        (dbError as { code?: string }).code === "P2002"
      ) {
        return Response.json(
          {
            message:
              "you're already part of it. spread the word and share it with your crew!",
          },
          { status: 200 }
        );
      }

      throw dbError;
    }
  } catch (error) {
    console.error("Waitlist error:", error);
    return Response.json(
      {
        error: "something went wrong. please try again.",
      },
      { status: 500 }
    );
  }
}