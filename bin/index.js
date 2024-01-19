#! /usr/bin/env node
const yargs = require('yargs');
const utils = require('./utils');
const startServer = require("./sender")
const receiveFile = require("./receiver")

const usage = "\nUsage: fileshare <command> : status is either 'send' or 'receive' ";
yargs.usage(usage)
// .options("s", {alias:"status", describe: "Set user status as either 'send' or 'receive' ", type: "string", demandOption : true }).help(true).argv


if (yargs.argv._[0] == null) {
    utils.showHelp()
}

yargs.command("send","send a file to a user", (yargs) => {
    yargs.options("f",{
        alias: "file", describe: "The file to send to the user",demandOption: true, type: "string"
    });
},(argv) => {
    startServer(argv.f)
}).command("receive","Receive a file from a user",(yargs) => {
    yargs.options("a",{
        alias: "address", describe: "The ip address of the sender", demandOption: true, type: "string"
    })
},(argv) => {
    receiveFile(argv.a)
})
.argv


// switch(yargs.argv._[0]) {
//     case "send": 
//         startServer();
//         ;
//           break;
//     case "receive":
//         if (!yargs.argv._[1]){
//             return utils.showHelp();
//         } else {
//             return receiveFile(3000,yargs.argv._[1]);
//         };
//         break;
// }