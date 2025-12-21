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
router.put("/update", (req: Request, res: Response) => userController.updateUser(req, res));
router.get("/issues", (req: Request, res: Response) => userController.getUserIssues(req, res));
router.post("/issues/new", (req: Request, res: Response) => userController.createUserIssue(req, res));
router.put("/issues/update", (req: Request, res: Response) => userController.updateUserIssue(req, res));

export default router;