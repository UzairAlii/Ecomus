import userModel from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body

        const existedUser = await userModel.findOne({ email })

        if (!existedUser) {
            return res.json({ success: false, msg: "user does not exist with this email" })
        }

        const isMatch = await bcrypt.compare(password, existedUser.password)

        if (isMatch) {
            const token = createToken(existedUser._id);
            res.json({
                success: true,
                msg: "Welcome back",
                token,
                user: {
                    id: existedUser._id,
                    email: existedUser.email,
                    isSeller: existedUser.isSeller, 
                },
            });
        }

        else {
            res.json({ success: false, msg: "incorrect password" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
    console.log(req.body);

}


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!validator.isEmail(email)) {
            return res.json({ success: false, msg: "Please enter a valid email address" });
        }
        if (password.length < 8) {
            return res.json({ success: false, msg: "Password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPass });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                isSeller: user.isSeller,
            },
        });

    } catch (error) {
        console.log("Register Error:", error);
        res.json({ success: false, message: error.message });
    }
};

let otpStorage = {};

const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000); 
        const otpExpiry = Date.now() + 15 * 60 * 1000; 

        otpStorage[email] = { otp, otpExpiry };

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            debug: true, 
            logger: true, 
        });
        




        const mailOptions = {
            from: `"Ecomus" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            html: `<p>Your OTP for password reset is: <b>${otp}</b>. It is valid for 15 minutes.</p>`,
        };


        transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP verification failed:", error);
            } else {
                console.log("SMTP server is ready to take messages.");
            }
        });

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, msg: "OTP sent to your email." });
    } catch (error) {
        console.error("Error in resetPasswordRequest:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error: " + error.message });
    }
};

const verifyOtpAndResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!otpStorage[email] || otpStorage[email].otp !== parseInt(otp)) {
            return res.status(400).json({ success: false, msg: "Invalid or expired OTP" });
        }

        if (Date.now() > otpStorage[email].otpExpiry) {
            return res.status(400).json({ success: false, msg: "OTP has expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updateOne({ email }, { $set: { password: hashedPassword } });

        delete otpStorage[email];

        res.status(200).json({ success: true, msg: "Password updated successfully" });
    } catch (error) {
        console.error("Error in verifyOtpAndResetPassword:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error: " + error.message });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.VITE_ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Incorrect details" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export { loginUser, registerUser, adminLogin, resetPasswordRequest, verifyOtpAndResetPassword };