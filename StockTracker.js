var exec = require('child_process').exec; //Used to Print the output to a network printer
var https = require('https');  //Used to Make Requests to yahoo finance
var colors = require('ansi-256-colors'); //Used to add color to text printed in console
var fs = require('fs'); //Used for the share value system

//The API we are making requests to
var command = "https:\/\/query1.finance.yahoo.com/v7/finance/quote?fields=symbol,longName,shortName,regularMarketPrice,regularMarketTime,regularMarketChange,regularMarketDayHigh,regularMarketDayLow,regularMarketPrice,regularMarketOpen,regularMarketVolume,averageDailyVolume3Month,marketCap,bid,ask,dividendYield,dividendsPerShare,exDividendDate,trailingPE,priceToSales,tarketPricecMean&formatted=false&symbols="
var express = require('express'); //Used to create the Server
var app = express(); 
var conout = false;  //The variable that decides wheather to do the server or print to the console
var conoutm = false; //Print multiple stocks to console
var printout = false; //Print output to network printer
var servero = false; //Set up Server
var eEntry = false; //Create Share Entry
var helpo = false; //Help
if(process.argv[2] == "-c") conout = true; //If the command entered doesn't have the paramaters needed to print to the console, don't print to the console

if(process.argv[2] == "-m") conoutm = true; //If We put -m as an argument, print out multiple stocks

if(process.argv[2] == "-p") printout = true;//If We put -p as an argument, print to printer

if(process.argv[2] == "-s") servero = true;//If We put -s as an argument, start server
if(process.argv[2] == "-h") helpo = true;//If We put -h as an argument, print help

if(process.argv[2] == "-e") eEntry = true;//If We put -e as an argument, create entry

//If the user wants help...
function help(){
	//Print Out Help Info
	console.log("To Run The Server" + "\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -s\n\n" + "Go to http://[YOUR-IP]:8080/ and enter a stock symbol\n");
	console.log("To Print to the Console\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -c [INSERT STOCK SYMBOL HERE]\n");
	console.log("To Watch Live in the console\n" + "pi@raspberry:~/StockTracker$ watch node StockTracker.js -c [INSERT STOCK SYMBOL]\n");
	console.log("To Print Information to a Printer on your Network\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -p [PRINTER IP] [STOCK SYMBOL]\n");
	console.log("To Print Out Stock Information for multiple stocks(information is less detailed)\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -m [STOCK] [STOCK]\n" + "You Can print out as many stocks as you want.\n");
	console.log("To Make an entry into the share number files\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -e [STOCK] [# OF SHARES]\n" + "This allows you to see how much the shares you 0wn are worth.\n");
	console.log("To View this message\n" +"pi@raspberry:~/StockTracker$ node StockTracker.js -h\n");

}

//Stock Infromation Printer
function printstock(s, p, r, d) {
	
	//Read File that stores # of shares
	fs.readFile('/home/pi/Documents/StockTracker/ShareData/' + s +'.txt', (err, data) => {
		
		//If there is no file... notify the user
		if(!data)  console.log("\x1b[41m%s\x1b[0m", "You do not have an entry for the number of shares you own in this stock. Make one by using -e(-h for more info on parameters");
  		
		//If there is.. create the value
		if(data) var vall = parseInt(p) * parseInt(data);
		
		//Print out the data
		if(data) console.log(s + "       " + p + "         " + r + "          " + vall.toString() + "\n");
                if(!data) console.log(s + "       " + p + "         " + r + "\n");

	});
}

//If the user wants a server
function serve(){

	app.listen(8080); //Start Listening For Request On Port 8080

	console.log("StockTracker Listening on port 8080"); //Notify User That the Server is Up

	app.get('/', function(req, res){  //If Someone Requests For The Main Page ...

   		res.sendFile(__dirname + "/index.html"); //Serve Index.html

	});
	app.get('/request', function(req, res) { //If stock information is requested ...

		var s = req.query.symbol; //Get the symbol that the client requested data on

		//Retrieve the data 
		getData(0, s, function(symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {

			//Set the Text type to plaintext so we can use "\n"
			res.setHeader('content-type', 'text/plain');

			//Send The Stock Information to the Client
			res.send("STOCK REPORT - " + symbol + "(" + short + ")\n" + "MARKET PRICE : " + price + "\n" + "OPEN : " + open + "\n" + "HIGH : " + high + "\n" +"P/E RATIO : " + pe + "\n" + "MARKET CAP : " + mktcp + "\n" +"MARKET CHANGE(DAY) : " + regmktch + "\n" +"ASK: " + ask + "\n" + "BID : " + bid + "\n" +   "MARKET VOLUME : " + mktvol + "\n" +       "PREVIOUS CLOSE PRICE : " + prevClose  + "\n" +      "DIVIDENDS PER SHARE : " + divps + "\n" +     "REVENUE : " + rev + "\n" +      "SHARES OUTSTANDING : " + sO + "\n" +    "TRADABLE : " + tradable + "\n" +     "------HISTORICAL-------"  + "\n" +     "FIFTY-TWO WEEK HIGH : " + ftwh + "\n" +      "FIFTY-TWO WEEK HIGH CHANGE : " + ftwhc + "\n" +      "FIFTY-TWO WEEK HIGH CHANGE PERCENT : " + ftwhcp + "\n" +    "FIFTY-TWO WEEK LOW : " + ftwl + "\n" +    "FIFTY-TWO WEEK LOW CHANGE : " + ftwlc  + "\n" +  "FIFTY-TWO WEEK LOW CHANGE PERCENT : " + ftwlcp);
		});
	});
}

//If the user wants to print out multiple stocks...
function conoutmult() {
	
	var array = []; //Create an array for stocks to print based on arguments
	console.log("STOCK       PRICE       CHANGE      VALUE"); //Print out the key
     
	for (var i = 3; i < process.argv.length; i++){ //Loop through arguments
		array.push(process.argv[i]); //add the arguments to the array
	}
	
	for(var symb of array){ //go through each element in the array
		
		//Get the data from the parameters in the console
		getData(0, symb, function(symbol, short, price, open, high, low, prevClose, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
			  
			    //Print out the information
			    printstock(symbol, price, regmktch,	divps);
		});
	}
}

//If the user wants to make a share number entry
function createEntry(stock, shareNum){

     //Write the file
     fs.writeFileSync('ShareData/' + stock + '.txt', shareNum, 'utf8');

     //Kill the process
     process.exit();

}

//If the user wants to print to a network printer
function pout() {
	
	//Get the data
	getData(0, process.argv[4].toString(), function(symbol, short, price, open, high, low, prevClose,  pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
		
		//Get the number of shares
		fs.readFile('/home/pi/Documents/StockTracker/ShareData/' + process.argv[4].toString() +'.txt', (err, data) => {
			
			  //If there is no file... notify the user
			  if(!data) console.log("\x1b[41m%s\x1b[0m","You have not made an entry for this stock. Create one using -e [STOCK] [SHARES], or do -f if you don't 0wn any.");
                       
			  //If there is.. find the value
			  if(data) var vall = parseInt(price)  * parseInt(data);
			  var out = "";

			  //Print all the information to the console
			  out += "STOCK REPORT - " + symbol + "(" + short + ")\n";
                          out += "MARKET PRICE : " + price + "\n";
                          out += "OPEN : " + open + "\n";
                          out += "HIGH : " + high + "\n";
                          out += "P/E RATIO : " + pe + "\n";
                          out += "MARKET CAP : " + mktcp + "\n";
                          out += "MARKET CHANGEDAY : " + regmktch + "\n";
                          out += "ASK: " + ask + "\n";
                          out += "BID : " + bid + "\n";
                          out += "MARKET VOLUME : " + mktvol + "\n";
                          out += "PREVIOUS CLOSE PRICE : " + prevClose + "\n";
                          out += "DIVIDENDS PER SHARE : " + divps + "\n";
                          out += "REVENUE : " + rev + "\n";
                          out += "SHARES OUTSTANDING : " + sO + "\n";
                          out += "TRADABLE : " + tradable + "\n" + "\n";
                          out += "------HISTORICAL-------" + "\n";
                          out += "FIFTY-TWO WEEK HIGH : " + ftwh + "\n";
                          out += "FIFTY-TWO WEEK HIGH CHANGE : " + ftwhc + "\n";
                          out += "FIFTY-TWO WEEK HIGH CHANGE PERCENT : " + ftwhcp + "\n";
                          out += "FIFTY-TWO WEEK LOW : " + ftwl + "\n";
                          out += "FIFTY-TWO WEEK LOW CHANGE : " + ftwlc + "\n";
                          out += "FIFTY-TWO WEEK LOW CHANGE PERCENT : " + ftwlcp + "\n";
			  if(data) out += "YOUR SHARE VALUE : " + vall;

			  //Write a temporary file with the data
			  fs.writeFileSync('o.txt', out, 'utf8');
			
			   //Send it to the printer
			  exec('cat o.txt | telnet ' + process.argv[3].toString() + ' 9100', (err,stdout,stderr) => {
				  
				  //Delete the file
				  fs.unlinkSync('o.txt');
	
				  //Kill the process
				  process.exit();
			  });
		});
	});



}
function conoutf() {
	
	//Get the data from the parameters in the console
	 getData(0, process.argv[3].toString(), function(symbol, short, price, open, high, low, prevClose,  pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
	
		//Get the number of shares
		fs.readFile('/home/pi/Documents/StockTracker/ShareData/' + process.argv[3].toString() +'.txt', (err, data) => {

			  //If there is no file... notify the user
			  if(!data) console.log("\x1b[41m%s\x1b[0m", "You have no entry for the number of shares you 0wn in this company. Make one by using -e(-h for more info)");
			  
			  //If there is.. find the value
			  if(data){
			  	var vall = parseInt(price)  * parseInt(data);
			  }
			  //Print all the information to the console
			  console.log("STOCK REPORT - " + symbol + "(" + short + ")");
			  console.log("MARKET PRICE : " + price);
			  console.log("OPEN : " + open);
			  console.log("HIGH : " + high);
			  console.log("P/E RATIO : " + pe);
			  console.log("MARKET CAP : " + mktcp);
			  console.log("MARKET CHANGE(DAY) : " + regmktch);
			  console.log("ASK: " + ask);
			  console.log("BID : " + bid);
			  console.log("MARKET VOLUME : " + mktvol);
			  console.log("PREVIOUS CLOSE PRICE : " + prevClose);
			  console.log("DIVIDENDS PER SHARE : " + divps);
			  console.log("REVENUE : " + rev);
			  console.log("SHARES OUTSTANDING : " + sO);
			  console.log("TRADABLE : " + tradable + "\n");
			  console.log("------HISTORICAL-------");
			  console.log("FIFTY-TWO WEEK HIGH : " + ftwh);
			  console.log("FIFTY-TWO WEEK HIGH CHANGE : " + ftwhc);
			  console.log("FIFTY-TWO WEEK HIGH CHANGE PERCENT : " + ftwhcp);
			  console.log("FIFTY-TWO WEEK LOW : " + ftwl);
			  console.log("FIFTY-TWO WEEK LOW CHANGE : " + ftwlc);
			  console.log("FIFTY-TWO WEEK LOW CHANGE PERCENT : " + ftwlcp);
			 if(data){ console.log("YOUR SHARE VALUE : " + vall); }

			  process.exit();
		});
	});
	
}

function getData(num, symb, callback){

	//Make Request to query1.finance.yahoo.com
	https.get(command + symb,(resp) =>{

	   let dat = '';  //Variable to store Data

	    // When a chunk is recieved ...
	    resp.on('data', (chunk) => {
		dat += chunk;  //Add the chunk to the 'dat' variable to store
	    });

	    //When The Host Stops Sending Chunks ....
	    resp.on('end', () => {

		    //Seperate the Data into variables
		    var symbol = JSON.parse(dat).quoteResponse.result[num].symbol;
		    var short = JSON.parse(dat).quoteResponse.result[num].longName;
		    var price = JSON.parse(dat).quoteResponse.result[num].regularMarketPrice;
		    var open = JSON.parse(dat).quoteResponse.result[num].regularMarketOpen;
		    var high = JSON.parse(dat).quoteResponse.result[num].regularMarketDayHigh;
		    var low = JSON.parse(dat).quoteResponse.result[num].regularMarketDayLow;
		    var prevClose =  JSON.parse(dat).quoteResponse.result[num].regularMarketPreviousClose;
		    var pe = JSON.parse(dat).quoteResponse.result[num].trailingPE;
		    var mktcp = JSON.parse(dat).quoteResponse.result[num].marketCap;
		    var regmktch = JSON.parse(dat).quoteResponse.result[num].regularMarketChange;
		    var mktvol = JSON.parse(dat).quoteResponse.result[num].regularMarketVolume;
		    var state = JSON.parse(dat).quoteResponse.result[num].regularMarketState;
		    var bid = JSON.parse(dat).quoteResponse.result[num].bid;
		    var ask = JSON.parse(dat).quoteResponse.result[num].ask;
		    var divps =JSON.parse(dat).quoteResponse.result[num].dividendsPerShare;
		    var rev = JSON.parse(dat).quoteResponse.result[num].revenue;
		    var sO = JSON.parse(dat).quoteResponse.result[num].sharesOutstanding;
		    var tradable = JSON.parse(dat).quoteResponse.result[num].tradable;
		    var ftwhcp =  JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekHighChangePercent;
		    var ftwl =  JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekLow;
		    var ftwh =  JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekHigh;
		    var ftwhc =  JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekHighChange;
		    var ftwlc =  JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekLowChange;
		    var ftwlcp =  JSON.parse(dat).quoteResponse.result[num].fiftyTwoWeekLowChangePercent;

		    //Return the data to the callback function
		    var result = callback(symbol, short, price, open, high, low, prevClose,  pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp);		    
	    });	
	});
}



//If We Want to print to the console ...
if (conout == true) {

    //Print out the data the user requested in the console
    conoutf();

} else if(conoutm == true) {

     //Print out multiple Stocks
     conoutmult();

} else if(printout == true) { 

     //Print output to network printer
     pout();
} else if(servero == true) {

    serve(); //Start The Server
} else if(eEntry == true) {

    createEntry(process.argv[3], process.argv[4]);

} else if(helpo == true) {

    help();

} else {
    console.log("Invalid Argument.");

}


//process.exit();
