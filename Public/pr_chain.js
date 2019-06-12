const User = require('../src/modals/user');
const tasks = require('../src/modals/task');
const {MongoClient,ObjectID} = require('mongodb').MongoClient;


 User.findByIdAndUpdate('5cf26be1278c5d264898b02a',{
     name:'Karl Darson'
}).then(data=>{
     console.log(data);
     return User.countDocuments({age:18})
 }).then(result=>console.log(result)).catch(err=>console.log(err))

 User.findByIdAndRemove('5cf26be1278c5d264898b02a').then(data=>{
	 console.log('done deletion the given documnet')
    return User.find({})
	}).then(users=>console.log(users)).catch(err=>console.log(err));

tasks.findByIdAndRemove('5cf2610a92859022fcd71e7c').then(data=>{
    console.log('done deletion the given documnet');
   return tasks.countDocuments({completed:true})
}).then(count=>console.log(count)).catch(err=>console.log(err));


const adder = (a,b)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            a || b < 0 ? resolve(a+b) : reject('not good');
        },1000)
    })
}
const work = async ()=>{
    const data = await adder(-10,92);
    const sum2 = await adder(data,98);
    return sum2;
}
work().then(data=>console.log(data))
.catch(err=>console.log(err)); 

// async mongoose User
const updateAndCount = async (id,age)=>{
    const Andrew = await User.findByIdAndUpdate(id,{age});
    const count = await User.countDocuments({age});
    const update = await User.updateOne({name:'Karl Darson'},{name:'Matt Brownie'});
    return update;
}
updateAndCount('5cf25ce06b622a060cb522c2',30).then(update_doc=>console.log(update_doc)).catch(err=>console.log(err));

const deleteAndCount = async (id)=>{
    const task_Del = await tasks.findByIdAndRemove(id);
    const count = await tasks.countDocuments({completed:false})
    return count;
}
deleteAndCount('5cf55a052b92ed182cdec3c8').then(update_doc=>console.log(`thecount of incomplete task is ${update_doc}`)).catch(err=>console.log(err));

update = async ()=>{
    const new_user = await User.findOne({_id:'5cf25ce06b622a060cb522c2'});
    const update_one = await User.update(new_user,{
        name:'Dakota Johnson'
    });
    const display_all = User.find({});
    return display_all;
}
update().then(data=>console.log(data)).catch(err=>console.log(err));
