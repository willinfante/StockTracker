# StockTracker
PREREQUISITES 

> pi@raspberry:~# npm install


HOW TO USE/INSTALL 


> pi@raspberry:~# git clone https://github.com/willinfante/StockTracker.git 

To Run The Server 

>  pi@raspberry:~/StockTracker$ node StockTracker.js 

Go to http://[YOUR-IP]:8080/ and enter a stock symbol 

To Print to the Console 

>  pi@raspberry:~/StockTracker$ node StockTracker.js -c [INSERT STOCK SYMBOL HERE]

if you want to watch it live in the console, then

>  pi@raspberry:~/StockTracker$ watch node StockTracker.js -c [INSERT STOCK SYMBOL]
