// Welcome to my Privacy.com Credit Card Generator! 
// I am uploading this for free to GitHub for employers and recuriters to get an idea for my code. 
// Please give me a job :)
// There are loads of comments in the code explaning exactly what is happening in order to help demonstrate my abilities and thinking process.

// For anyone from the snekaer world or anyone looking for this generator, it works perfectly as of June 1st 2020. 
// This is a rather early build that has been uploaded here just to demonstarte some of my code. 
// If you would like to ask questions and/or be invited to the most recent version hit me up on Discrod: Lil Chuk#0001 or Twitter: @DevChuk 

// These are the 3 main imports we will need. 
// Puppeteer takes care of all the needed web crawling
// Privacy.js hosts all of our methods.
// ChromePaths is used for the build in order to locate the chrome.exe location needed for puppeteer.
const puppeteer = require('puppeteer');
const privacy = require("./privacy")
const chromePaths = require('chrome-paths');

// This is for exporting the methods in main.js and make them accessiblee from other js files. 
// This is a different way of exporting methods than in privacy.js in order to demonstrate that there are more than 1 way to do this.
var methods = {};


methods.main = function() {
  // Gotta have some fancy branding 
	console.log(
    "██████╗ ██████╗ ██╗██╗   ██╗ █████╗  ██████╗██╗   ██╗ ██████╗ ██████╗ ███╗   ███╗     ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗ "+ "\n" +
    "██╔══██╗██╔══██╗██║██║   ██║██╔══██╗██╔════╝╚██╗ ██╔╝██╔════╝██╔═══██╗████╗ ████║    ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗"+ "\n" +
    "██████╔╝██████╔╝██║██║   ██║███████║██║      ╚████╔╝ ██║     ██║   ██║██╔████╔██║    ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   ██║   ██║██████╔╝"+ "\n" +
    "██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║██║       ╚██╔╝  ██║     ██║   ██║██║╚██╔╝██║    ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗"+ "\n" +
    "██║     ██║  ██║██║ ╚████╔╝ ██║  ██║╚██████╗   ██║██╗╚██████╗╚██████╔╝██║ ╚═╝ ██║    ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║"+ "\n" +
    "╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝   ╚═╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝     ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝"
                                                                                                                                                                      
    )

  // This is where we start asking for user input. We present the user with the 3 options that they can do. Generally you want to follow 1,2 and 3 in order.
  console.log("Hello welcome to Privacy.com Generator \n \n What would you like to do? \n 1. Login \n 2. Gen New Cards \n 3. Load Old Cards")

  // Asks for input from the user. The input is the SKU of the shoe. 
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  readline.question(`   `, (n) => { // takes in input
    readline.close()

    if(n == 1){
      console.log(`You selected Login!`) // confirms input in console, dont need it, I like it
      privacy.login(); // Calls the function from privacy.js
    }
    else if(n == 2){
      console.log(`You selected Gen New Cards!`) // confirms input in console, dont need it, I like it
      privacy.gen() // Calls the function from privacy.js
    }
    else if(n == 3){
      console.log(`You selected Load Old Cards!`) // confirms input in console, dont need it, I like it
      privacy.load() // Calls the function from privacy.js
    }
  })
  
};
// Exports every method in var methods. 
exports.data = methods;

