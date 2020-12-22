const Discord = require("discord.js");

const prefix = ">";

module.exports = {
  name: "leader",
  description: "Leader",
  async execute(message, args, client) {
    let xp = require(`../xp/${message.guild.id}.json`)

    // if(!xp[message.author.id]) {
    //   xp[message.author.id] = {
    //     xp: 0,
    //     level: 1
    //   };
    // }
    //
    // let curxp = xp[message.author.id].xp;
    // let curlvl = xp[message.author.id].level;
    // let nxtLvlXp = curlvl * 1000;
    // let difference = nxtLvlXp - curxp;

var index = 0;
var messageArray = Object.entries(xp)
.map(v => `${v[1].level} - ${v[1].ping}`)
.sort((a, b) => b.split(" - ")[0] - a.split(" - ")[0])
.splice(0, 10);

let entries = Object.entries(xp).sort(([, a], [,  b]) => b.level > a.level ? 1 : -1).slice(0, 10);
entries = entries.map(([id, { level, xp }], idb) => `${idb + 1} -  ${client.users.cache.get(id)} (level ${level}; xp ${xp})`);


    let leaderEmbed = new Discord.MessageEmbed()
    .setTitle('XP Leaderboard')
    .setColor('LUMINOUS_VIVID_PINK')
    .setDescription(`${entries.join('\n')}`)
    .setTimestamp()
    .setFooter("made by PizzaLover#8261");

    message.channel.send(leaderEmbed);

  }
}
