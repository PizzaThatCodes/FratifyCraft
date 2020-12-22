const Discord = require("discord.js");

const prefix = "/";

module.exports = {
  name: "help",
  description: "Leader",
  async execute(message, args) {

    const embed = new Discord.MessageEmbed()
    .setTitle("Help Menu")
    .setColor("ORANGE")
    .addField(prefix + "help", "Shows This Message")
    .addField(prefix + "help xp", "Shows XP Command's")
    .addField(prefix + "help music", "Shows Music Command's")
    .addField(prefix + "help admin", "Show Admin Command's")
    .addField(prefix + "help fun", "Show Fun Commands")
    .addField(prefix + "help serverstats", "Show ServerStats Command's")
    .addField(prefix + "support", "Sends You A Link To The Support Server")
    .setTimestamp()



    message.channel.send(embed)
  }
}
