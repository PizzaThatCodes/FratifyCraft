const Discord = require("discord.js");

const prefix = "/";

module.exports = {
  name: "musichelp",
  description: "Leader",
  async execute(message, args) {

    let lvlEmbed = new Discord.MessageEmbed()
    .setAuthor("Music Commands")
    .setColor("ORANGE")
        .addField(prefix + "play <url/title/playlist url>", "Play Music")
        .addField(prefix + "stop", "stops the music")
        .addField(prefix + "skip", "skip a song")
        .addField(prefix + "resume", "resume the music")
        .addField(prefix + "pause", "pause the music")
        .addField(prefix + "np", "see whats playing")
        .addField(prefix + "queue", "Check the queue")
        .addField(prefix + "volume", "Change the Volume")
        .setTimestamp()

    message.channel.send(lvlEmbed);
  }
}
