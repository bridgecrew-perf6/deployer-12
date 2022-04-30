const core = require("@actions/core");
const github = require("@actions/github");
const { Client } = require("ssh2");

process.on("unhandledRejection", handleError);
main().catch(handleError);

async function main () {
    const host = core.getInput("host"),
        dir = core.getInput("dir"),
        user = core.getInput("user"),
        port = core.getInput("port"),
        privateKey = core.getInput("private-key");

    const ssh = new Client()
        .connect({ host, username: user, port, password: core.getInput("password"), });

    ssh.on("ready", async function () {
        const { runNumber: run } = github.context;

        const sshURL = github.context.payload.repository.ssh_url;

        core.startGroup("Create folders");
        ssh.exec(`mkdir ${dir} -p`);
        core.endGroup();
        
        core.startGroup("Getting repo");
        ssh.exec(`${github.token}`);
        core.endGroup();
    });

    ssh.on("error", (error) => {
        console.log(error);
        core.setFailed(`ERROR: ${error}`);
    })
}

function handleError (error) {
    console.error(error);
    core.setFailed(`Unhandled error: ${error}`);
}