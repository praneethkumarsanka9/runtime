const User = require("../models/user");

async function admin(req,res,next){
    const user = await User.findById(req.user.id);

    if(user.role != "admin"){
        return res.status(403).json({
            message: "Access denied"
        });
    }

    next();
}

module.exports = admin;