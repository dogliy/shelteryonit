const mongoose    = require('mongoose')

const schema ={
    name:{type:String, index:1},
    id:{type:String, required:true},
    age:{type:Number}  
}
const citizen_schema = new mongoose.Schema(schema)
const citizen        = mongoose.model('citizen',citizen_schema,'citizen')
module.exports       = citizen 
