import jwt from 'jsonwebtoken'; 

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "Token not provided, login again" });
        }

        const token = authHeader.split(" ")[1];
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.email !== process.env.VITE_ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not authorized, login again" });
        } 
        next();
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export default adminAuth;
