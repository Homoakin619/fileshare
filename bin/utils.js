const gradient = require("gradient-string");
const figlet = require("figlet");
const fs = require("fs")
const chalk = require("chalk")
const path = require("path")

const usage = `\nUsage: fileshare  <command> : command is either 'send' or 'receive 
\nfileshare send -f --file filename
\nfileshare receive -a --address ipaddress_of_sender`; 

function showHelp() {  
    console.log(usage); 
    console.log('\nOptions:\r') 
    console.log('\t--version\t ' + 'Show version number.' + '\t\t' + '[boolean]\r') 
    console.log('\t-a, --address\t ' + "Ip address of sender. This will show on terminal of sender" + '\t' + '[string]\r') 
    console.log('\t-f, --file\t ' + "Filename of file to be sent to the receiver" + '\t' + '[string]\r') 
    console.log('\t--help\t\t ' + 'Show help.' + '\t\t\t' + '[boolean]\n') 
}

const colors = {
    gold: "#FFD700",
    crimson: "#DC143C",
  };
  
const useGradient = (opt) => {
    const titleColor = opt.colors ?? Object.values(colors);
    const title = gradient(titleColor)(opt.title ?? "");
    console.log(title);
};
  

function displayTitle() {
    const figletConfig = {
        font: "Alligator",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 150,
        whitespaceBreak: true,
    };
    const figletTitle =figlet.textSync("FileShare", figletConfig);
    const colors = ["#fbb040","#ee2a7b"]
    const title = gradient(colors)(figletTitle);
    console.log(title);
}

/** 
 * Check if a filepath is a directory or not
 * @param filepath 
 * @returns boolean
*/
function isDirectory(filepath) {
    try {
        return fs.statSync(filepath).isDirectory()
    } catch (error) {
        throw(chalk.bold.red("Error occured while locating file"))
    }
}

function saveFiles(data){
    const filesArray = data.payloads;
    let directory = data.parentDir

    if (data.isDirectory) {
        if (!fs.existsSync(data.parentDir)) {
            fs.mkdirSync(directory,{recursive: true});
        } else {
            directory += "__"
            fs.mkdirSync(directory,{recursive: true})
        }
    }
    const finaldirectory = path.join(process.cwd(),directory)

    filesArray.forEach((file) => {
        const fileContent = Buffer.from(file.fileContent.data);
        let filepath = file.filename
        if (data.isDirectory) {
            fs.writeFileSync(path.join(finaldirectory,filepath),fileContent)
        } else{
          fs.writeFileSync(filepath,fileContent)
        }
    })
}


function sendFile(filepath,socket) {
    if(!isDirectory(filepath)) {
        const fileContent = fs.readFileSync(filepath);
        const filePayload = { filename:filepath, fileContent};
        const JsonPayload = {
            isDirectory: false,
            payloads: [filePayload]
        }
        socket.write(JSON.stringify(JsonPayload));
    } else {
        const files = fs.readdirSync(filepath);
        const allFilesPayload = [];

        files.forEach((filename) => {
            const filePath = path.join(filepath,filename);
            const fileContent = fs.readFileSync(filePath);
            const filePayload = { filename, fileContent};
            allFilesPayload.push(filePayload)
            setTimeout(()=>{},100);
        })
        const JsonPayload = {
            isDirectory: true,
            parentDir: filepath,
            payloads: allFilesPayload
        }
        socket.write(JSON.stringify(JsonPayload));
    }
}

module.exports = { showHelp: showHelp,displayTitle: displayTitle,isDirectory,sendFile,saveFiles};