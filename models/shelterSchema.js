const mongoose = require('mongoose')

const schema ={
    shelterId:{type:String, index:1},
    citizenId:{type:String, required:true},
    lat:{type:String, required:true},
    lng:{type:String, required:true},
    pictureUrl:{type:Array}
  
}
const shelter_schema = new mongoose.Schema(schema)
const shelter        = mongoose.model('shelter',shelter_schema,'shelters')
module.exports       = shelter 
