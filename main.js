const Discord  = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

class User { // A class for storing a users socials
  constructor(_client, _discordChannelId, _discordId, _twitterId=null, _instagramId=null){
    this.client = _client // using the discord client
    this.discordId = _discordId; // the users discord id that is having their socials tracked
    this.twitterId = _twitterId; // the user twitter id
    this.instagramId = _instagramId; // the users instagram id

    this.client.channels.fetch(_discordChannelId)
      .then(chan => this.channel = chan)
      .catch((error) =>{
        console.error(error);
        console.error("Channel with ID: " + _discordChannelId + " could not be found");
        process.exit(0);
      });
  }

  postMessage(message){
    this.channel.send(message);
  }

}

client.on('ready', async () => { // when the client has logged in
	console.log(`Logged in as ${client.user.tag}!`);
  var mainUser = await new User(client, config.disc_channel, config.disc_id, config.twitter_id, config.instagram_id);

});

client.login(config.token); // log the discord client in
