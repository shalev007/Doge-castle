import Twitter from 'twitter';
import dotenv from 'dotenv';

import lastTweet from './helper/lastTweet.js';

// use .env file variables
dotenv.config();

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const buyDogeAfterEveryElonTweet = async function() {
    const params = {
        screen_name: 'elonmusk',
        count: 1,
        // since_id: '1387897099983990800',
        since_id: lastTweet.get(),
        tweet_mode: 'extended'
    };

    // get Elon musk twitter timeline
    const tweets = await client.get('statuses/user_timeline', params);
    if(!tweets.length) {
        return;
    }
    // take lastest tweet
    const tweet = tweets[0];
    lastTweet.set(tweet.id);

    // if tweet contains the word doge
    if(tweet.full_text.search(/ doge/ig)) {
        console.log({tweet: tweet.full_text});
        // buy dogecoine
    }
    console.dir({tweets: tweets, length: tweets.length, entities: tweet.entities})
};

// run every 15 sec
let l = setInterval(buyDogeAfterEveryElonTweet, 15 * 1000);