import express from "express"
import { loginUser, registerUser, adminLogin, resetPasswordRequest, verifyOtpAndResetPassword } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)
userRouter.post("/reset-password-request", resetPasswordRequest);
userRouter.post("/verify-otp-reset-password", verifyOtpAndResetPassword);

export default userRouter;