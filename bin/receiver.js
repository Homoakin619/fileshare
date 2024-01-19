const net = require("net");
const fs = require("fs")
const ora = require("ora")
const chalk = require("chalk");
const { saveFiles, displayTitle } = require("./utils");


let spinner;
function receiveFile(IP_ADDRESS) {
    const client = net.connect({port: 3000,host:IP_ADDRESS},() => {
        displayTitle()
        console.log(chalk.red.bold("🔗 Connected to sender\nHandshake Successful 🤝"));
        client.write("Handshake completed")
        spinner = ora("Receiving file data").start();
    })
    
    let incomingFile = Buffer.alloc(0);
    client.on("data",(data) => {
        incomingFile = Buffer.concat([incomingFile,data]);
        spinner.text = chalk.bold.cyan(`Receiving file: (${incomingFile.length} bytes)`)
    })

    client.on("error",(error) => {
        console.log(error);
        console.log(chalk.bgRed.bold("⚠️ An error occured, closing connection"));
    })

    client.on('end',() => {
        const payload = JSON.parse(incomingFile.toString())
        saveFiles(payload)
        spinner.succeed(chalk.bold.green(`File received and saved successfully 🚀`));
    })
    client.on("close",() => {
        console.log("client has been closed");
    })
}

module.exports = receiveFile