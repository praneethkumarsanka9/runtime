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
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const app = express();

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
     service: "gmail",
     auth:{
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
     }
});

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

app.get("/problems",auth,async(req,res)=>{
    try{
        const problems = await Problem.find();
        res.json(problems);
    }catch(err){
        res.status(500).json({
            message: "Failed to fetch problems"
        });
    }
});

app.get("/problems/:id",auth,async(req,res)=>{
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
            difficulty: req.body.difficulty,
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

app.get("/verify/:token", async(req,res) =>{
    const user = await User.findOne({
        verificationToken: req.params.token
    });

    if(!user){
        return res.status(400).json({
            message: "Invalid link"
        });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({
        message: "Email verified successfully"
    });
});

app.post("/register",async (req,res)=>{
    try{
        
        const token = crypto.randomBytes(32).toString("hex");
        const {username, email, password} = req.body;
        const already = await User.findOne({email});
        if(already){
            return res.status(401).json({
                message: "User already exist with this email"
            });
        }
        const hashed = await bcrypt.hash(password,10);
        const user = new User({
            username,
            email,
            password: hashed,
            verificationToken: token
        });
        await user.save();
        res.status(201).json({
            message: "Email sent for verification",
            user
        });
        try{
            const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verify your email",
            html: `
            <h2>Click below to verify your account</h2>
            <a href="http://localhost:5173/verify/${token}">
            Verify Email
            </a>
            `
        });
        console.log(info);
        }catch(err){
            console.log(err);
        }
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
        if(!user.isVerified) {
           return res.status(400).json({
           message: "Please verify your email first"
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