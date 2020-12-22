const Discord = require("discord.js");

const prefix = "/";

module.exports = {
  name: "funhelp",
  description: "Leader",
  async execute(message, args) {

    const embed = new Discord.MessageEmbed()
    .setTitle("Fun Help Menu")
    .setColor("ORANGE")
    .addField(prefix + "bonk @", "Bonks Someone")
    .addField(prefix + "rateme [@]", "Rates You Or Person You @")
    .addField(prefix + "spam @", "Spam Someone you @ 3 times (20min cooldown)")
    .addField(prefix + "hug @", "give someone a hug")
    .addField(prefix + "highfive @", "give someone a highfive")
    .setTimestamp()



    message.channel.send(embed)
  }
}
