const express = require('express');
const validator = require('validator');
const {model,Schema} = require('mongoose');
const bcryptjs = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path =require('path');
//  enable if extra routes required

const User = require('./modals/user');
// database tasks 
const tasks = require('./modals/task');
const app = express();
app.use(express.json()); 
app.use(express.static(path.join(__dirname,'./Public')));
app.use((req,res,next)=>{
    if(!req.path){
        res.status(503).send('server under maintainence');
    }
    next();
})
// rest api and http endpoints 
app.use('/about',require('../Routes/route'));
app.use('/users',require('../Routes/users'));
app.use('/tasks',require('../Routes/tasks'));

port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log('server started');
});

// middleware new route =>middleware => route resource 