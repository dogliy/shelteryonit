const mongoose      = require('mongoose')
const consts        = require('./consts')
const shelterSchema = require('./models/shelterSchema')

const {MLAB_URL, DB_USER, DB_PASS} = consts
const url = MLAB_URL
const options = {
    useNewUrlParser: true,
    useCreateIndex:true,
    user: DB_USER,
    pass: DB_PASS,
    autoReconnect:true
}

const connect = mongoose.createConnection(url,options)

connect.on('connected', ()=> console.log('mongoose connected'))
connect.on('error',(err)=>console.error(err))

mongoose.connect(url, options)

module.exports = connect