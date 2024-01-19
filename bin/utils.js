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
        // console.log(filepath);
        throw(chalk.bold.red("Error occured while locating file"))
    }
}

function saveFiles(data){
    let filesArray = data.payloads;
    const currentDir = process.cwd();
    
    filesArray.forEach((file) => {
        const fileName = file.filename.split('/')[(file.filename.split('/')).length -1];
        const dirPath = file.filename.replace(fileName,"");
        const destinationPath = path.join(currentDir,dirPath)
        fs.mkdirSync(destinationPath,{recursive: true});
        const fileContent = Buffer.from(file.fileContent.data);
        let filepath = path.join(destinationPath,fileName)
        fs.writeFileSync(filepath,fileContent)
    })
}

function flattenFolders(dir, arr){
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filepath = path.join(dir,file);
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            flattenFolders(filepath,arr);
        } else {
            arr.push(filepath)
        }
    })
}


function sendFile(filepath,socket) {
    let JsonPayload = {};
    if(!isDirectory(filepath)) {
        const fileContent = fs.readFileSync(filepath);
        const filePayload = { filename:filepath, fileContent};
        JsonPayload.payloads = [filePayload]
        
    } else {
        let fileDirectories = []
        const currentDir = path.join(process.cwd(),filepath);
        
        flattenFolders(currentDir,fileDirectories);
        const allFilesPayload = []

        fileDirectories.forEach((filePath) => {
            const fileContent = fs.readFileSync(filePath);
            const filename =  filePath.replace(new RegExp(`^${currentDir}`),"")
            const filePayload = { filename: path.join(filepath,filename), fileContent};
            allFilesPayload.push(filePayload)
            setTimeout(()=>{},100);
        })
        
        JsonPayload.payloads = allFilesPayload
    }
    socket.write(JSON.stringify(JsonPayload));
}

module.exports = { showHelp: showHelp,displayTitle: displayTitle,isDirectory,sendFile,saveFiles};