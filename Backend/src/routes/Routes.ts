import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/UserRepository";

const router = Router();

// Initialize repository, service, and controller
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// User routes
router.post("/register", (req: Request, res: Response) => userController.register(req, res));
router.post("/login", (req: Request, res: Response) => userController.login(req, res));
router.get("/verify", (req: Request, res: Response) => userController.verifyUser(req, res));

export default router;