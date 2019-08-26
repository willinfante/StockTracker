# StockTracker

## Prerequesites

``` pi@raspberry:~# npm install ```


## Installation

``` pi@raspberry:~# git clone https://github.com/willinfante/StockTracker.git ```

## To Run The Server 

```  pi@raspberry:~/StockTracker$ node StockTracker.js -s ```

Go to http://[YOUR-IP]:8080/ and enter a stock symbol 

## To Print to the Console 

``` pi@raspberry:~/StockTracker$ node StockTracker.js -c [INSERT STOCK SYMBOL HERE]```

## To Watch Live in the console

```  pi@raspberry:~/StockTracker$ watch node StockTracker.js -c [INSERT STOCK SYMBOL] ```

## To Print Information to a Printer on your Network

``` pi@raspberry:~/StockTracker$ node StockTracker.js -p [PRINTER IP] [STOCK SYMBOL]```

## To Print Out Stock Information for multiple stocks(information is less detailed)

``` pi@raspberry:~/StockTracker$ node StockTracker.js -m [STOCK] [STOCK]```

You Can print out as many stocks as you want.

## If you forget how to do something

``` pi@raspberry:~/StockTracker$ node StockTracker.js -h```
