gvar exec = require('child_process').exec; //Used to Print the output to a network printer
var https = require('https');  //Used to Make Requests to yahoo finance
var colors = require('ansi-256-colors'); //Used to add color to text printed in console
var fs = require('fs');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//The API we are making requests to
var command = "https:\/\/query1.finance.yahoo.com/v7/finance/quote?fields=symbol,longName,shortName,regularMarketPrice,regularMarketTime,regularMarketChange,regularMarketDayHigh,regularMarketDayLow,regularMarketPrice,regularMarketOpen,regularMarketVolume,averageDailyVolume3Month,marketCap,bid,ask,dividendYield,dividendsPerShare,exDividendDate,trailingPE,priceToSales,tarketPricecMean&formatted=false&symbols="
var express = require('express'); //Used to create the Server
var app = express(); 
var conout = false;  //The variable that decides wheather to do the server or print to the console
var conoutm = false;
var printout = false;
var servero = false;
var eEntry = false;

if(process.argv[2] == "-c") conout = true; //If the command entered doesn't have the paramaters needed to print to the console, don't print to the console

if(process.argv[2] == "-m") conoutm = true;

if(process.argv[2] == "-p") printout = true;

if(process.argv[2] == "-s") servero = true;

if(process.argv[2] == "-e") eEntry = true
//////Going to be used for colors later
//function isPositive(num) {
//  return num >= 0;
//}
//////////////////////////////////////

function help(){

	console.log("To Run The Server" + "\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -s\n\n" + "Go to http://[YOUR-IP]:8080/ and enter a stock symbol\n");
	console.log("To Print to the Console\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -c [INSERT STOCK SYMBOL HERE]\n");
	console.log("To Watch Live in the console\n" + "pi@raspberry:~/StockTracker$ watch node StockTracker.js -c [INSERT STOCK SYMBOL]\n");
	console.log("To Print Information to a Printer on your Network\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -p [PRINTER IP] [STOCK SYMBOL]\n");
	console.log("To Print Out Stock Information for multiple stocks(information is less detailed)\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -m [STOCK] [STOCK]\n" + "You Can print out as many stocks as you want.\n");
	console.log("To Make an entry into the share number files\n" + "pi@raspberry:~/StockTracker$ node StockTracker.js -e [STOCK] [# OF SHARES]\n" + "This allows you to see how much the shares you 0wn are worth.\n");
	console.log("To View this message\n" +"pi@raspberry:~/StockTracker$ node StockTracker.js -h\n");

}

function printstock(s, p, r, d) {
	
	fs.access("/home/pi/Documents/StockTracker/ShareData/" + s +".txt", error => {
   		 if (!error) {
			fs.readFile('/home/pi/Documents/StockTracker/ShareData/' + s +'.txt', (err, data) => {

				console.log(data);
				if (err) {
	    				console.error(err);
	    				return;
	  			}
	  			var vall = parseInt(p) * parseInt(data);
 				console.log(vall);
				console.log("STOCK       PRICE       CHANGE      VALUE");
		  		console.log(s + "       " + p + "         " + r + "          " + vall.toString());
			});
		
		} else {

		    rl.question("You do not currently have an entry for the number of shares owned in this company. Create one?(yes/no)",function(q){
			if(q == "yes"){
				rl.question("How Many Shares Do You Own in " + s + ":", function(num){


					fs.writeFileSync('ShareData/' + s + '.txt', num, 'utf8');

				        printstock(s,p,r,d);

				});
			}
			else if(q == "no")
			{
				console.log("Writing This stock to the ignorefile so that this message doesn't show again. If You ever want to change this, then modify the 'ignorefile.txt' file");
				fs.writeFile("ignorefile.txt", s);
			}
			else {

				console.log("Error On Input. Try again.");
				return;
			}
		    });
		}
	});
}


function serve(){

	app.listen(8080); //Start Listening For Request On Port 8080

	console.log("StockTracker Listening on port 8080"); //Notify User That the Server is Up

	app.get('/', function(req, res){  //If Someone Requests For The Main Page ...

   		res.sendFile(__dirname + "/index.html"); //Serve Index.html

	});
	app.get('/request', function(req, res) { //If stock information is requested ...

		var s = req.query.symbol; //Get the symbol that the client requested data on

		//Retrieve the data 
		getData(0, s, function(symbol, short, price, open, high, low, prevClose, ask, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {

			//Set the Text type to plaintext so we can use "\n"
			res.setHeader('content-type', 'text/plain');

			//Send The Stock Information to the Client
			res.send("STOCK REPORT - " + symbol + "(" + short + ")\n" + "MARKET PRICE : " + price + "\n" + "OPEN : " + open + "\n" + "HIGH : " + high + "\n" +"P/E RATIO : " + pe + "\n" + "MARKET CAP : " + mktcp + "\n" +"MARKET CHANGE(DAY) : " + regmktch + "\n" +"ASK: " + ask + "\n" + "BID : " + bid + "\n" +   "MARKET VOLUME : " + mktvol + "\n" +       "PREVIOUS CLOSE PRICE : " + prevClose  + "\n" +      "DIVIDENDS PER SHARE : " + divps + "\n" +     "REVENUE : " + rev + "\n" +      "SHARES OUTSTANDING : " + sO + "\n" +    "TRADABLE : " + tradable + "\n" +     "------HISTORICAL-------"  + "\n" +     "FIFTY-TWO WEEK HIGH : " + ftwh + "\n" +      "FIFTY-TWO WEEK HIGH CHANGE : " + ftwhc + "\n" +      "FIFTY-TWO WEEK HIGH CHANGE PERCENT : " + ftwhcp + "\n" +    "FIFTY-TWO WEEK LOW : " + ftwl + "\n" +    "FIFTY-TWO WEEK LOW CHANGE : " + ftwlc  + "\n" +  "FIFTY-TWO WEEK LOW CHANGE PERCENT : " + ftwlcp);
		});
	});
}

function conoutmult() {
	var array = [];

        for (var i = 3; i < process.argv.length; i++){
		array.push(process.argv[i]);
	}
	for(var symb of array){
		console.log(symb);
		//Get the data from the parameters in the console
		getData(0, symb, function(symbol, short, price, open, high, low, prevClose, ask, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {

			    printstock(symbol, price, regmktch,	divps);

		});
	}
       return;
}

function createEntry(stock, shareNum){

     fs.writeFileSync('ShareData/' + stock + '.txt', shareNum, 'utf8');

}
function pout() {
	getData(0, process.argv[4].toString(), function(symbol, short, price, open, high, low, prevClose, ask, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
		fs.readFile('/home/pi/Documents/StockTracker/ShareData/' + process.argv[4].toString() +'.txt', (err, data) => {

			  if(err) console.log("You have not made an entry for this stock. Create one using -e [STOCK] [SHARES], or do -f if you don't 0wn any.");
                          var vall = parseInt(price)  * parseInt(data);
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
			  out += "YOUR SHARE VALUE : " + vall;

			  fs.writeFileSync('o.txt', out, 'utf8');
			  exec('cat o.txt | telnet ' + process.argv[3].toString() + ' 9100', (err,stdout,stderr) => {
				  fs.unlinkSync('o.txt');
			  });
		});
	});



}
function conoutf() {
	//Get the data from the parameters in the console
	getData(0, process.argv[3].toString(), function(symbol, short, price, open, high, low, prevClose, ask, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {
	  	fs.readFile('/home/pi/Documents/StockTracker/ShareData/' + process.argv[3].toString() +'.txt', (err, data) => {
			  if(err) console.log("You Have Not Made an entry for this stock yet. use -e [STOCK] [SHARES]");
			  var vall = parseInt(price)  * parseInt(data);

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
			  console.log("YOUR SHARE VALUE : " + vall);
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
		    var ask = JSON.parse(dat).quoteResponse.result[num].bid;
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
		    var result = callback(symbol, short, price, open, high, low, prevClose, ask, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp);		    
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

} else if(help == true) {

    help();

} else {
    console.log("Invalid Argument.")

}


return "done";
