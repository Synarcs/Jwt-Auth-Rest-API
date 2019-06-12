const mongoose = require('mongoose');
const validator = require('validator');

const url = 'mongodb://127.0.0.1:27017/task-manager-api';
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true});

// the sanitization methods =trim,type,required,validate,lowercase,uppercase,minlength
const tasks = mongoose.model('Tasks',{
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
        required:false,
        trim:true,
    }
});

module.exports = tasks;

