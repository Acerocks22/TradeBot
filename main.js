/**
NOTE TO AUSTIN:
Welcome to my messy excuse of a WIP TradeBot. Sorry if the code is a bit annoying to follow, I'm not the best at organization. The accept code begins at Line 195.

NOTE-TO-SELF
~~~~~~~~~~~
TO-DO:
-Create if-statements for "selling" and "buying" (needed?)
-Create a way to prevent non-duplicate cards from being traded.
-Find better way to only show pending trades in the bot's "analysis" of the trades.
**/

//Here are all of the variables. Some are unused, of course, cleaning up the entire code of unused stuff is on my agenda once this thing works.

var fetch = require("node-fetch");
var request = require("request");
var fs = require("fs");
var qs = require('qs');
//var notif = require('node-notifier');
var exports = module.exports;

var CLAY_API_URL = 'https://clay.io/api/mittens/v1/';
var ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ1c2VySWQiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUiLCJzY29wZXMiOlsiKiJdLCJpYXQiOjE0NjQxMTg4MjEsImlzcyI6ImNsYXkiLCJzdWIiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUifQ.bIt9IUVm8VjXbKw7ore3Hrc77Pj0hcvaiyyulKMA5jbJXovTR3bRL-P_MF-ce-VKQxZ9QWrynjDD4BW2UA4KZw';
var WEB = 'https://clay.io/api/mittens/v1/trades?accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ1c2VySWQiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUiLCJzY29wZXMiOlsiKiJdLCJpYXQiOjE0NjgyODcxNDIsImlzcyI6ImNsYXkiLCJzdWIiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUifQ.UtBBYE958CB2ro9fTX2zJnzFhARAxRdmuufUSSDYf87rVTFy7nF5KQ9-_T3kiAEb73iVB6bLKEQ5cqGTVW63Yw&clientVersion=1';
var tradeChat = 'https://clay.io/api/mittens/v1/chatMessages?accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ1c2VySWQiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUiLCJzY29wZXMiOlsiKiJdLCJpYXQiOjE0NjQxMTg4MjEsImlzcyI6ImNsYXkiLCJzdWIiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUifQ.bIt9IUVm8VjXbKw7ore3Hrc77Pj0hcvaiyyulKMA5jbJXovTR3bRL-P_MF-ce-VKQxZ9QWrynjDD4BW2UA4KZw&clientVersion=1&channel=trade&crewId=41d67b48-6d79-4037-adf4-e9308dbb054d';

var TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ1c2VySWQiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUiLCJzY29wZXMiOlsiKiJdLCJpYXQiOjE0NjQxMTg4MjEsImlzcyI6ImNsYXkiLCJzdWIiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUifQ.bIt9IUVm8VjXbKw7ore3Hrc77Pj0hcvaiyyulKMA5jbJXovTR3bRL-P_MF-ce-VKQxZ9QWrynjDD4BW2UA4KZw';
var LINK = 'https://clay.io/api/mittens/v1/chatMessages/';

var evenTrade = '0';
var sendPrice;
var receivePrice;
var sendNumber;
var receiveNumber;
var cardSType;
var cardRType;
var receiveGold = 0;
var sendGold = 0;
var currentGold;
var select;
var MAX_SELL_AMOUNT = 20;
var MAX_BUY_AMOUNT = 20;
var sellAmount = 0;
var buyAmount = 0;
var gold;
var goldContents;
var tradeAmount = 0;
var totalTradesAccepted = 0;
var totalTradesDenied = 0;
var tradeStatus = 'sell';
var ping = "https://clay.io/api/mittens/v1/ping";
var ip = "http://whatismyip.org/";

var isSingle = 'false';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
// parse application/json
app.use(bodyParser.json());

checkTrade();

function checkTrade() {
request(ping, function(error, response, body) {
	console.log(body);
});
	
//Obtains your current gold amount.
var goldCheck = 'https://clay.io/api/mittens/v1/users/me?accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ1c2VySWQiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUiLCJzY29wZXMiOlsiKiJdLCJpYXQiOjE0Nzg0ODExODEsImlzcyI6ImNsYXkiLCJzdWIiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUifQ.ALZgHdL8TMncP0Z356gW2oRlTUjtb3vm0ZOkyIhg7I-qjweB3_DXWOYwTmjC-1R_HFRpyNzH54I6Y58BJMMrRg&clientVersion=1'
request(goldCheck, function(error, response, body) {
	fs.writeFile('./goldcheck.json', body, (err) => {
		if (err) throw err;
		console.log('Gold Data saved to File...');
		goldContents = fs.readFileSync("./goldcheck.json");
		info = JSON.stringify(goldContents);
		
		currentGold = info.gold;
		console.log(currentGold);
		console.log('Gold Data saved to Bot...');
	});
});

// =Trade Checker Script starts here=

//Load JSON to File.
	request(WEB, function(error, response, body) {
		fs.writeFile('./output.json', body, (err) => {
			if (err) throw err;
			console.log('Trade Data saved to File.');
			var contents = fs.readFileSync("./output.json");
			var trades = JSON.stringify(contents);
			console.log(trades);

				//The "4" in this case is how many trades the bot will look at. Change as neccesary.
				
				for(select = 0; select < 5; ++select) {
					var trade = trades[select];
					// Set variables for status and deny checks.
					if (trade == undefined) {
						return;
					}
					var status = trade.status;
					// Check if trade has status 'pending', and isn't already denied.
					// AUSTIN: you had comma here instead of &&. Not sure why you're checked the declinedUserIds against some id, removed
					if (status === 'pending' && trade.declinedByUserIds[0] !== 'd7618969-cdc4-4a39-863f-17119f9ec66d') {
						var receiveCount = 0;
						for(i = 0; i < trade.sendItems.length; i++) {
							sendCount += 1;

							cardRType = trade.sendItems[i]['item'].subTypes['0'];
							cardRVol = trade.sendItems[i]['item'].volume;
							receiveCount = receiveCount + parseFloat(trade.sendItems[i].count, 10);
						}
						// Gold is displayed after the loop, as it doesn't have duplicates
						receiveGold = parseFloat(trade.sendGold, 10);
						// Price Cards depending on what type they are and how many of them there are in the trade.
						if (cardRType === 'blue' && cardRVol === 2) {
							receivePrice = receiveCount *= 100
						} else if (cardRType === 'green' && cardRVol === 2) {
							receivePrice = receiveCount *= 200
						} else if (cardRType === 'red' && cardRVol === 2) {
							receivePrice = receiveCount *= 300
						} else if (cardRType === 'silver' && cardRVol === 2) {
							receivePrice = receiveCount *= 500
						}
						if (cardRType === 'blue' && cardRVol === 1) {
							receivePrice = receiveCount *= 200
						} else if (cardRType === 'green' && cardRVol === 1) {
							receivePrice = receiveCount *= 400
						} else if (cardRType === 'red' && cardRVol === 1) {
							receivePrice = receiveCount *= 500
						} else if (cardRType === 'silver' && cardRVol === 1) {
							receivePrice = receiveCount *= 800
						}
						if (receiveGold !== '') {
							receivePrice = receiveCount += receiveGold
						}
						var sendCount = 0;
						for(i = 0; i < trade.receiveItems.length; i++) {

							cardSType = trade.receiveItems[i]['item'].subTypes['0'];
							cardSVol = trade.receiveItems[i]['item'].volume;
							sendCount = sendCount + parseFloat(trade.receiveItems[i].count,10);
						}

						sendGold = parseFloat(trade.receiveGold, 10);
						if (cardSType === 'blue' && cardSVol === 2) {
							sendPrice = sendCount *= 100
						} else if (cardSType === 'green' && cardSVol === 2) {
							sendPrice = sendCount *= 200
						} else if (cardSType === 'red' && cardSVol === 2) {
							sendPrice = sendCount *= 300
						} else if (cardSType === 'silver' && cardSVol === 2) {
							sendPrice = sendCount *= 500
						}
						if (cardSType === 'blue' && cardSVol === 1) {
							sendPrice = sendCount *= 200
						} else if (cardSType === 'green' && cardSVol === 1) {
							sendPrice = sendCount *= 400
						} else if (cardSType === 'red' && cardSVol === 1) {
							sendPrice = sendCount *= 500
						} else if (cardSType === 'silver' && cardSVol === 1) {
							sendPrice = sendCount *= 800
						}
						if (sendGold !== ' ') {
							sendPrice = sendCount += sendGold
						}
						/*if (trade.receiveItems === undefined) {
							var name = trade.receiveItems[i]['item'].name;
							var vol = trade.receiveItems[i]['item'].volume;
						}*/
						// checkSingle();
						
						//Bunch of variables for testing random crap, mostly irrelevant to the actual code.
						var id = trade.id;
						// AUSTIN: what you had here this definitely is not the accessToken
						var url = CLAY_API_URL + 'trades/' + trade.id + '?accessToken=' + ACCESS_TOKEN + '&clientVersion=1';
						var url2 = LINK  + '?accessToken=' + TOKEN + '&clientVersion=1';
						
						var playerId = trade['from'].id
						
						if (receivePrice === sendPrice && status === 'pending' && sellAmount <= MAX_SELL_AMOUNT && sendGold <= currentGold && playerId != 'ae8fbd3f-2349-4dcf-9f3e-eef1253a7643' && isSingle === 'false') {
							console.log('Fair Trade! Accepting...');
							totalTradesAccepted += 1;
							//Trade accept code starts here
							request({
								method: 'PUT',
								preambleCRLF: true,
								postambleCRLF: true,
								uri: url,
								multipart: {
									data: [
										{
										'content-type': 'application/json',
										body: JSON.stringify({status: 'approved'})
										}
									]
								}
							},
							function (error, response, body) {
								if (error) {
									return console.error('upload failed:', error);
								}
								tradeAmount += 1;
							})
							
							request({
								method: 'POST',
								preambleCRLF: true,
								postambleCRLF: true,
								uri: url2,
								json: {
									body: "~FAIR TRADE~\nACCEPTED\n-------\nYou sent  " + receivePrice + "g in cards/gold.\nYou received " + sendPrice + "g in cards/gold.\n-------\nEnjoy! ฅ^•ﻌ•^ฅ",
									toId: playerId
								}
							},
							function (error, response, body) {
								if (error) {
									return console.error('upload failed:', error);
								}
							})
						} else if (receivePrice !== sendPrice && status === 'pending' || sendGold > currentGold || playerId === 'ae8fbd3f-2349-4dcf-9f3e-eef1253a7643') {
							console.log('Trade is unfair! Rejecting Trade...');
							totalTradesDenied += 1;
							
							var urld = CLAY_API_URL + 'trades/' + trade.id + '/declinedByUserIds' + '?accessToken=' + ACCESS_TOKEN + '&clientVersion=1';
							
							request({
								method: 'POST',
								preambleCRLF: true,
								postambleCRLF: true,
								uri: urld,
								json: {
									declinedByUserIds: ["d7618969-cdc4-4a39-863f-17119f9ec66d"]
								}
							},
							function (error, response, body) {
								if (error) {
									return console.error('upload failed:', error);
								}
							})
							request({
								method: 'POST',
								preambleCRLF: true,
								postambleCRLF: true,
								uri: url2,
								json: {
									body: "NOT ACCEPTED\n-------\nEither you sent an unfair trade, or you're blacklisted from using the Bot.\n-------\n>You sent  " + receivePrice + "g in cards/gold.\nYou would've received " + sendPrice + "g in cards/gold.\n-------\nTry resending a fair trade. ฅ^•ﻌ•^ฅ",
									toId: playerId
								}
							},
							function (error, response, body) {
								if (error) {
									return console.error('upload failed:', error);
								}
							})
						}
						sendPrice = sendPrice -= sendPrice;
						receivePrice = receivePrice -= receivePrice;
						sellAmount = 0;
					}
				};
				console.log("TOTAL TRADES ACCEPTED: " + totalTradesAccepted);
				console.log("TOTAL TRADE DENIED: " + totalTradesDenied);
		});
	});
}

setInterval(checkTrade, 30000);



function sendAd() {
	if (tradeStatus === 'buy') {
		request({
			method: 'POST',
			preambleCRLF: true,
			postambleCRLF: true,
			uri: tradeChat,
			json:	{
				body: "BUYING:\n----------\nBase Cards ONLY\n----------\nDo NOT take singles!\n----------\n20 Blue: 2000g\n20 Green: 4000g\n20 Red: 6000g\n20 Silver 10000g\n----------\nTradeBot Status: ONLINE\nTotal Trades Accepted since last startup: " + totalTradesAccepted,
				channel: "trade"
			}
		},
		function (error, response, body) {
			if (error) {
				return console.error('upload failed:', error);
			}
		})
	} 
	if (tradeStatus === 'sell') {
		request({
		method: 'POST',
		preambleCRLF: true,
		postambleCRLF: true,
		uri: tradeChat,
		json:	{
			body: "SELLING:\n----------\nBase Cards ONLY\n----------\nDo NOT take singles!\n----------\n20 Blue: 2000g\n20 Green: 4000g\n20 Red: 6000g\n20 Silver 10000g\n----------\nTradeBot Status: ONLINE\nTotal Trades Accepted since last startup: " + totalTradesAccepted,
			channel: "trade"
		}
	},
	function (error, response, body) {
		if (error) {
			return console.error('upload failed:', error);
		}
	})
	}
	if (tradeStatus === 'both') {
		request({
		method: 'POST',
		preambleCRLF: true,
		postambleCRLF: true,
		uri: tradeChat,
		json:	{
			body: "SELLING/BUYING:\n----------\nBase Cards ONLY\n----------\nDo NOT take singles!\n----------\n20 Blue: 2000g\n20 Green: 4000g\n20 Red: 6000g\n20 Silver 10000g\n----------\nTradeBot Status: ONLINE\nTotal Trades Accepted since last startup: " + totalTradesAccepted,
			channel: "trade"
		}
	},
	function (error, response, body) {
		if (error) {
			return console.error('upload failed:', error);
		}
	})
	}
}

//setInterval(sendAd, 3600000)

var cardurl = 'https://clay.io/api/mittens/v1/items/?accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ1c2VySWQiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUiLCJzY29wZXMiOlsiKiJdLCJpYXQiOjE0NjQxMTg4MjEsImlzcyI6ImNsYXkiLCJzdWIiOiI5Y2MzZmU4YS02MDgyLTRkZGEtYTkzYi05NjMzODI5M2M0ZTUifQ.bIt9IUVm8VjXbKw7ore3Hrc77Pj0hcvaiyyulKMA5jbJXovTR3bRL-P_MF-ce-VKQxZ9QWrynjDD4BW2UA4KZw&clientVersion=1';

function checkSingle() {
	request(cardurl, function(error, response, body) {
		fs.writeFile('KittenBot/goldcheck.json', body, (err) => {
			if (err) throw err;
			cardContents = fs.readFileSync("KittenBot/cards.json");
			card = JSON.parse(cardContents);
		});
	});
	
	if (vol = 2) {
		
	} else if (vol = 1) {
		
	}
}

// Default Bot Accept Code. DO NOT DELETE
/**	
var url = CLAY_API_URL + '/v1/trades/' + trade.id + accessToken;
if (evenTrade === 'true') {
	console.log('Fair Trade! Accepting...');
	request({
		method: 'PUT',
		preambleCRLF: true,
		postambleCRLF: true,
		uri: CLAY_API_URL + '/v1/trades?accessToken=' + ACCESS_TOKEN + '&clientVersion=1',
		multipart: {
			data: [
				{
				'content-type': 'application/json',
				body: JSON.stringify({status: 'approved'})
				}
			]
		}
	},
	function (error, response, body) {
		if (error) {
			return console.error('upload failed:', error);
		}
		console.log('Trade Accepted Successfully! :D');
	})
}
**/
