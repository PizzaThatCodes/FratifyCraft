const Discord = require("discord.js");

const { prefix } = require('../config.json');

module.exports = {
  name: "MessageUpdate",
  description: "help",
  async execute(newmessage, oldmessage) {

      let embed = new Discord.MessageEmbed()
      .setTitle("New Message Edited")
      .setDescription(`**User ${oldmessage.author.tag} has edited a message in <#${oldmessage.channel.id}>**`)
      .setColor('RED')
      .addField(`Old Message`, oldmessage.content, true)
      .addField(`New Message`, newmessage.content, true);

      let logchannel = oldmessage.guild.channels.cache.find(ch => ch.name === "logs");
      if(!logchannel) return;
      logchannel.send(embed).catch(err => console.log(err));
  }
}
