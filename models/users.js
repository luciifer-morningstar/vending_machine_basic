const mongoose = require('mongoose')
const usersSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:false
    }

})

module.exports = mongoose.model('Users',usersSchema)