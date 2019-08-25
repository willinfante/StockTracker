var exec = require('child_process').exec;
var https = require('https');
var colors = require('ansi-256-colors');
var command = "https:\/\/query1.finance.yahoo.com/v7/finance/quote?fields=symbol,longName,shortName,regularMarketPrice,regularMarketTime,regularMarketChange,regularMarketDayHigh,regularMarketDayLow,regularMarketPrice,regularMarketOpen,regularMarketVolume,averageDailyVolume3Month,marketCap,bid,ask,dividendYield,dividendsPerShare,exDividendDate,trailingPE,priceToSales,tarketPricecMean&formatted=false&symbols="
var express = require('express');
var app = express();
var conout = true;
var currentRequest = false;
if(process.argv[2] == null) conout = false;

console.log(process.argv);

function isPositive(num) {
  // if something is true return true; else return false is redundant.
  return num >= 0;
}

function getData(num, dat,callback){

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

    var result = callback(symbol, short, price, open, high, low, prevClose, ask, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp);

}

https.get(command + "TSLA",(resp) =>{
          if(currentRequest == false) return;

           let data = '';

           // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
                data += chunk;
          });

         getData(0, data, function(symbol, short, price, open, high, low, prevClose, ask, pe, mktcp, regmktch, mktvol, state, bid, ask, divps, rev, sO, tradable, ftwhcp, ftwl, ftwh, ftwhc, ftwlc, ftwlcp) {

         	  if(conout == true) {
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
	 	} else {
		 	 app.listen(8080);
			 app.get('/', function(req, res){

   				 res.sendFile(__dirname + "/index.html");

			 });
			 app.get('/request', function(req, res) {
			  	currentRequest = true;
	
			  	var s = req.query.symbol;
			 
			        if(currentRequest == false) return;
				 
				res.setHeader('content-type', 'text/plain');

				res.send("STOCK REPORT - " + symbol + "(" + short + ")\n" + "MARKET PRICE : " + price + "\n" + "OPEN : " + open + "\n" + "HIGH : " + high + "\n" +"P/E RATIO : " + pe + "\n" + "MARKET CAP : " + mktcp + "\n" +"MARKET CHANGE(DAY) : " + regmktch + "\n" +"ASK: " + ask + "\n" + "BID : " + bid + "\n" +   "MARKET VOLUME : " + mktvol + "\n" +       "PREVIOUS CLOSE PRICE : " + prevClose  + "\n" +      "DIVIDENDS PER SHARE : " + divps + "\n" +     "REVENUE : " + rev + "\n" +      "SHARES OUTSTANDING : " + sO + "\n" +    "TRADABLE : " + tradable + "\n" +     "------HISTORICAL-------"  + "\n" +     "FIFTY-TWO WEEK HIGH : " + ftwh + "\n" +      "FIFTY-TWO WEEK HIGH CHANGE : " + ftwhc + "\n" +      "FIFTY-TWO WEEK HIGH CHANGE PERCENT : " + ftwhcp + "\n" +    "FIFTY-TWO WEEK LOW : " + ftwl + "\n" +    "FIFTY-TWO WEEK LOW CHANGE : " + ftwlc  + "\n" +  "FIFTY-TWO WEEK LOW CHANGE PERCENT : " + ftwlcp);
			});
		 
		 }
		 

        });
   });
}



