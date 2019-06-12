const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
const tasks = require('../src/modals/task');


router.post('/',async (req,res)=>{
    const body = req.body;
    console.log(body);
    const task_new = new tasks(body)
    try{
        const task = await task_new.save();
        res.status(200).send(task);
    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/',async (req,res)=>{
    try{
        const task = await tasks.find({})
        res.status(201).send(task);
    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/:id',async (req,res)=>{
    const _id = req.params.id;
    try{
        const task = await tasks.findById(_id)
        if(!tasks){
            res.redirect(404);
        }
        res.status(201).json(task);
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/:id',async (req,res)=>{
    // not a property in model
    const updates = Object.keys(req.body);
    const allowed = ['description','completed'];
    const bool = updates.every((update)=>{
        return allowed.includes(update);
    })
    if(!bool){
        res.status(400).send('bad request')
    }else{
        try{
            const _id = req.params.id;
            const task_id = await tasks.findById(_id);
            updates.forEach(update=>{task_id[update]=req.body[update];})
            // const task_id = await tasks.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});
            if(!task_id){
                return res.status(400).send('not found')
            }
                res.status(201).json(task_id);
        }catch(e){
            res.status(500).send(e)
        }
    }
})

router.delete('/:id',async(req,res)=>{
    const task_id = req.params.id;
    try{
        const task = await tasks.findByIdAndDelete(task_id);
        if(!task){
            return res.status(500).send('id not found');
        }
        res.status(201).json(task);
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports = router;