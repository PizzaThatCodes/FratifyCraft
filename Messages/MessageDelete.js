const Discord = require("discord.js");

const { prefix } = require('../config.json');

module.exports = {
  name: "MessageDelete",
  description: "help",
  async execute(message) {

    let embed = new Discord.MessageEmbed()
    .setTitle("New Message Deleted")
    .setColor('RED')
    .setDescription(`**User ${message.author.tag} has deleted a message in <#${message.channel.id}>**`)
    .addField(`Message`, message.content, true);

    let logchannel = message.guild.channels.cache.find(ch => ch.name === "logs");
    if(!logchannel) return;
    logchannel.send(embed).catch(err => console.log(err));
  }
}
