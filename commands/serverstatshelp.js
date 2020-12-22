const Discord = require("discord.js");

const prefix = "/";

module.exports = {
  name: "serverstatshelp",
  description: "Leader",
  async execute(message, args) {

    const embed = new Discord.MessageEmbed()
    .setTitle("Help Menu")
    .setColor("ORANGE")
    .addField(prefix + "serverstats create", "Create Server Stats Category & Channels")
    .addField(prefix + "serverstats reload", "Reload The Stats")
    .addField(prefix + "serverstats reset", "Reset The Stats To Default")
    .addField(prefix + "serverstats setmember (message)", "Change Member Count Look")
    .addField(prefix + "serverstats setbots (message)", "Change Bot Count Look")
    .addField(prefix + "serverstats settotal (message)", "Change Total Users Count Look")
    .setTimestamp()



    message.channel.send(embed)
  }
}
