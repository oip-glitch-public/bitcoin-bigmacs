// server.js
// where your node app starts

// init project
var express  = require('express');
var request  = require('request');
var pug      = require('pug');
var apicache = require('apicache');
var Twit     = require('twit');
var schedule = require('node-schedule');

// Express
var app = express();

// Express settings
app.set('view engine', 'pug');
app.use(express.static('public'));

// Caching
let cache = apicache.middleware;

// App globals
app.locals.pretty = true;
let bitcoin_gbp = 0;
let bitcoin_timer_interval = 1 * 60 * 1000;
let last_bigmacs_available = 0;
//let bigmac_gbp = 2.99;

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.redirect('/bigmac');
  /*res.render('index', {
    title: '',
  });*/
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/big-macs", function (req, res) {
  res.redirect('/bigmac');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/bigmac", cache('5 minutes'), function (req, res) {
  //console.log(bitcoin_gbp);
  let bigmac_gbp = get_bigmac_price();
  //console.log('bigmac_gbp', bigmac_gbp);
  /* res.send('you can buy ' + bigmacs_available + ' big macs with 1 bitcoin');*/
  let bigmacs_available = get_bigmacs_per_bitcoin();
  //console.log('bigmacs_available', bigmacs_available);
  res.render('bigmacs', {
    bigmacs: bigmacs_available,
    bigmac_price: bigmac_gbp,
    bitcoin_price: Math.round(bitcoin_gbp * 100) / 100,
    title: 'How many Big Macs can you buy with 1 Bitcoin?',
  });
});

// get bitcoin price
// http://www.coindesk.com/api/
function get_bitcoin_price(){
  let url = 'http://api.coindesk.com/v1/bpi/currentprice.json';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      bitcoin_gbp = json.bpi.GBP.rate_float;
      console.log('bitcoin_gbp', bitcoin_gbp);
    }
  });
}

// get bigmac price
// https://fastfoodprice.co.uk/mcdonalds-prices/
  function get_bigmac_price(){
  let bigmac_gbp = 2.99;
  return bigmac_gbp;
}

// get bigmacs per bitcoin
function get_bigmacs_per_bitcoin(){
  let bigmac_gbp = get_bigmac_price();
  let bigmacs_available = Math.floor(bitcoin_gbp / bigmac_gbp);
  return bigmacs_available;
}

// start getting the bitcoin price
let bitcoin_timer = setInterval(function(){
  get_bitcoin_price();
}, bitcoin_timer_interval);
get_bitcoin_price();

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  console.log(new Date());
});

// Twit
var twit_config = {
  twitter: {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
  }
};
var T = new Twit(twit_config.twitter);

// tweet the latest price
function tweet_latest_price(){
  console.log('tweet_latest_price');
  let bigmacs_available = get_bigmacs_per_bitcoin();
  let direction = '';
  console.log('bigmacs_available', bigmacs_available);
  console.log('last_bigmacs_available', last_bigmacs_available);
  if (bigmacs_available > last_bigmacs_available) {
    direction = ' ⬆️🍔';
  }
  else if (bigmacs_available < last_bigmacs_available) {
    direction = ' ⬇🍔';
  }
  last_bigmacs_available = bigmacs_available;
  let tweet = 'You can buy ' + bigmacs_available + ' Big Macs with 1 Bitcoin' + direction;
  T.post('statuses/update', {
    status: tweet
  }, function(err, data, response) {
    if (err){
      // TODO: Proper error handling?
      console.log('Error!');
      console.log(err);
    }
    else{
      // all ok
    }
  });
}

// Scheduled jobs
// BST
// - every day at 10am
var job_10am = schedule.scheduleJob({hour: 9, minute: 0}, function(){
  console.log('job_10am');
  tweet_latest_price();
});

// - every day at 4pm
var job_4pm = schedule.scheduleJob({hour: 15, minute: 0}, function(){
  console.log('job_4pm');
  tweet_latest_price();
});

// - every day at 10pm
var job_10pm = schedule.scheduleJob({hour: 21, minute: 0}, function(){
  console.log('job_10pm');
  tweet_latest_price();
});

// - every day at 4am
var job_4am = schedule.scheduleJob({hour: 3, minute: 0}, function(){
  console.log('job_4am');
  tweet_latest_price();
});