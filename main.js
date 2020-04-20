const Discord  = require("discord.js");
const Twit = require("twit");
const config = require("./config.json");
const twit_config = require("./twitter_config.json");

const client = new Discord.Client();
const twitter = new Twit({
  consumer_key: twit_config.consumer_key,
  consumer_secret : twit_config.consumer_secret,
  access_token:twit_config.access_token,
  access_token_secret: twit_config.access_token_secret
});

class User { // A class for storing a users socials
  constructor(_client, _discordChannelId, _discordId, _twitterId=null, _instagramId=null){
    this.client = _client // using the discord client
    this.twitterId = _twitterId; // the user twitter id
    this.instagramId = _instagramId; // the users instagram id

    this.client.channels.fetch(_discordChannelId) // get the channel object
      .then(chan => this.channel = chan)
      .catch((error) =>{
        console.error(error);
        console.error("Channel with ID: " + _discordChannelId + " could not be found");
        process.exit(0);
      });

    this.client.users.fetch(_discordId) // fetch a user object
      .then(user => this.discUser = user)
      .catch((error) =>{
        console.error(error);
        console.error("Discord User with ID: " + _discordId + " could not be found");
        process.exit(0);
      });
    }

  tweetMessage(message){ // post a social media update
    this.channel.send(this.discUser.username + " just tweeted:\n" + escapeHTML(message));
  }
}

client.on('ready', async () => { // when the client has logged in
	console.log(`Logged in as ${client.user.tag}!`);
  var mainUser = await new User(client, config.disc_channel, config.disc_id, config.twitter_id, config.instagram_id);

  var stream = twitter.stream('statuses/filter', {follow: [mainUser.twitterId]}); // start a twitter api stream to listen to all tweets from the user

  stream.on('tweet', function (tweet) { // when the user tweets
    if (!tweet.retweeted && tweet.user.id == mainUser.twitterId){ // if the tweet was not retweeted and is not a reply tweet
      mainUser.tweetMessage(escapeHTML(tweet.text));
    }
  })
});

client.login(config.token); // log the discord client in

function escapeHTML(toChange){ // Re-add symbols
  return toChange.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
}
