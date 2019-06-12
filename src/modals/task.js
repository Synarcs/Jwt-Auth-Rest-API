const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const url = 'mongodb://127.0.0.1:27017/task-manager-api';
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true});

// the sanitization methods =trim,type,required,validate,lowercase,uppercase,minlength
const task_schema = new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true,
        validate(value){
            if(value.length<=3){
                throw new Error("the required description is too short");
            }
        }
    },
    completed:{
        type:Boolean,
        default:false,
        required:true
    }
});

task_schema.pre('save',async function(next){
    const task = this;
    console.log('the task schema is running');
    next();
})


const tasks = mongoose.model('Tasks',task_schema);


module.exports = tasks;

