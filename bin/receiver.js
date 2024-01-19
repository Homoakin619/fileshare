const net = require("net");
const fs = require("fs")
const ora = require("ora")
const chalk = require("chalk");
const { saveFiles } = require("./utils");


let spinner;
function receiveFile(IP_ADDRESS) {
    const client = net.connect({port: 3000,host:IP_ADDRESS},() => {
        console.log(chalk.green.bold("🔗 Connected to sender\nHandshake Successful 🤝"));
        client.write("Handshake completed")
        spinner = ora("Receiving file data").start();
    })
    
    let incomingFile = Buffer.alloc(0);
    client.on("data",(data) => {
        incomingFile = Buffer.concat([incomingFile,data]);
        // console.log("Data received");
        spinner.text = chalk.bold.cyan(`Receiving file data (${incomingFile.length} bytes)`)
    })

    client.on("error",(error) => {
        console.log(error);
        console.log(chalk.bgRed.bold("⚠️ An error occured, closing connection"));
    })

    client.on('end',() => {
        const payload = JSON.parse(incomingFile.toString())
        console.log(payload);
        saveFiles(payload)
        // let content =  Buffer.from(payload.file.data);
        // fs.writeFileSync(payload.filename,content);
        spinner.succeed(chalk.bold.green(`File received and saved successfully: ${payload.filename}`));
        // console.log("File saved successfully");
        // client.end()
    })
    client.on("close",() => {
        console.log("client has been closed");
    })
}

module.exports = receiveFile