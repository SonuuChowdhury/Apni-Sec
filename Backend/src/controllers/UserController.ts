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