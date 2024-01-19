# FileShare
Fileshare-cli is a command line tool that helps you transfer files between devices connected over wifi, taking away the need for hardwares. It's easy to use and of course it's for everyone.

# Screenshots

![Sender Screenshot](https://res.cloudinary.com/homoakin/image/upload/v1705703027/Screenshot_from_2024-01-19_22-43-57_ikjthh.png)

![Receiver Screenshot](https://res.cloudinary.com/homoakin/image/upload/v1705703027/Screenshot_from_2024-01-19_22-35-57_uqwihq.png)# Installation
You can install fileshare with any package manager of your choice, either with npm or yarn.

**To install with npm run:**
```
npm install -g fileshare-cli
```
**To install with yarn, run:**
```
yarn global add fileshare-cli
```


## Usage/Examples
Ensure the sender and receiver are connected over the same network, your can share files between your pc and phone by connecting the pc to your phone's hotspot. Likewise you can share files between different pc's by having them connected over the same network.

To use fileshare, navigate to your terminal and enter the command below:

```
fileshare 
```
You will be presented with instructions on how to run the program.

If you want to send a file or folder, navigate to the directory of the folder and enter the command below:
```
fileshare send -f name_of_file_or_folder
```
**NB: An ip address will be shown on the terminal, this is what the receiver needs to connect to the sener**

The receiver as well will navigate to the directory where he wants to receive the file and run the command below:
```
fileshare receive -a ip_address_shown_on_sender's_terminal
```
Immediately a connection is established, the file begins to transfer.
That's all you need to do to share your files. Enjoy...

# Documentation

### Sending a file
```
fileshare <command> -f <filename>

command: send
filename : the name of the file to be sent
-f: tag can also be replaced with --file

**Example**:
fileshare send -f my_folder
```

### Receiving a file
```
fileshare <command> -a <ip address>

command: receive
ip_address : the ip_address displayed on the terminal of the sender
-a: tag can also be replaced with --address

**Example**
fileshare receive -f 123.456.78.900
```