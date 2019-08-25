# StockTracker
PREREQUISITES 
1. pi@raspberry:~# apt install nodejs 
2. pi@raspberry:~# apt install npm 
3. pi@raspberry:~# npm install express 
4. pi@raspberry:~# npm install ansi-256-colors 
5. pi@raspberry:~# npm install https 


HOW TO USE/INSTALL 

1. pi@raspberry:~# git clone https://github.com/willinfante/StockTracker.git 

To Run The Server 

2. pi@raspberry:~/StockTracker$ node StockTracker.js 

Go to http://[YOUR-IP]:8080/ and enter a stock symbol 

To Print to the Console 

3. pi@raspberry:~/StockTracker$ node StockTracker.js -c [INSERT STOCK SYMBOL HERE]

if you want to watch it live in the console, then

4. pi@raspberry:~/StockTracker$ watch node StockTracker.js -c [INSERT STOCK SYMBOL HERE]



COMING SOON


Watching Multiple Stocks in the Console
