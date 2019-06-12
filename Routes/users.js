const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
// auth middleware make route private 
const auth = require('../src/modals/authentication/auth');
const bodyParser = require('body-parser');

const User = require('../src/modals/user');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.use(express.json());

router.get('/me',auth,async (req,res)=>{
           res.status(201).send(req.user);
           console.log(`the user ${req.user.name} is logged in`);
})

router.get('/:id',auth,async (req,res)=>{
    const _id = req.params.id;
    console.log(_id);
    try{
       const find_id_user = await User.findById(_id)
         if(!find_id_user){
                return res.status(404).send('no user is there');
            }
        res.status(200).send(find_id_user);
    }catch(e){
        res.status(500).send('the required file is not found');
    }
})

// the sign up route (public jwt)
router.post('/',async (req,res)=>{
    const user = new User(req.body);
    try{
        const token = await user.JwtToken();
        await user.save();
        res.status(201).json({
            user,token
        });
    }catch(e){
        console.log('there is a error');
        res.status(500).send(e);
    }
});

// authentication route (public jwt)
router.post('/login',async (req,res)=>{ 
    try{
        const {email,password} = req.body;
        const user = await User.findByCredentials(email,password);
        const token = await user.JwtToken();
        console.log(token);
        res.json({
            user,
            token,
        });
    }catch(e){
        res.status(404).send(e);
    }
})

// logout
router.post('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save();
        res.send('logged out');
    }catch(e){
        res.status(500).send(e);
    }
});

router.patch('/:id',async (req,res)=>{
    // not a property in model
    const updates = Object.keys(req.body);
    const allowed = ['name','email','password','email']
    const bool = updates.every((update)=>{
        return allowed.includes(update);
    })
    if(!bool){
        res.status(400).send('bad request')
    }else{
        const _id = req.params.id;
        try{
            const user = await User.findById(_id);
            updates.forEach(update=>{user[update] = req.body[update];});
            // const user = await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});
            await user.save();
            if(!user){
                return res.status(400).send('not found')
            }
                res.status(201).send(user);
        }catch(e){
            res.status(500).send(e)
        }
    }
})

router.delete('/:id',async (req,res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findByIdAndDelete(_id);
        if(!user){
            return  res.status(400).send('user not found');
        }
        res.status(201).json(user);
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router;
