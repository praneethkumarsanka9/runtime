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

    testcases:[
        {
            input: String,
            output: String
        }
    ],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps: true
});

module.exports = mongoose.model("Problem",problemSchema);