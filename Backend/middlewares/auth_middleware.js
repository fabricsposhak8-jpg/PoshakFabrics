import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Not token provided" })
            }
            req.user = user;
            next();
        })

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}