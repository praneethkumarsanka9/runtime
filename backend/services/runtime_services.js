const fs = require("fs");
const util = require("util");
const { exec } = require("child_process");
const crypto = require("crypto");
const path = require("path");

const execPromise = util.promisify(exec);

async function judgeSubmission(code, testcases) {
    const folder = crypto.randomUUID();
    const folderPath = path.join(process.cwd(), "temp", folder);

    fs.mkdirSync(folderPath, { recursive: true });

    let containerId = null;

    try {
        fs.writeFileSync(
            path.join(folderPath, "temp.cpp"),
            code
        );

        const { stdout: id } = await execPromise(
            `docker create --memory=512m --cpus=0.5 -v "${folderPath}:/app" cpp-runner:latest sleep infinity`
        );

        containerId = id.trim();

        await execPromise(
            `docker start ${containerId}`
        );

        try {
            await execPromise(
                `docker exec ${containerId} bash -c "cd /app && g++ temp.cpp -o run"`
            );
        } catch (err) {
            return {
                verdict: "Compilation error",
                error: err.stderr || err.message
            };
        }

        let c = 1;

        for (const testcase of testcases) {
            fs.writeFileSync(
                path.join(folderPath, "input.txt"),
                testcase.input
            );

            try {
                const { stdout } = await execPromise(
                    `docker exec ${containerId} bash -c "cd /app && timeout 2s ./run < input.txt"`
                );

                if (stdout.trim() !== testcase.output.trim()) {
                    return {
                        verdict: "Wrong answer",
                        failedTestCase: c
                    };
                }
            } catch (err) {
                if (err.code === 124) {
                    return {
                        verdict: "Time Limit Exceeded",
                        failedTestCase: c
                    };
                }

                return {
                    verdict: "Runtime error",
                    failedTestCase: c,
                    error: err.stderr || err.message
                };
            }

            c++;
        }

        return {
            verdict: "Accepted"
        };

    } catch (err) {
        console.error("Judge error:", err);

        return {
            verdict: "Judge error",
            error: err.message
        };

    } finally {
        if (containerId) {
            try {
                await execPromise(
                    `docker rm -f ${containerId}`
                );
            } catch (err) {
                console.error(
                    "Failed to remove container:",
                    err.message
                );
            }
        }

        fs.rmSync(folderPath, {
            recursive: true,
            force: true
        });
    }
}

module.exports = judgeSubmission;
