const Discord = require("discord.js");

const prefix = "/";

module.exports = {
  name: "xphelp",
  description: "Leader",
  async execute(message, args) {

    const embed = new Discord.MessageEmbed()
    .setTitle("XP Help Menu")
    .setColor("ORANGE")
    .addField(prefix + "rank", "Shows Player's Rank")
    .addField(prefix + "addcard (url)", "Changes The Rank Card Background")
    .addField(prefix + "addcard reset", "Resets The Rank Card Background")
    .addField(prefix + "hideavatar", "Hide The Players Avatar In >rank")
    .addField(prefix + "showavatar", "Show The Players Avatar In >rank")
    .addField(prefix + "betxp amount", "Bet Some Xp And Possibly Win More!")
    .addField("Rank Card Size", "934ⅹ282")
    .setTimestamp()


    message.channel.send(embed)
  }
}
