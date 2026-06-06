const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

function logger(req,res,next){
    console.log(`${req.method} ${req.url}`);
    next();//otherwise request will get stuck
}

app.use(logger);

mongoose.connect("mongodb+srv://runtimeadmin:pinguking@cluster0.mkxpfma.mongodb.net/runtime?retryWrites=true&w=majority&appName=Cluster0")
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

app.get("/problems",(req,res)=>{
    res.json(problems);
});

app.get("/problems/:id",(req,res)=>{
    const problem = problems.find(p => p.id == req.params.id);
    if(!problem){
        return res.status(404).json({
            message: "Problem not found"
        });
    }
    res.json(problem);
});

app.get("/users",async (req,res)=>{
    const users = await User.find();
    res.status(201).json(users);
});

app.post("/problems",(req,res)=>{
    const newproblem = req.body;
    problems.push(newproblem);
    res.json({
        message: "Problem added",
        problem: newproblem
    });
});

app.post("/register",async (req,res)=>{
    try{
        const user = new User(req.body);
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

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});