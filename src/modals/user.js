const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const url = 'mongodb://127.0.0.1:27017/task-manager-api';
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false});


// the sanitization methods =trim,type,required,validate,unique,lowercase,uppercase,minlength
// schema uses more middlewares than model
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('the email is not valid'); 
            }
        }
    },password:{
        type:String, 
        trim:true,
        required:true,
        validate(value){
            if(value.length<=6){
                throw new Error(`the password length not valid in it`);
            }
            if(validator.contains(value,'password')){
                console.log(value.length);
                throw new Error(`the password cannot contain password in it`);
            }
        }
    },age:{
        type:Number,
        required:false,
        default:18
    },
    tokens:[{
        token:{
            type:String,
            required:true,
            trim:false
        }
    }]
});
// login token 
userSchema.methods.JwtToken = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id.toString()},'thenewuser',{expiresIn:'10 days'});
    user.tokens = user.tokens.concat({
        token,
    })
    return token;
}

// model is internally converted to a schema hash password
userSchema.pre('save',async function(next){
    const user = this;const saltRounds = 10;
    console.log('now running');
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,saltRounds);
    }
    next();
});

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('the user is not present');
    }
    const val = await bcrypt.compare(password,user.password);
    if(!val){
        throw new Error(`the user is notauthenticated ${user.email}`);
    }
    return user;
}
// seperate modal and Schema for mongoose middlewares
const User = mongoose.model('User',userSchema);

module.exports = User;
