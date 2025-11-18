const {Schema, model}= require('mongoose');

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },




})

const userModel = model('User', userSchema);

module.exports = userModel;