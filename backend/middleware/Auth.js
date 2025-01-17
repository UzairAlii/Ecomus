import jwt from 'jsonwebtoken';

const AuthUser = async (req, res, next) =>{

    const { token } = req.headers;

    if(!token) {
        return res.json({ success : "false", message: 'Unauthorized' });
    }
    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next()

    } catch (error) {
        res.json({ success : "false", message: error.message });
        console.log(error.message);
        
    }

}

export default AuthUser