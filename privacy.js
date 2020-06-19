const puppeteer = require('puppeteer');
const Main = require("./main")
const chromePaths = require('chrome-paths');
var colors = require('colors');

// Setting up all of our Global Variables. This allows for easy access without the need to save and load files.
// There are better ways to set it up, but this is my how I did it here.
var cards = [];
var newCards = [];
var amount = 0;
var reload = 0;
  
// Module.Exports is a different way to export functions than the one found in main.js, just showing versatility here. 
  module.exports = {
    // Defining the login() function.
    login: function () {
      (async () => {
        console.log("Starting....")
        // We boot up a Puppeteer controlled Chrome browser with headless mode set to FALSE.
        // In this version the user has to manually log in to privacy.com 
        // This was done for a few reasons, main one being if a person has 2FA set up they can manully input it.
        // I had a weird glitch happening when trying to login with code rather than manual.
        // This can be replaced with headless mode by asking the user for their login:pass and then if needed 2fa
        // However I found users feel safer with manual login
        browser = await puppeteer.launch({executablePath: chromePaths.chrome, headless : false});
        // Setting up file save to save cookies.
        const fs = require('fs').promises;
        // Opens new page
        const page = await browser.newPage();
        await page.goto('https://privacy.com/login');
        // Ok...this is the worst and ugilest part of the code. When I first wrote it I made this timer
        // This way I would not have to bother checking at which step of the login the user is.
        // It is a bad way to do it! This is a no no. 
        // Its lazy and bad code... Keep in mind it's still a work in progress and I am working on a better solution.
        // This is something that would be changed asap
        console.log("You have 60 seconds to log in....")
        console.log("waiting for 60 seconds....")
        // Waits for 60 seconds while the user logs in passing 2fa if needed
        await page.waitFor(60000);
        // Once 60 seconds pass we start the process of saving cookies.
        console.log("waiting done, saving cookies....")
        // Coookies saved. This is a CRUCIAL step. 
        // We need the cookies in order to later keep accessing the privacy.com site without the need to login.
        const cookies = await page.cookies();
        // Saves the cookies to a json that stores them and makes them easy to access later on. 
        await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
        console.log("cookies saved....".green)
        console.log("closing....")
        // Closes the pupeteer window. 
        await browser.close();
        // Calls back the main() function in main.js this pulls up the options menu again.
        Main.data.main();
      })();
    },
    
    // Gen is the heart and soul of the whole program! 
    // After all this is what its all about :)
    gen: function () {
      

      // Asks for input from the user. The input is the SKU of the shoe. 
      const readline = require('readline').createInterface({
       input: process.stdin,
       output: process.stdout
      })
      readline.question(`How many cards to gen?`, (n) => { // takes in input
        // Sets the amount of cards to be created to the input from the user.
        // No there is no checking if the input is a number or some random stuff.
        // Just felt no need to do the extra work for a small script. 
        // Its just an assumption people who use this know what they are doing. 
        // If this was a production release I would for sure change this...or use a UI
        amount = n;
        
        (async () => {
          // SET UP 
          // Opens chrome in headless mode
          const fs = require('fs').promises;
          console.log("opened headless....")
          browser = await puppeteer.launch({executablePath: chromePaths.chrome,headless : true});
          const page = await browser.newPage();
      
          // LOAD COOKIES
          // Crucial step you need to first login and then the cookies will be loaded here.
          // With valid cookies privacy.com will just let us access the site with no need for reverification.
          // Again this is all assuming the user follows the instructions correctly.
          // If the cookies are invalid or expired it will break the code and you have to restart. 
          console.log("loading cookies....")
          const cookiesString = await fs.readFile('./cookies.json');
          const cookies = JSON.parse(cookiesString);
          console.log("cookies loaded....")
      
          // SET COOKIES
          console.log("setting cookies....")
          await page.setCookie(...cookies);
          console.log("cookies set....")
      
          // GO HOME AND PREPARE TO GEN
          console.log("going home....")
          await page.goto('https://privacy.com/home');
          console.log("at home ready to gen....")
          // Simple loop from 1 to x amount set by user at the start.
          for(var i = 1; i <= amount; i++){
          // CREATE A NEW CARD
          console.log("new card....")
          // We search and click the new card button
          // This script uses css selectors in order to identify the buttons, text fields and other elements it needs to click and select.
          await page.click('#home > content > div.home-list-container.ng-isolate-scope > div.home-list.cards > div.controls._desktop-only > div');
          // This was added as a feature to expand on later.
          // The idea is that it will take user input as to what to name the card.
          // But right now it does nothing it just defualts to what privacy.com calls the card
          console.log("adding nickname....")
          await page.click("body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.details-container > div.card-details.ng-scope > div:nth-child(1) > div.label")
          page.$eval('#modal-card-edit-nickname-input', el => el.value = '');
          // This saves the card info. At the moment it just defaults to unlimited merchant locked card. 
          // Again this is a feature to be added in the future for users who would want to create cards
          // with limits, or burner cards.
          console.log("saving....")
          await page.click("body > div:nth-child(1) > div > div > div > div.content > div > div > div.brands-content.-nickname-only > div.nickname-input-wrap > div > a > span")
          console.log("clicking done....")
          await page.click("body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.buttons > div.create-button.pill-button.ng-scope > a > span")
          console.log("nickname done....")
          console.log("creating card....")
          // finishes the process of creating the card.
      
          // CARD CREATED LOAD INFO
          // Here we create the temp variables we need to save card info.
          var cvv = 0;
          var date = 0;
          var number = 0;
          // This timeout for 1.5s is really not needed. I mainly have it here for debugging which I do.
          // It helps on systems that lag with chrome as well, but honestly it can be removed. 
          await page.waitFor(1500);
          // NUMBER
          // This set of code pulls the card number from the site
          const options = await page.$$('body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.card-info-wrap > div.privacy-card.ng-isolate-scope.-light > input.card-pan.ng-scope.-selectable');
          // Honestly not sure why I do it this way. 
          // I found this solution online to find value elements and I kind of just stuck with it.
          // Did not take a second look at it, but it works so that is what matters. 
          for (const option of options) {
              number = await page.evaluate(el => el.value, option);
          }
          // Confrims it created the card with number x
          console.log("The number is " + number)
      
          // The same process that was used for the number is then repeated for the date and CVV of the card.
          // The only difference is that the date and cvv is presented as a text element rather than a value
          // So I use the el.innerText to locate it.
      
          // DATE
          const options2 = await page.$$('body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.card-info-wrap > div.privacy-card.ng-isolate-scope.-light > div.card-exp.ng-binding');
      
          for (const option of options2) {
               date = await page.evaluate(el => el.innerText, option);
          }
          console.log("The date is " + date)
          
          // CVV
          
          const options3 = await page.$$('body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.card-info-wrap > div.privacy-card.ng-isolate-scope.-light > div.card-cvv.ng-binding');
      
          for (const option of options3) {
               cvv = await page.evaluate(el => el.innerText, option);
          }
          console.log("The cvv is " + cvv)
          // Here we add the card to our newCards {} this is a way to organize it.
          newCards += "{Number: " + number + ", " + "Date: " + date + ", " + "CVV: " + cvv + "}, \n"
          // We return to the site if needed to make more.
          await page.goto('https://privacy.com/home');
        }
          // If all card are created we save the newCards into a txt so the user can then export and use the cards.
          // In the future I was planning on changing the export to different formats used by sneaker botters.
          // The plans are to add csv and json exports for the top bots and tool boxes. 
          // At the moment its just a simple txt 
          await fs.writeFile('./newcards.txt', newCards);
          
          readline.close()
          await browser.close();
          Main.data.main();    
          })();
      })
  
        
      },
    // The load function is the biggest issue of this whole program as its extreamly glitchy.
    // The goal of it is to load the info of every privacy card in the account.
    // But it is very glitchy and tends to break and is something that needs work.
    // Most testers said they have no need for this feature but I like to work on it anyway.
    // I left it in a half broken state at this stage.
    // It works fine for loading about 30-40 cards. After that it starts to break down! 
    load: function () {
      (async () => {
          console.time('someFunction')
          const fs = require('fs').promises;
          console.log("opened headless....")
          browser = await puppeteer.launch({executablePath: chromePaths.chrome,headless : true});
          const page = await browser.newPage();
          console.log("loading cookies....")
          const cookiesString = await fs.readFile('./cookies.json');
          const cookies = JSON.parse(cookiesString);
          console.log("cookies loaded....")
          console.log("setting cookies....")
          await page.setCookie(...cookies);
          console.log("cookies set....")
          console.log("going home....")
          // This is a diffrence here it waits until the page is fully loaded before doing anything else.
          await page.goto('https://privacy.com/cards', {"waitUntil" : "networkidle0"});
          console.log("at home ready to gen....")
          console.log("loading all cards....")
          // Calls the autoScroll function which is a function that will scroll to the very end of the page.
          // Privacy has all cards listed on one page, however you need to load them in by scrolling all the way down.
          // This has to be repeated untill you cant scroll anymore and that is how you have all the cards loaded.
          // This function does exactly does, it scrolls until it can't scroll no more.
          await autoScroll(page);
          // For debugging it takes a full page screenshot this allows me or the user to check if it really loaded all the cards.
          await page.screenshot({path: 'whole page.png',fullPage: true});
          // Now we pull and see how many cards are loaded on the page. 
          // This is crucial as privacy uses a n tag for each card. 
          // So we need to know how many cards in order to loop through them.
          // Could be done with a while loop but I found this to be a safer way.
          let texts = await page.evaluate(() => {
            let data = [];
            let elements = document.getElementsByClassName('card ng-scope');
            for (var element of elements)
                data.push(element.textContent);
            return data;
        });
          await page.waitFor(1500);
          console.log("Cards found: " + texts.length)
          // This starts the process of loading cards.
          for(var i = 1; i<texts.length-1; i++ ){
              // A weird test case I addeed.
              // It seemes that after 30 cards it starts to break.
              // So to try and fix that, this will reload the page and rescroll to the bottom every 30 cards.
              // It did improve things a little bit but its not the best solution and will be changed in the future.
              if(i%30 == 0){
                reload++;
                console.log("loading more cards....");
                
                await autoScroll(page);
                await page.screenshot({path: 'reload'+reload+'.png',fullPage: true});
              }

              console.log("===================================================================")
              console.log("Selecting card #" + i)
              await page.waitFor(500);
              // Here we try to load the card.
              try{await page.click("#home > content > div.card-list > div:nth-child("+i+") > div")}
              catch (err) {
                // If the card fails to load we will catch the error, print it in console and then take a screenshot to help with debugging.
                await page.screenshot({path: 'error'+i+'.png',fullPage: true});
                console.error("ERROR!".trap)
                console.error(err.message);
              } finally {
                // Try to load it again
                await page.click("#home > content > div.card-list > div:nth-child("+i+") > div")
              }
              
              // This process is almost the same as the process in gen()
              // Only difference is we have to account for burner cards which have different selectors.
              // More explained below.
              
              // CARD CREATED LOAD INFO
              var cvv = 0;
              var date = 0;
              var number = 0;
          
              // NUMBER
              const options = await page.$$('body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.card-info-wrap > div.privacy-card.ng-isolate-scope.-light > input.card-pan.ng-scope.-selectable');
                                            
              for (const option of options) {
                  number = await page.evaluate(el => el.value, option);
              }

              // This is the BURNER CARD check. Since burner cards use different selectors I check if it loaded the number of the card or left it as 0.
              // If the card number is 0 I know its a burner card.
              // Then this part of the code runs which changes the selector to the burner card selectors.
              // The rest is the same as gen() and normal card load. 

              if(number == 0){
                const options = await page.$$('body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.card-info-wrap > div.privacy-card.ng-isolate-scope.-burner > input.card-pan.ng-scope.-selectable')
                for (const option of options) {
                  number = await page.evaluate(el => el.value, option);
                }
              }
              console.log("The number is " + number)
              
      
              // DATE
              const options2 = await page.$$('body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.card-info-wrap > div.privacy-card.ng-isolate-scope.-light > div.card-exp.ng-binding');
      
              for (const option of options2) {
                  date = await page.evaluate(el => el.innerText, option);
              }
              if(date == 0){
                console.log("BURNER DATE CHECK");
                
                const burnerDate = await page.$$('body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.card-info-wrap > div.privacy-card.ng-isolate-scope.-burner > div.card-exp.ng-binding')
                for (const option of burnerDate) {
                  date = await page.evaluate(el => el.innerText, option);
                }
              }
              console.log("The date is " + date)
          
              // CVV
          
              
              const options3 = await page.$$('body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.card-info-wrap > div.privacy-card.ng-isolate-scope.-light > div.card-cvv.ng-binding');
      
              for (const option of options3) {
                   cvv = await page.evaluate(el => el.innerText, option);
              }
              if(cvv == 0){
                const options = await page.$$('body > div.modal.ng-scope.ng-isolate-scope.in > div > div > div > div.content > div > div > div.card-info-wrap > div.privacy-card.ng-isolate-scope.-burner > div.card-cvv.ng-binding')
                for (const option of options) {
                  cvv = await page.evaluate(el => el.innerText, option);
                }
              }
              console.log("The cvv is " + cvv)
              
              cards += "{Number: " + number + ", " + "Date: " + date + ", " + "CVV: " + cvv + "}, \n"
              await page.goto('https://privacy.com/cards' , {"waitUntil" : "networkidle0"});
          }
          // Finished loading cards and now we close the connection.
          await browser.close();
          console.log("EVEREYTHING ENDED ---------------------------------------")
          console.log(cards);
          // We save our cards array to cards.txt and load back into the main menu.
          // As mentioned in gen() this is to be changed into a csv and json format depending on the user selection.
          await fs.writeFile('./cards.txt', cards);
          console.timeEnd('loaded in')
          Main.data.main();
          })();

          // This is the autoScroll funtion that load() uses. I found it online and it gets the job done.
          // Not going to comment on it as its not my code. 
          async function autoScroll(page){
            await page.evaluate(async () => {
                await new Promise((resolve, reject) => {
                    var totalHeight = 0;
                    var distance = 100;
                    var timer = setInterval(() => {
                        var scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
        
                        if(totalHeight >= scrollHeight){
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });
        }
  }
    
  };
  
