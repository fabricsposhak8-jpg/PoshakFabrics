export const admin_Middleware = (req, res, next) => {
    try {
        console.log("req.user", req.user.role)
        if (req.user.role != "admin") {
            return res.status(401).json({ message: "Unauthorized" })
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}