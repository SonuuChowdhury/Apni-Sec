const nodemailer: any = require('nodemailer');
import * as dotenv from 'dotenv';
dotenv.config();

function createTransporter() {
	const host = process.env.MAIL_HOST || 'smtp.gmail.com';
	const port = process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587;
	const user = process.env.MAIL_USER || process.env.MAIL_ID;
	const pass = process.env.MAIL_PASS;

	if (!user || !pass) {
		console.warn('mailer.config: SMTP credentials not fully configured (MAIL_USER/MAIL_PASS). Mailer will be disabled.');
		return null;
	}

	const secure = port === 465;
	return nodemailer.createTransport({
		host,
		port,
		secure,
		auth: { user, pass },
	});
}

const transporter = createTransporter();

if (transporter) {
	// show masked configuration for debugging
	const conf = {
		host: process.env.MAIL_HOST || 'smtp.gmail.com',
		port: process.env.MAIL_PORT || 587,
		user: (process.env.MAIL_USER || process.env.MAIL_ID) ? '***' : null,
	};
	// eslint-disable-next-line no-console
	console.log('mailer.config: transporter created', conf);
} else {
	// eslint-disable-next-line no-console
	console.log('mailer.config: transporter NOT created');
}

export function getTransporter() {
	return transporter;
}

export function isMailerConfigured() {
	return !!transporter;
}

export default transporter;




