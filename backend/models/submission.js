const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },

    problem:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Problem",
        required: true
    },

    code:{
        type:String,
        required: true
    },

    language:{
        type:String,
        default:"cpp"
    },

    verdict:{
        type:String,
        default:"Pending"
    }

},{
    timestamps: true
});

module.exports = mongoose.model("Submission",submissionSchema);