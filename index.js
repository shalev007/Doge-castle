import Twitter from 'twitter';
import Binance from 'node-binance-api';
import dotenv from 'dotenv';

import lastTweet from './helper/lastTweet.js';
import getTime from './helper/timer.js';

// use .env file variables
dotenv.config();

const isTest = true;

const binanceOptions = {
    APIKEY: isTest ? process.env.BINANCE_DEMO_API_KEY : process.env.BINANCE_API_KEY,
    APISECRET: isTest ? process.env.BINANCE_DEMO_API_KEY_SECRET : process.env.BINANCE_API_KEY_SECRET,
};
if(isTest) {
    binanceOptions.urls = { // test
      base: 'https://testnet.binance.vision/api/'
    }
}

const binance = new Binance().options(binanceOptions);
const amount = 1;

var twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const buyDogeAfterEveryElonTweet = async function() {
    const params = {
        screen_name: 'elonmusk',
        count: 1,
        since_id: '1387897099983990800',
        // since_id: lastTweet.get(),
        tweet_mode: 'extended'
    };

    // get Elon musk twitter timeline
    const tweets = await twitter.get('statuses/user_timeline', params);
    if(!tweets.length) {
        console.log(`${getTime()} | Elon did not mention Doge`);
        return;
    }
    // take lastest tweet
    const tweet = tweets[0];
    lastTweet.set(tweet.id);

    // if tweet contains the word doge
    if(tweet.full_text.search(/ doge/ig)) {
        console.log(`${getTime()} | Elon mentioned Doge`);
        console.log({tweet: tweet.full_text});
        // buy dogecoine
        binance.marketBuy('DOGEUSDT', amount, (error, response) => {
            console.info("Market Buy response", response);
            console.info("order id: " + response.orderId);
        });
    }
};

// run every 15 min
setInterval(buyDogeAfterEveryElonTweet, (15*60*1000));