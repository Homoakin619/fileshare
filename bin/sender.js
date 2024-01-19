const net = require("net");
const dns = require('dns');
const os = require('os');
const fs = require('fs')
const chalk = require("chalk")
const {displayTitle, sendFile} = require("./utils")

function startServer(filename) {
    const server = net.createServer((socket) => {
        console.log(chalk.yellow.bold("Handshake successful 🤝"));

        sendFile(filename,socket)
        socket.end()
        
        socket.on("connect",() => {
            console.log("Connection completed");
        })
    
        socket.on("data",(data) => {
        
            console.log();
        });
    
        socket.on("close",() => {
            console.log('connection has been closed');
        })
    })

    server.listen(3000,() => {
        
        displayTitle()
        console.log(chalk.bold.greenBright("Connection created..."));
        console.log(chalk.bold.green("Waiting for Receiver 🔗🔗🔗🔗🔗🔗"));
    })
    dns.lookup(os.hostname(), function (err, add, fam) {
            console.log(chalk.redBright.bold.underline('address: ' + add));})
}
module.exports = startServer