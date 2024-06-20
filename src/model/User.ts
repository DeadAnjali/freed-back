import mongoose,{Schema,Document} from "mongoose";
//definign interfaces for Message, User and uploaded documents

export interface Message extends Document{
    content:string,
    createdAt:Date
}

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isAcceptingMessage:boolean,
    message:Message[]
}

const MessageSchema: Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Username is required"],
        unique:true
    },
    verifyCode:{
        type:String,
        required:[true,"verifycode is required"],
        unique:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verifycodeexp is required"],
    },
    isAcceptingMessage:{
        type:Boolean,
        required:[true,"accepting message is required"],
    },
    message:[MessageSchema]
})