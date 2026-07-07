const fs = require("fs");
const util = require("util");
const { exec } = require("child_process");
const crypto = require("crypto");
const path = require("path");

const execPromise = util.promisify(exec);

async function judgeSubmission(code , testcases){
        const folder = crypto.randomUUID();
        const folderPath = path.join(process.cwd(), "temp", folder);
        fs.mkdirSync(folderPath, { recursive: true });
        try{
        fs.writeFileSync(path.join(folderPath, "temp.cpp"), code);
        try{
            await execPromise(`docker run --rm -v "${folderPath}:/app" cpp-runner:latest bash -c "cd /app && g++ temp.cpp -o run"`);
        }catch(err){
            console.log(err);
            return {
                verdict: "Compilation error",
                error: err.stderr || err.message
            };
        }
        let c = 1;
        for(const testcase of testcases){
            fs.writeFileSync(path.join(folderPath, "input.txt"),testcase.input);
            let stdout;
            try{
                let {stdout} = await execPromise(`docker run --rm --memory=256m --cpus=0.5 -v "${folderPath}:/app" cpp-runner:latest bash -c "cd /app && timeout 2s ./run < input.txt"`);
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
        }catch(err){
            
        }finally{
            fs.rmSync(folderPath, {
                recursive: true,
                force: true
            });
        }
}

module.exports = judgeSubmission;