const { Worker } = require("bullmq");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const Submission = require("../models/submission");
const Problem = require("../models/problem");
const judgeSubmission = require("../services/runtime_services");

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });

const worker = new Worker(
    "submission-queue",
    async job => {
        console.log("Job came!");
        const submission = await Submission.findById(job.data.submissionId);

        if(!submission){
            throw new Error("Submission not found");
        }

        const problem = await Problem.findById(submission.problem._id);

        if(!problem){
            throw new Error("Problem not found");
        }

        submission.verdict = "Running";
        await submission.save();

        const result = await judgeSubmission(
            submission.code,
            problem.testcases
        );

        submission.verdict = result.verdict;
        await submission.save();
    },{
        connection:{
            host: "127.0.0.1",
            port: 6379
        }
    }
);

console.log("Worker is waiting for jobs...");