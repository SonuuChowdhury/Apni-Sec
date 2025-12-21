import { Response, Request } from 'express';
import { UserService } from '../services/user.service';
import * as jwt from 'jsonwebtoken';
import mailerService from '../services/mailer.service';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Register a new user
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, age, gender } = req.body;
      const result = await this.userService.register({
        name,
        email,
        password,
        age,
        gender,
      });

      // Send welcome email from controller as an additional safeguard (non-blocking)
      try {
        const html = `
          <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
            <h2 style="color:#0b5394;">Welcome to ApniSec, ${name}!</h2>
            <p>Hi ${name},</p>
            <p>Thanks for creating an account with ApniSec. We're excited to have you on board.</p>
            <p>If you have any questions, reply to this email — we're here to help.</p>
            <p>Best regards,<br/>The ApniSec Team</p>
          </div>
        `;

        if (mailerService.isEnabled()) {
          // don't await to avoid delaying response; log result when done
          mailerService.send({ to: email, subject: 'Welcome to ApniSec', html })
            .then(r => console.log('UserController: welcome email sent', r))
            .catch(e => console.error('UserController: welcome email failed', e));
        } else {
          console.warn('UserController: mailer not enabled; skipping welcome email');
        }
      } catch (err) {
        console.error('UserController: error sending welcome email', err);
      }
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  // Verify user / Get user data by JWT token
  async verifyUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: 'JWT_SECRET not configured' });
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      const user = await this.userService.getUserById(decoded.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ message: 'Token verified', user });
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}
