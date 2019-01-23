const mongoose    = require('mongoose')

const schema ={
    ownerID:{type:String, index:1},
    houseId:{type:Number, required:true},
    capacity:{type:Number, required:true},
    remain:{type:Number,required:true},
    searchingPeople:{type:Array, required:true},
    city:{type:String, required:true},
    pictureUrl:{type:Array},
    hostingPeople:{type:Array, required:true}
  
}
const hospitality_schema = new mongoose.Schema(schema)
const hospitality        = mongoose.model('hospitality',hospitality_schema,'hospitality');
module.exports           = hospitality 
