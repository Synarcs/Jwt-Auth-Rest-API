const jwt = require('jsonwebtoken');
const User = require('../user');

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token,'thenewuser');
        const user = await User.find({_id:decoded._id,"tokens.token":token});
        console.log(user);
        if(!user){
            throw new Error();
        }
        console.log(token);
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        res.status(401).send('not authenticated');
    }
}

module.exports = auth;
