const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title:{
        type:String,
        requied:true
    },

    description:{
        type: String,
        required:true
    },

    input:{
        type: String,
        required: true
    },

    output:{
        type: String,
        required: true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps: true
});

module.exports = mongoose.model("Problem",problemSchema);