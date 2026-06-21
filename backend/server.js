require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const Problem = require("./models/problem");
const Submission = require("./models/submission");
const fs = require("fs");
const { exec } = require("child_process");
const { error } = require("console");
const util = require("util");
const { stderr } = require("process");
const execPromise = util.promisify(exec);
const judgeSubmission = require("./services/runtime_services");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

function logger(req,res,next){
    console.log(`${req.method} ${req.url}`);
    next();//otherwise request will get stuck
}

app.use(logger);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("MongoDB connected succesfully");
})
.catch((err)=>{
    console.log(err);
});

app.get("/",(req,res)=>{
    res.send("RunTime Backend is running successfully");
});

app.get("/hello",(req,res)=>{
    res.json({
        message: "Hello from Express"
    });
});

const problems = [
    {
        id: 1,
        title: "Two Sum"
    },
    {
        id: 2,
        title: "Palindrome Number"
    }
];

app.get("/problems",async(req,res)=>{
    const problems = await Problem.find();
    res.json(problems);
});

app.get("/problems/:id",async(req,res)=>{
    try{
        const problem = await Problem.findById(req.params.id);

        if(!problem){
            return res.status(404).json({
                message:"Problem not found"
            });
        }
        
        res.json(problem);
    }catch(err){
        res.status(500).json({
            message:"Server error"
        });
    }
});

app.get("/users",async (req,res)=>{
    const users = await User.find();
    res.status(201).json(users);
});

app.get("/profile",auth,(req,res)=>{
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

app.get("/me",auth,async (req,res)=>{
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});

app.get("/submissons",auth,async(req,res)=>{
    const submission = await Submission.find({
        user: req.user.id,
        problem: req.body.problemId
    })
    .populate("problem","title")
    .populate("user","username");
    if(submission.length > 0){
        res.json(submission);
    }else{
        res.json({
            message: "No submissions made"
        });
    }
});

app.post("/problems",auth,async(req,res)=>{
    try{
        const problem = await Problem.create({
            title: req.body.title,
            description: req.body.description,
            testcases: req.body.testcases,
            createdBy: req.user.id
        });
        res.status(201).json(problem);
    }catch(err){
        res.status(500).json({
            message: "Error creating problem"
        });
    }
});

app.put("/problems/:id",auth,async(req,res)=>{
    const problem = await Problem.findById(req.params.id);
    if(problem.createdBy.toString() != req.user.id){
        return res.status(403).json({
            message: "Not authorized"
        });
    }
    try{
        const updated = await Problem.findByIdAndUpdate(
            req.params.id,req.body,{new:true}
        );
        res.json(updated);
    }catch(err){
        res.status(500).json({
            message: "Update failed"
        });
    }
});

app.delete("/problems/:id",auth,async(req,res)=>{
    const problem = await Problem.findById(req.params.id);
    if(problem.createdBy.toString() != req.user.id){
        return res.status(403).json({
            message: "Not authorized"
        });
    }
    try{
        await Problem.findByIdAndDelete(req.params.id);
        await Submission.deleteMany({
            problem: req.params.id
        });
        res.json({
            message:"Problem deleted"
        });
    }catch(err){
        res.status(500).json({
            message: "Deletion failed"
        });
    }
});

app.post("/register",async (req,res)=>{
    try{
        const {username, email, password} = req.body;
        const already = await User.findOne({email});
        if(already){
            return res.json({
                message: "User already exist with this email"
            });
        }
        const hashed = await bcrypt.hash(password,10);
        const user = new User({
            username,
            email,
            password: hashed
        });
        await user.save();
        res.status(201).json({
            message: "User created",
            user
        });
    }catch(err){
        res.status(500).json({
            error: err
        });
    }
});

app.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
        res.json({
            message: "Login successful",
            token
        });
    } catch(err){
        res.status(500).json({
            error: err
        });
    }
});

app.post("/submit",auth,async(req,res)=>{
    const submission = await Submission.create({
            user:req.user.id,
            problem:req.body.problemId,
            code: req.body.code,
            language: req.body.language
    });
    const problem = await Problem.findById(submission.problem);
    const result = await judgeSubmission(submission.code,problem.testcases);
    submission.verdict = result.verdict;       
    await submission.save();
    res.status(200).json({
            submissionId : submission._id,
            ...result
    });
    
});

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});