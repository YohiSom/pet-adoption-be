import { UnAuthenticatedError } from "../errors/index.js";
import User from "../models/User.js";
const isAdmin = async (req, res, next) => {
    const admin = await User.findOne({_id: req.user.userId})
    console.log(admin)
    if (!admin.isAdmin) {
        throw new UnAuthenticatedError("Invalid admin")
    }
    next()
    
}

export default isAdmin;