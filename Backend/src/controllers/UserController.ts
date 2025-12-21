import { Response, Request } from 'express';
import { UserService } from '../services/user.service';
import * as jwt from 'jsonwebtoken';
import mailerService from '../services/mailer.service';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

// Maintaining User informations and authentication
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

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

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

  async updateUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({
          error: 'JWT_SECRET not configured'
        });
      }
      const decoded = jwt.verify(token, jwtSecret) as any;
      const updateData = req.body;
      const updatedUser = await this.userService.updateUserById(decoded.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = updatedUser.toObject();
      delete user.password;

      // Send welcome email from controller as an additional safeguard (non-blocking)
      try {
        const html = `        <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:30px">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden">
        <tr>
          <td style="background:#111827;padding:18px 25px;color:#ffffff;font-size:20px;font-weight:bold">
            ApniSec – Account Update Notification
          </td>
        </tr>

        <tr>
          <td style="padding:25px;color:#111827;font-size:15px;line-height:1.6">
            <p>Hi <strong>${user.name}</strong>,</p>

            <p>
              We wanted to let you know that some of your account information on
              <strong>ApniSec</strong> was recently updated successfully.
            </p>

            <p style="margin:15px 0 5px 0;font-weight:bold">What might have changed:</p>
            <ul style="margin-top:5px">
              <li>Profile details (name, email, phone, etc.)</li>
              <li>Security preferences</li>
              <li>Account settings</li>
            </ul>

            <p>
              If you made these changes, no further action is needed 😊
            </p>

            <p style="color:#c62828;font-weight:bold">
              ⚠️ Didn’t make this change?
            </p>
            <p>
              Please secure your account immediately:
            </p>

            <ul>
              <li>Reset your password</li>
              <li>Review recent activity</li>
              <li>Contact our security team if needed</li>
            </ul>

            <p style="margin-top:20px">
              Stay secure,<br/>
              <strong>Team ApniSec</strong>
            </p>

            <hr style="margin:25px 0;border:none;border-top:1px solid #ddd"/>

            <p style="font-size:12px;color:#666">
              This is an automated email. Please do not reply to this message.
              If you need help, visit our support section inside the app.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

        `;

        if (mailerService.isEnabled()) {
          // don't await to avoid delaying response; log result when done
          mailerService.send({ to: user.email, subject: 'Welcome to ApniSec', html })
            .then(r => console.log('UserController: welcome email sent', r))
            .catch(e => console.error('UserController: welcome email failed', e));
        } else {
          console.warn('UserController: mailer not enabled; skipping welcome email');
        }
      } catch (err) {
        console.error('UserController: error sending welcome email', err);
      }

      return res.status(200).json({
        message: "User updated",
        user
    });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }


// Maintaining User Issues
  async getUserIssues(req: Request, res: Response) {
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
      const userIssues = await this.userService.getIssuesByUserId(decoded.id);

      return res.status(200).json({ userIssues });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async createUserIssue(req: Request, res: Response) {
    try {
      const { issueTitle, issueDescription, issueType } = req.body;
      if(!issueTitle || !issueDescription || !issueType){
        return res.status(400).json({ error: 'Missing required fields for issue creation' });
      }
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: 'JWT_SECRET not configured' });
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      
      const newIssue = await this.userService.createIssue({
        issueUserId: decoded.id,
        issueTitle,
        issueDescription,
        issueType,
      });


      try {
        const html = `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;background:#f6f8fb;padding:30px">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden">
        <tr>
          <td style="background:#0f172a;padding:18px 25px;color:#ffffff;font-size:20px;font-weight:bold">
            ApniSec – New Issue Created
          </td>
        </tr>

        <tr>
          <td style="padding:25px;color:#111827;font-size:15px;line-height:1.6">
            <p>Hi User,</p>

            <p>
              Your issue has been successfully created in <strong>ApniSec</strong>. 🎯  
              Our team will review it shortly.
            </p>

            <p style="font-weight:bold;margin-top:10px">📌 Issue Details</p>

            <table cellpadding="6" cellspacing="0" width="100%" style="background:#f4f6fb;border-radius:8px">
              <tr>
                <td><strong>Issue ID / User:</strong></td>
                <td>${decoded.id}</td>
              </tr>
              <tr>
                <td><strong>Title:</strong></td>
                <td>${issueTitle}</td>
              </tr>
              <tr>
                <td><strong>Description:</strong></td>
                <td>${issueDescription}</td>
              </tr>
              <tr>
                <td><strong>Type:</strong></td>
                <td>${issueType}</td>
              </tr>
            </table>

            <p style="margin-top:18px">
              You can track this issue’s status anytime from your dashboard.
            </p>

            <p style="margin-top:18px">
              Stay secure,<br/>
              <strong>Team ApniSec</strong>
            </p>

            <hr style="margin:25px 0;border:none;border-top:1px solid #ddd"/>

            <p style="font-size:12px;color:#666">
              This is an automated email. Please do not reply directly.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;


        if (mailerService.isEnabled()) {
          // don't await to avoid delaying response; log result when done
          mailerService.send({ to: decoded.email, subject: 'Welcome to ApniSec', html })
            .then(r => console.log('UserController: welcome email sent', r))
            .catch(e => console.error('UserController: welcome email failed', e));
        } else {
          console.warn('UserController: mailer not enabled; skipping welcome email');
        }
      } catch (err) {
        console.error('UserController: error sending welcome email', err);
      }

      
      return res.status(201).json({ message: 'Issue created', issue: newIssue });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateUserIssue(req: Request, res: Response) {
    try {
      const { issueId, updateData } = req.body;
      if(!issueId || !updateData){
        return res.status(400).json({ error: 'Missing required fields for issue update' });
      }
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: 'JWT_SECRET not configured' });
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      if (!decoded.id) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      const updatedIssue = await this.userService.updateIssue(issueId, updateData);
      return res.status(200).json({ message: 'Issue updated', issue: updatedIssue });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}