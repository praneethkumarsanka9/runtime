const fs = require("fs");
const util = require("util");
const { exec } = require("child_process");

const execPromise = util.promisify(exec);

async function judgeSubmission(code , testcases){
    
        fs.writeFileSync("temp.cpp",code);
        try{
            await execPromise(`docker run --rm -v ${process.cwd()}:/app cpp-runner:latest bash -c "cd /app && g++ temp.cpp -o run"`);
        }catch(err){
            console.log(err);
            return {
                verdict: "Compilation error",
                error: err.stderr || err.message
            };
        }
        let c = 1;
        for(const testcase of testcases){
            fs.writeFileSync("./testcases/input.txt",testcase.input);
            let stdout;
            try{
                const {stdout} = await execPromise(`docker run --rm --memory=256m --cpus=0.5 -v ${process.cwd()}:/app cpp-runner:latest bash -c "cd /app && timeout 2s ./run < ./testcases/input.txt"`);
                if( stdout.trim() !== testcase.output.trim() ){
                    return{
                        verdict: "Wrong answer",
                        failedTestCase: c
                    };
                }
            }catch(err){
                if(err.code == 124){
                    return{
                        verdict: "Time Limit Exceeded"
                    };
                }
                return {
                    verdict: "Runtime error",
                    error: err.stderr || err.message
                };
            }
            c++;
        }
        return {
            verdict: "Accepted"
        };
}

module.exports = judgeSubmission;