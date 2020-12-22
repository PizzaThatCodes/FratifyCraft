const Discord = require("discord.js");

const prefix = "/";

module.exports = {
  name: "adminhelp",
  description: "Leader",
  async execute(message, args) {

    const embed = new Discord.MessageEmbed()
    .setTitle("Admin Help Menu")
    .setColor("ORANGE")
    .addField(prefix + "Kick @", "Kick's The User You Mention")
    .addField(prefix + "Ban @", "Ban's The User You Mention")
    .addField(prefix + "Clear (number)", "Clear The Chat")
    .addField(prefix + "Poll (message)", "Create's A Poll")
    .addField(prefix + "setxp (number)", "Change The Needed Xp To Level Up")
    .addField(prefix + "changeinfo (xp) (level)", "Changes Someones Xp And Level")
    .setTimestamp()



    message.channel.send(embed)
  }
}
