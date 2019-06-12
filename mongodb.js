const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID,MongoClient} = require('mongodb');

const hbs = require('hbs');
const path = require('path');

const app = express();

const url = 'mongodb://127.0.0.1:27017';
const database =  'task-mongodb';

// partials
app.set('hbs','view-engine');
app.use(express.static(path.join(__dirname,'./Public')));
app.use('/users',require(path.join(__dirname,'./Routes/route')));

app.get('/data',(req,res)=>{
    MongoClient.connect(url,{useNewUrlParser:true},(err,client)=>{
        if(err)
            return
        const db = client.db(database);
        db.collection('users').insertMany([
            {
                name:'abc',com:'symantec',
            },{
                name:'Andrew',com:'Cisco',
            }
        ],)
        db.collection('users').findOne({_id:new ObjectID("5cee9bd6db35c9022c85dee9")},(err,success)=>{
            if(err)
                return;
            else
                console.log(success);
        })
        db.collection('users').find({name:'Mathew'}).toArray((err,success)=>{
            if(err)
                return;
            else
                console.log(success);
        })
        db.collection('users').updateOne({_id : new ObjectID("5cee9bd6db35c9022c85deea")},{
            $set:{
                name:'Mathew'
            },   
            $unset:{
                name:'Karl'
            },
            $inc:{
                age:2
            } 
        }).then(data=>{res.json(data)}).catch(err=>console.log(err));
        db.collection('users').find({name:'Anna Marie Jongigs'}).toArray((err,success)=>{
            if(err){
               console.log('the name is already updated');
            }
            else{
                const replace_name = success[0].name;
                console.log(replace_name);
                db.collection('users').updateMany({name:replace_name},{
                    $set:{
                        name:'Emilie Clarke'
                    }
                }).then(data=>console.log('done')).catch(err=>console.log(err));
            }
        })
        db.collection('users').deleteOne({_id:new ObjectID('5cee9bd6db35c9022c85deea')}).then(data=>console.log('done')).catch(err=>console.log(err));
    })
})

app.get('/',(req,res)=>{
    const name = (id,callback)=>{
        if(typeof(id)!=undefined)
            callback('data is there');
        else
            callback('data is not there');
    }
    name(98,(response)=>{
        res.send(response);
    })
})

app.get('*',(req,res)=>{
    res.send('hello bad request');
})


app.listen('3000'); 