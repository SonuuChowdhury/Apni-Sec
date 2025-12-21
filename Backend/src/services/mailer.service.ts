import { getTransporter, isMailerConfigured } from "../config/mailer.config";

interface SendProps {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export class MailerService {
  private transporter: any | null;

  constructor() {
    this.transporter = getTransporter();
    // eslint-disable-next-line no-console
    console.log('MailerService: initialized, enabled=', this.isEnabled());
  }

  isEnabled() {
    return isMailerConfigured() && !!this.transporter;
  }

  // Simple template renderer: replaces {{key}} in template with data[key]
  static renderTemplate(template: string, data: Record<string, string | number> = {}) {
    return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
      const v = data[key];
      return v === undefined || v === null ? "" : String(v);
    });
  }

  async send({ to, subject, html, text, from }: SendProps) {
    if (!this.transporter) {
      console.warn("MailerService: transporter not configured; skipping send");
      return null;
    }

    const mailFrom = from || process.env.FROM_EMAIL || process.env.MAIL_ID;

    try {
      const info = await this.transporter.sendMail({
        from: mailFrom,
        to,
        subject,
        html,
        text,
      });
      console.log("MailerService: email sent", { to, subject, messageId: info?.messageId || info?.id || null });
      return info;
    } catch (err) {
      console.error("MailerService: error sending email", err);
      throw err;
    }
  }
}

export default new MailerService();
