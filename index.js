const { Client, Attachment, Util } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const cheerio = require("cheerio");
const request = require("request");
const Canvas = require("canvas");
const canvacord = require("canvacord");
const ytdl = require("ytdl-core");
const Youtube = require("simple-youtube-api");
const axios = require("axios");

const youtube = new Youtube("AIzaSyCFNeRn2cRcn7MsIXUJx_DsUkospUAU7jM");
const queue = new Map();

const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
client.commands = new Discord.Collection();
client.Messages = new Discord.Collection();
const spamnerd = new Set();
const gamble = new Set();


const prefix = "/";
const { token } = require('./config.json');

client.on('ready', () => {
  console.log("Bot Is Up!")
  console.log(`Logged in as ${client.user.tag}`)
  setInterval(() => {
    client.user.setActivity("for /help", { type: "WATCHING" }).then(() => {
      client.user.setActivity("Nerds", { type: "PLAYING"})
    })
  }, 5000); // Runs this every 5 seconds.
});

client.on("guildCreate", (guild) => {
  if(!fs.existsSync(`./RankCards/${guild.id}.json`)) {
    fs.writeFileSync(`./RankCards/${guild.id}.json`, JSON.stringify({}, null, 4));
  }
  if(!fs.existsSync(`./xp/${guild.id}.json`)) {
    fs.writeFileSync(`./xp/${guild.id}.json`, JSON.stringify({}, null, 4));
  }
  if(!fs.existsSync(`./needxp/${guild.id}.json`)) {
    fs.writeFileSync(`./needxp/${guild.id}.json`, JSON.stringify({}, null, 4));
  }
  if(!fs.existsSync(`./serverstats/${guild.id}.json`)) {
    fs.writeFileSync(`./serverstats/${guild.id}.json`, JSON.stringify({}, null, 4));
  }
})

// ╔═══╗╔═══╗     ╔═══╗╔════╗╔╗─╔╗╔═══╗╔═══╗
// ║╔══╝║╔═╗║     ║╔═╗║║╔╗╔╗║║║─║║║╔══╝║╔══╝
// ║╚══╗║╚══╗     ║╚══╗╚╝║║╚╝║║─║║║╚══╗║╚══╗
// ║╔══╝╚══╗║     ╚══╗║──║║──║║─║║║╔══╝║╔══╝
// ║║───║╚═╝║     ║╚═╝║──║║──║╚═╝║║║───║║───
// ╚╝───╚═══╝     ╚═══╝──╚╝──╚═══╝╚╝───╚╝───
const commandFiles = fs
  .readdirSync("./commands/")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
};

const messagerFiles = fs
  .readdirSync("./Messages/")
  .filter(file => file.endsWith(".js"));
for (const file of messagerFiles) {
  const command = require(`./Messages/${file}`);
  client.Messages.set(command.name, command);
};


// ╔╗─╔╗╔═══╗╔═══╗╔═══╗╔════╗╔═══╗     ╔═══╗╔════╗╔╗─╔╗╔═══╗╔═══╗
// ║║─║║║╔═╗║╚╗╔╗║║╔═╗║║╔╗╔╗║║╔══╝     ║╔═╗║║╔╗╔╗║║║─║║║╔══╝║╔══╝
// ║║─║║║╚═╝║─║║║║║║─║║╚╝║║╚╝║╚══╗     ║╚══╗╚╝║║╚╝║║─║║║╚══╗║╚══╗
// ║║─║║║╔══╝─║║║║║╚═╝║──║║──║╔══╝     ╚══╗║──║║──║║─║║║╔══╝║╔══╝
// ║╚═╝║║║───╔╝╚╝║║╔═╗║──║║──║╚══╗     ║╚═╝║──║║──║╚═╝║║║───║║───
// ╚═══╝╚╝───╚═══╝╚╝─╚╝──╚╝──╚═══╝     ╚═══╝──╚╝──╚═══╝╚╝───╚╝───

client.on("messageUpdate", async(oldmessage,newmessage) => {
      if (oldmessage.author.bot) return;
     client.Messages.get("MessageUpdate").execute(newmessage, oldmessage);
});
client.on("messageDelete", async(message) => {
      if (message.author.bot) return;
  client.Messages.get("MessageDelete").execute(message);
});

client.on("guildMemberRemove", async member => {
  let memberstats = null;
  let totalstats = null;
  let botstats = null;

  const serverstats = require(`./serverstats/${member.guild.id}.json`);

    if(!serverstats[member.guild.id]) {
      serverstats[member.guild.id] = {
        oldmember: "Member: ",
        oldtotal: "Total Users: ",
        oldbots: "Bots: ",


        member: "Member: ",
        total: "Total Users: ",
        bots: "Bots: "
      };
    }

  if(member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldmember} ${member.guild.members.cache.filter(m => !m.user.bot).size}`)) {
       memberstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldmember} ${member.guild.members.cache.filter(m => !m.user.bot).size}`)
    } else {
       memberstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].member} ${member.guild.members.cache.filter(m => !m.user.bot).size}`)
    }
    if(member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldtotal} ${member.guild.memberCount}`)) {
         totalstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldtotal} ${member.guild.memberCount}`)
      } else {
         totalstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].total} ${member.guild.memberCount}`)
      }
      if(member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldbots} ${member.guild.members.cache.filter(m => m.user.bot).size}`)) {
           botstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldbots} ${member.guild.members.cache.filter(m => m.user.bot).size}`)
        } else {
           botstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].bots} ${member.guild.members.cache.filter(m => m.user.bot).size}`)
        }

               member.guild.channels.cache.get(memberstats.id).setName(`${serverstats[member.guild.id].member} ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
                    member.guild.channels.cache.get(totalstats.id).setName(`${serverstats[member.guild.id].total} ${member.guild.memberCount}`);
                         member.guild.channels.cache.get(botstats.id).setName(`${serverstats[member.guild.id].bots} ${member.guild.members.cache.filter(m => m.user.bot).size}`);
});
client.on("guildMemberAdd", async member => {
  let memberstats = null;
  let totalstats = null;
  let botstats = null;

  const serverstats = require(`./serverstats/${member.guild.id}.json`);

    if(!serverstats[member.guild.id]) {
      serverstats[member.guild.id] = {
        oldmember: "Member: ",
        oldtotal: "Total Users: ",
        oldbots: "Bots: ",


        member: "Member: ",
        total: "Total Users: ",
        bots: "Bots: "
      };
    }

  if(member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldmember} ${member.guild.members.cache.filter(m => !m.user.bot).size}`)) {
       memberstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldmember} ${member.guild.members.cache.filter(m => !m.user.bot).size}`)
    } else {
       memberstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].member} ${member.guild.members.cache.filter(m => !m.user.bot).size}`)
    }
    if(member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldtotal} ${member.guild.memberCount}`)) {
         totalstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldtotal} ${member.guild.memberCount}`)
      } else {
         totalstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].total} ${member.guild.memberCount}`)
      }
      if(member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldbots} ${member.guild.members.cache.filter(m => m.user.bot).size}`)) {
           botstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].oldbots} ${member.guild.members.cache.filter(m => m.user.bot).size}`)
        } else {
           botstats = member.guild.channels.cache.find(c => c.name == `${serverstats[member.guild.id].bots} ${member.guild.members.cache.filter(m => m.user.bot).size}`)
        }

               member.guild.channels.cache.get(memberstats.id).setName(`${serverstats[member.guild.id].member} ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
                    member.guild.channels.cache.get(totalstats.id).setName(`${serverstats[member.guild.id].total} ${member.guild.memberCount}`);
                         member.guild.channels.cache.get(botstats.id).setName(`${serverstats[member.guild.id].bots} ${member.guild.members.cache.filter(m => m.user.bot).size}`);


                         var MemberRole = member.guild.roles.cache.find(r => r.name === "[Member]");
                          member.roles.add(MemberRole);

});



const huged = new Discord.MessageEmbed()
.setDescription("You huged yourself...")
.setImage("https://cdn.discordapp.com/attachments/777312270496825376/781752437764784158/image0.gif")
.setColor("DARK_GREY");

const highFive = new Discord.MessageEmbed()
.setDescription("You highfived yourself...")
.setColor("DARK_GREY");


client.on("message", async message => {
  if(!fs.existsSync(`./serverstats/${message.guild.id}.json`)) {
    fs.writeFileSync(`./serverstats/${message.guild.id}.json`, JSON.stringify({}, null, 4));
  }

const serverstats = require(`./serverstats/${message.guild.id}.json`);

  if(!serverstats[message.guild.id]) {
    serverstats[message.guild.id] = {
      oldmember: "Member: ",
      oldtotal: "Total Users: ",
      oldbots: "Bots: ",


      member: "Member: ",
      total: "Total Users: ",
      bots: "Bots: "
    };
  }

  fs.writeFileSync(`./serverstats/${message.guild.id}.json`, JSON.stringify(serverstats, null, 4), (err) => {
  if(err) console.log(err)
  });

  const msg = message.content.toLowerCase();
  const mention = message.mentions.users.first();
  const mentionMember = message.mentions.members.first();
  const mentionMessage = message.content.slice(8);

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

if(command === "help") {
    if(args.toString() === "xp") {
      client.commands.get("xphelp").execute(message, args)
    }else if(args.toString() === "music") {
      client.commands.get("musichelp").execute(message, args)
    } else if(args.toString() === "admin"){
      client.commands.get("adminhelp").execute(message, args)
    } else if(args.toString() === "fun"){
      client.commands.get("funhelp").execute(message, args)
    } else if(args.toString() === "serverstats"){
      client.commands.get("serverstatshelp").execute(message, args)
    } else {
    client.commands.get("help").execute(message, args)
    }
  }

if(command === "poll") {
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("You Do Not Have Perms!");
  if(!args) return message.channel.send("Please Put What The Poll Is For")
  let embed = new Discord.MessageEmbed()
  .setTitle(`${args.join(' ')}`)
  .setColor("ORANGE")
  .setDescription(`React 👍 For Yes\nReact 👎 For No`)
  .setTimestamp()
  .setFooter("Get PizzaBot At http://pizzaclient.ddns.net/pizzabot/get.html")

  message.channel.send(embed).then(msgf => {
    msgf.react('👍')
    msgf.react('👎')
  })
}

if(command == "clear") {
  let deleteAmount;

    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send('You Do Not Have Perms');

    if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return message.reply('Please put a number only!') }

    if (parseInt(args[0]) > 100) {
        return message.reply('You can only delete 100 messages at a time!')
    } else {
        deleteAmount = parseInt(args[0]);
    }

    message.channel.bulkDelete(deleteAmount + 1, true);
    message.reply(`**Successfully** Deleted ***${deleteAmount}*** Messages.`).then(msgf => {
      msgf.delete({ timeout: 5000});
    })
}

if(command === "kick") {
    if(!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send("You Do Not Have Perms!");
    const user = message.mentions.users.first();
        if (user) {

          const member = message.guild.member(user);
          if (member) {

            member
              .kick('Optional reason that will display in the audit logs')
              .then(() => {
                // We let the message author know we were able to kick the person
                message.reply(`Successfully kicked ${user.tag}`);
              })
              .catch(err => {
                message.reply('I was unable to kick the member');
                console.error(err);
              });
          } else {
            message.reply("That user isn't in this guild!");
          }
        } else {
          message.reply("You didn't mention the user to kick!");
        }
  }

if(command === "ban") {
        if(!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("You Do Not Have Perms!");
    const user = message.mentions.users.first();

if (user) {

  const member = message.guild.member(user);
  if (member) {

    member
      .ban({
        reason: 'They Were An Nerd!',
      })
      .then(() => {
        message.reply(`Successfully banned ${user.tag}`);
      })
      .catch(err => {
        message.reply('I was unable to ban the member');

        console.error(err);
      });
  } else {
    message.reply("That user isn't in this guild!");
  }
} else {
  message.reply("You didn't mention the user to ban!");
  }
}

if(command === "serverstats") {
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("You Do Not Have Perms!");

if(args[0].toLowerCase() === "create") {
    const category2 = message.guild.channels.cache.find(c => c.name == `${message.guild.name} Server Stats`)
  if(!category2) {
    message.guild.channels.create(`${message.guild.name} Server Stats`, {
    type: 'category',
    permissionOverwrites: [
       {
         id: message.guild.roles.everyone,
         deny: ['CONNECT'],
      },
    ],
  }).then(() => {
  const category = message.guild.channels.cache.find(c => c.name == `${message.guild.name} Server Stats`)

  fs.writeFileSync(`./serverstats/${message.guild.id}.json`, JSON.stringify(serverstats, null, 4), (err) => {
  if(err) console.log(err)
  });

message.guild.channels.create(`${serverstats[message.guild.id].member} ${message.guild.members.cache.filter(m => !m.user.bot).size}`, {
  type: 'voice',
  parent: category.id,
  permissionOverwrites: [
     {
       id: message.guild.roles.everyone,
       deny: ['CONNECT'],
    },
  ],
})
message.guild.channels.create(`${serverstats[message.guild.id].total} ${message.guild.memberCount}`, {
type: 'voice',
    parent: category.id,
permissionOverwrites: [
   {
     id: message.guild.roles.everyone,
     deny: ['CONNECT'],
  },
],
})
message.guild.channels.create(`${serverstats[message.guild.id].bots} ${message.guild.members.cache.filter(m => m.user.bot).size}`, {
type: 'voice',
    parent: category.id,
permissionOverwrites: [
   {
     id: message.guild.roles.everyone,
     deny: ['CONNECT'],
  },
],
})

  })
} else {

  const category = message.guild.channels.cache.find(c => c.name == `${message.guild.name} Server Stats`)

  fs.writeFileSync(`./serverstats/${message.guild.id}.json`, JSON.stringify(serverstats, null, 4), (err) => {
  if(err) console.log(err)
  });

message.guild.channels.create(`${serverstats[message.guild.id].member} ${message.guild.members.cache.filter(m => !m.user.bot).size}`, {
  type: 'voice',
  parent: category.id,
  permissionOverwrites: [
     {
       id: message.guild.roles.everyone,
       deny: ['CONNECT'],
    },
  ],
})
message.guild.channels.create(`${serverstats[message.guild.id].total} ${message.guild.memberCount}`, {
type: 'voice',
    parent: category.id,
permissionOverwrites: [
   {
     id: message.guild.roles.everyone,
     deny: ['CONNECT'],
  },
],
})
message.guild.channels.create(`${serverstats[message.guild.id].bots} ${message.guild.members.cache.filter(m => m.user.bot).size}`, {
type: 'voice',
    parent: category.id,
permissionOverwrites: [
   {
     id: message.guild.roles.everyone,
     deny: ['CONNECT'],
  },
],
})

    }
}

if(args[0].toLowerCase() === "reload") {
  let memberstats = null;
  let totalstats = null;
  let botstats = null;

  const memberyay = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldmember} ${message.guild.members.cache.filter(m => !m.user.bot).size}`)
    const totalyay = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldtotal} ${message.guild.memberCount}`)
      const botyay = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldbots} ${message.guild.members.cache.filter(m => m.user.bot).size}`)

if(memberyay) {
  if(message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldmember} ${message.guild.members.cache.filter(m => !m.user.bot).size}`)) {
       memberstats = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldmember} ${message.guild.members.cache.filter(m => !m.user.bot).size}`)
    } else {
       memberstats = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].member} ${message.guild.members.cache.filter(m => !m.user.bot).size}`)
    }
  } else {
    return;
  }

if(totalyay) {
    if(message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldtotal} ${message.guild.memberCount}`)) {
         totalstats = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldtotal} ${message.guild.memberCount}`)
      } else {
         totalstats = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].total} ${message.guild.memberCount}`)
      }
    } else {
      return;
    }

if(botyay) {
      if(message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldbots} ${message.guild.members.cache.filter(m => m.user.bot).size}`)) {
           botstats = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldbots} ${message.guild.members.cache.filter(m => m.user.bot).size}`)
        } else {
           botstats = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].bots} ${message.guild.members.cache.filter(m => m.user.bot).size}`)
        }
      } else {
        return;
      }

if(memberyay) {
               message.guild.channels.cache.get(memberstats.id).setName(`${serverstats[message.guild.id].member} ${message.guild.members.cache.filter(m => !m.user.bot).size}`);
             }
if(totalyay) {
              message.guild.channels.cache.get(totalstats.id).setName(`${serverstats[message.guild.id].total} ${message.guild.memberCount}`);
            }
if(botyay) {
              message.guild.channels.cache.get(botstats.id).setName(`${serverstats[message.guild.id].bots} ${message.guild.members.cache.filter(m => m.user.bot).size}`);
            }

                message.channel.send("All Server Stats Channels Have Been Reloaded!")
}

if(args[0].toLowerCase() === "reset") {
  serverstats[message.guild.id].member = "Members: "
  serverstats[message.guild.id].total = "Total Users: "
  serverstats[message.guild.id].bots = "Bots: "

  serverstats[message.guild.id].oldmember = "Members: "
  serverstats[message.guild.id].oldtotal = "Total Users: "
  serverstats[message.guild.id].oldbots = "Bots: "

  fs.writeFileSync(`./serverstats/${message.guild.id}.json`, JSON.stringify(serverstats, null, 4), (err) => {
  if(err) console.log(err)
  });

  const category = message.guild.channels.cache.find(c => c.name == `${message.guild.name} Server Stats`)

  const memberyay = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldmember} ${message.guild.members.cache.filter(m => !m.user.bot).size}`)
    const totalyay = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldtotal} ${message.guild.memberCount}`)
      const botyay = message.guild.channels.cache.find(c => c.name == `${serverstats[message.guild.id].oldbots} ${message.guild.members.cache.filter(m => m.user.bot).size}`)

if(!memberyay) {
  message.guild.channels.create(`${serverstats[message.guild.id].member} ${message.guild.members.cache.filter(m => !m.user.bot).size}`, {
    type: 'voice',
    parent: category.id,
    permissionOverwrites: [
       {
         id: message.guild.roles.everyone,
         deny: ['CONNECT'],
      },
    ],
  })
}
if(!totalyay) {
  message.guild.channels.create(`${serverstats[message.guild.id].total} ${message.guild.memberCount}`, {
  type: 'voice',
      parent: category.id,
  permissionOverwrites: [
     {
       id: message.guild.roles.everyone,
       deny: ['CONNECT'],
    },
  ],
  })
}
if(!botyay) {
  message.guild.channels.create(`${serverstats[message.guild.id].bots} ${message.guild.members.cache.filter(m => m.user.bot).size}`, {
  type: 'voice',
      parent: category.id,
  permissionOverwrites: [
     {
       id: message.guild.roles.everyone,
       deny: ['CONNECT'],
    },
  ],
  })
}

  message.channel.send("All Channels Have Been Reset")
}


if(args[0].toLowerCase() === "setmember") {
  serverstats[message.guild.id].oldmember = serverstats[message.guild.id].member;
  serverstats[message.guild.id].member = args.join(' ').replace("setmember ", "").toString();
      message.channel.send(`Member Name Will Be Displayed As: ${args.join(' ').replace("setmember ", "").toString()} ${message.guild.members.cache.filter(m => !m.user.bot).size}`)
  fs.writeFileSync(`./serverstats/${message.guild.id}.json`, JSON.stringify(serverstats, null, 4), (err) => {
  if(err) console.log(err)
  });
}
if(args[0].toLowerCase() === "setbots") {

  serverstats[message.guild.id].oldbots = serverstats[message.guild.id].bots;
  serverstats[message.guild.id].bots = args.join(' ').replace("setbots ", "").toString();
    message.channel.send(`Bots Name Will Be Displayed As: ${args.join(' ').replace("setbots ", "").toString()} ${message.guild.members.cache.filter(m => m.user.bot).size}`)
  fs.writeFileSync(`./serverstats/${message.guild.id}.json`, JSON.stringify(serverstats, null, 4), (err) => {
  if(err) console.log(err)
  });
}
if(args[0].toLowerCase() === "settotal") {
  serverstats[message.guild.id].oldtotal = serverstats[message.guild.id].total;
  serverstats[message.guild.id].total = args.join(' ').replace("settotal ", "").toString();
  message.channel.send(`Total Users Name Will Be Displayed As: ${args.join(' ').replace("settotal ", "").toString()} ${message.guild.memberCount}`)
  fs.writeFileSync(`./serverstats/${message.guild.id}.json`, JSON.stringify(serverstats, null, 4), (err) => {
  if(err) console.log(err)
  });
}

}

if(command === "support") {
  const embed = new Discord.MessageEmbed()
  .setTitle("Support")
  .setColor("ORANGE")
  .setDescription("http://pizzaclient.ddns.net/pizzabot/support.html")
  .setFooter("Get PizzaBot At http://pizzaclient.ddns.net/pizzabot/get.html");

  message.channel.send(embed)
}

        if(command === "bonk") {
  if(!mention) return message.channel.send("You Cannot Bonk Yourself...")
  client.commands.get("BONK").execute(message, args, mention)
}

        if (command === "rateme") {
        let rating = Math.floor(Math.random() * 101)

          if (!args[0]) {
              message.channel.send('I would rate you a ' + rating + '/100')
          } else {
              let rateuser = message.mentions.users.first()
              if (!rateuser) {
                  return message.channel.send('Please mention who you want me to rate!')
              } else {
              return message.channel.send('I would rate ' + rateuser.username + ' a ' + rating + '/100')
              }
          }


            }

        if(command === "hug") {
              if(!mention) {
                    message.channel.send(huged);
              }
              else if(mention.id == message.author.id) {
                message.channel.send(huged);
              } else if(!args[0]) {
                message.channel.send(huged);
              }
              else if(args[0]) {
                client.commands.get("hug").execute(message, args);
            }
        }

        if(command === "highfive") {
                      if(!mention) {
                            message.channel.send(highFive);
                      }
                      else if(mention.id == message.author.id) {
                        message.channel.send(highFive);
                      } else if(!args[0]) {
                        message.channel.send(highFive);
                      }
                      else if(args[0]) {
                        client.commands.get("highfive").execute(message, args);
                    }
                }

        if(command === "spam") {
                if(!mention) return message.channel.send("Please Mention Someone");
            if(spamnerd.has(message.author.id)) {
                message.channel.send(`You Can\'t Do This For Another 20 minutes`);
              } else {
                message.channel.send(`${mention}, you have been spammed.`)
                message.channel.send(`${mention}, you have been spammed.`)
              message.channel.send(`${mention}, you have been spammed.`).then((msgf) => {
                spamnerd.add(message.author.id);
                setTimeout(function(){
                    spamnerd.delete(message.author.id);
                }, 1200000);
              });
            }
          }



})


// ╔═╗╔═╗╔═══╗     ╔═══╗╔╗─╔╗╔═╗─╔╗╔═══╗╔════╗╔══╗╔═══╗╔═╗─╔╗╔═══╗
// ╚╗╚╝╔╝║╔═╗║     ║╔══╝║║─║║║║╚╗║║║╔═╗║║╔╗╔╗║╚╣─╝║╔═╗║║║╚╗║║║╔═╗║
// ─╚╗╔╝─║╚═╝║     ║╚══╗║║─║║║╔╗╚╝║║║─╚╝╚╝║║╚╝─║║─║║─║║║╔╗╚╝║║╚══╗
// ─╔╝╚╗─║╔══╝     ║╔══╝║║─║║║║╚╗║║║║─╔╗──║║───║║─║║─║║║║╚╗║║╚══╗║
// ╔╝╔╗╚╗║║───     ║║───║╚═╝║║║─║║║║╚═╝║──║║──╔╣─╗║╚═╝║║║─║║║║╚═╝║
// ╚═╝╚═╝╚╝───     ╚╝───╚═══╝╚╝─╚═╝╚═══╝──╚╝──╚══╝╚═══╝╚╝─╚═╝╚═══╝

client.on("message", message => {
const rankcardo = require(`./RankCards/${message.guild.id}.json`);
const xp = require(`./xp/${message.guild.id}.json`);
const xpneeded = require(`./needxp/${message.guild.id}.json`);


   if (message.author.bot) return;

   const args = message.content.slice(prefix.length).trim().split(/ +/g);
   const command = args.shift().toLowerCase();

  let xpAdd = Math.floor(Math.random() * 7) + 8; // does math to find how much xp to give
   console.log(xpAdd, message.author.username); //Amount of xp added

    if(!xp[message.author.id]) {
      xp[message.author.id] = {
        xp: 0,
        level: 1,
        ping: message.author.toString(),
      };
    }

    if(!xpneeded[message.guild.id]) {
      xpneeded[message.guild.id] = {
        xp: 750,
      };
    }


    if(!rankcardo[message.author.id]) {
      rankcardo[message.author.id] = {
        card: "https://media.discordapp.net/attachments/748374489527615500/784956728759812126/RankCard.png?width=841&height=254",
        avatar: message.author.displayAvatarURL({ format: 'png' }),
      };
    }


    let curxp = xp[message.author.id].xp; //user's current xp
    let curlvl = xp[message.author.id].level; // user's current lvl
    let nxtlvl = xp[message.author.id].level * xpneeded[message.guild.id].xp; //how much next level will be
        let difference = nxtlvl - curxp;
      xp[message.author.id].xp = curxp + xpAdd; //adds the xp to the user's account
    if(nxtlvl <= xp[message.author.id].xp) { // what happends if they have enough for a new level
      xp[message.author.id].level = curlvl + 1;//adds 1 to the current level
      let lvlup = new Discord.MessageEmbed()
      .setTitle("Level Up!")
      .setColor("GOLD")
      .setTimestamp()
      .addField("New Level", curlvl + 1); // level up embed

      message.channel.send(lvlup); //sends the embed
      xp[message.author.id].xp = 0;
    }

    fs.writeFileSync(`./needxp/${message.guild.id}.json`, JSON.stringify(xpneeded, null, 4), (err) => {
      if(err) console.log(err)
    });

    fs.writeFileSync(`./xp/${message.guild.id}.json`, JSON.stringify(xp, null, 4), (err) => {
      if(err) console.log(err)
    });

    fs.writeFileSync(`./RankCards/${message.guild.id}.json`, JSON.stringify(rankcardo, null, 4), (err) => {
  if(err) console.log(err)
});

});


client.on("message", message => {

  if(!fs.existsSync(`./needxp/${message.guild.id}.json`)) {
    fs.writeFileSync(`./needxp/${message.guild.id}.json`, JSON.stringify({}, null, 4));
  }

  const rankcardo = require(`./RankCards/${message.guild.id}.json`);
  const xp = require(`./xp/${message.guild.id}.json`);
  const xpneeded = require(`./needxp/${message.guild.id}.json`);
  const mention = message.mentions.users.first();

  if(!xpneeded[message.guild.id]) {
    xpneeded[message.guild.id] = {
      xp: 750,
    };
  }

     if (message.author.bot) return;

     const args = message.content.slice(prefix.length).trim().split(/ +/g);
     const command = args.shift().toLowerCase();
     let lvl10 = 10;
     let gradient = ["#F14E4E", "#DE0808"];

     let curxp = xp[message.author.id].xp; //user's current xp
     let curlvl = xp[message.author.id].level; // user's current lvl
     let nxtlvl = xp[message.author.id].level * xpneeded[message.guild.id].xp; //how much next level will be
     let difference = nxtlvl - curxp;

})

client.on("message", message => {
  const rankcardo = require(`./RankCards/${message.guild.id}.json`);
  const xp = require(`./xp/${message.guild.id}.json`);
  const xpneeded = require(`./needxp/${message.guild.id}.json`);
  const mention = message.mentions.users.first();


  if(!xp[message.author.id]) {
    xp[message.author.id] = {
      xp: 0,
      level: 1,
      ping: message.author.toString(),
    };
  }


    let curxp = xp[message.author.id].xp; //user's current xp
    let curlvl = xp[message.author.id].level; // user's current lvl
    let nxtlvl = xp[message.author.id].level * xpneeded[message.guild.id].xp; //how much next level will be
    let difference = nxtlvl - curxp;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let lvl10 = 10;
    let gradient = ["#F14E4E", "#DE0808"];

         if (message.author.bot) return;
           if (!message.content.startsWith(prefix)) return;

  if(command === "rank") {
            if(!mention) {
              const rank = new canvacord.Rank()
             .setAvatar(rankcardo[message.author.id].avatar)
             .setCurrentXP(curxp)
             .setRequiredXP(nxtlvl)
             .setLevel(curlvl)
             .setBackground("IMAGE", rankcardo[message.author.id].card)
             .setProgressBar(gradient, "GRADIENT", true)
             .setProgressBarTrack("#E86905")
             .setUsername(message.author.username)
             .setDiscriminator(message.author.discriminator, "#493e30")
             .setOverlay("White", 0.0, false);

         rank.build()
             .then(data => {
                 const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                 message.channel.send(attachment);
             });
           } else {
             		if(!xp[mention.id]) return message.channel.send("User Does Not Have An XP Account");
             const rank = new canvacord.Rank()
            .setAvatar(rankcardo[mention.id].avatar)
            .setCurrentXP(xp[mention.id].xp)
            .setRequiredXP(xp[mention.id].level * 750)
            .setLevel(xp[mention.id].level)
            .setBackground("IMAGE", rankcardo[mention.id].card)
            .setProgressBar(gradient, "GRADIENT", true)
            .setProgressBarTrack("#E86905")
            .setUsername(mention.username)
            .setDiscriminator(mention.discriminator, "#493e30")
            .setOverlay("White", 0.0, false);

        rank.build()
            .then(data => {
                const attachment = new Discord.MessageAttachment(data, "RankCard.png");
                message.channel.send(attachment);
            });
           }
        }

  if(command === "betxp") {

          if(isNaN(args[0]) || !parseInt(args[0])) return message.channel.send("You Need To Put An Number");
          if(xp[message.author.id].xp < parseInt(args[0])) return message.channel.send("You Do Not Have Enough Xp");
          if(isNaN(args[0] || !parseInt(args[0])) != Math.floor(isNaN(args[0]))) return message.channel.send("Please Enter Whole Numbers");
          if(args[0].startsWith("-")) return message.channel.send("You Need To Enter An Positive Number");

          if(gamble.has(message.author.id)) {
              message.channel.send(`You Can\'t Do This For Another 2 minutes`);
            } else {

              let chances = ["win", "lose"];
              var pick = chances[Math.floor(Math.random() * chances.length)];

              if(pick == "lose") {
                xp[message.author.id].xp -= parseInt(args[0]);

                fs.writeFileSync(`./xp/${message.guild.id}.json`, JSON.stringify(xp, null, 4), (err) => {
                  if(err) console.log(err)
                });
                message.channel.send(`You Lost ${parseInt(args[0])} xp`).then((msgf) => {
                  gamble.add(message.author.id);
                  setTimeout(function(){
                      gamble.delete(message.author.id);
                  }, 120000);
                });
              } else {
                xp[message.author.id].xp += parseInt(args[0]);

                fs.writeFileSync(`./xp/${message.guild.id}.json`, JSON.stringify(xp, null, 4), (err) => {
                  if(err) console.log(err)
                });
                message.channel.send(`You Won ${parseInt(args[0])} xp!`).then((msgf) => {
                  gamble.add(message.author.id);
                  setTimeout(function(){
                      gamble.delete(message.author.id);
                  }, 120000);
                });
              }
          }

        }

  if(command === "lb" || command === "leaderboard") {
              client.commands.get("leader").execute(message, args, client)
        }

  if(command === "addcard") {
          if(!args[0]) return message.channel.send("Please Put An URL, Imgur Is Perfered");
          if(args.toString() == "reset") {
            rankcardo[message.author.id].card = "https://media.discordapp.net/attachments/748374489527615500/784956728759812126/RankCard.png?width=841&height=254";
            message.channel.send("Rank Card Has Been Reset!")
          }else if(!curlvl >= lvl10) {
            message.channel.send("You Need To Be Level 10 To Use This.")
          } else {
        if(args[0]) {
            rankcardo[message.author.id].card = args.toString();
            message.channel.send("Rank Card Has Been Changed!")
            fs.writeFileSync(`./RankCards/${message.guild.id}.json`, JSON.stringify(rankcardo, null, 4), (err) => {
          if(err) console.log(err)
        });
        }
      }
    }

  if(command === "showavatar") {
        rankcardo[message.author.id].avatar = message.author.displayAvatarURL({ format: 'png' });
        message.channel.send("Avatar Is Now Showing")
        fs.writeFileSync(`./RankCards/${message.guild.id}.json`, JSON.stringify(rankcardo, null, 4), (err) => {
      if(err) console.log(err)
    });
    }
  if(command === "hideavatar") {
      rankcardo[message.author.id].avatar = "https://cdn.discordapp.com/avatars/712572846773370931/d1fb0a94bd9e507307179e8835231ae8.png?size=128";
      message.channel.send("Avatar Is Now Hidden")
      fs.writeFileSync(`./RankCards/${message.guild.id}.json`, JSON.stringify(rankcardo, null, 4), (err) => {
    if(err) console.log(err)
  });
    }

  if(command === "setxp") {
    if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("You Do Not Have Perms!");
    if(isNaN(args[0])) return message.channel.send("It Needs To Be A Number");
    if(args[0].startsWith("-")) return message.channel.send("It Needs To Be A Positive Number");
    if(100 >= args[0]) return message.channel.send("Needs To Be More Than 100");

    xpneeded[message.guild.id].xp = args[0];
    message.channel.send(`The Xp Needed Will Now Be ${args[0]} * players level.`)
    fs.writeFileSync(`./needxp/${message.guild.id}.json`, JSON.stringify(xpneeded, null, 4), (err) => {
      if(err) console.log(err)
    });
  }
  if(command === "changeinfo") {
      if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("You Do Not Have Perms!");
    if(!mention) return message.channel.send("Please Mention Someone!")
    if(isNaN(args[1])) return message.channel.send("Xp Needs To Be A Number");
    if(isNaN(args[2])) return message.channel.send("Level Needs To Be A Number");

    xp[mention.id].xp = parseInt(args[1]);
    xp[mention.id].level = parseInt(args[2]);

    fs.writeFileSync(`./xp/${message.guild.id}.json`, JSON.stringify(xp, null, 4), (err) => {
      if(err) console.log(err)
    });
  }

})

// ╔═╗╔═╗╔╗─╔╗╔═══╗╔══╗╔═══╗     ╔═══╗╔═══╗╔═╗╔═╗╔═╗╔═╗╔═══╗╔═╗─╔╗╔═══╗╔═══╗
// ║║╚╝║║║║─║║║╔═╗║╚╣─╝║╔═╗║     ║╔═╗║║╔═╗║║║╚╝║║║║╚╝║║║╔═╗║║║╚╗║║╚╗╔╗║║╔═╗║
// ║╔╗╔╗║║║─║║║╚══╗─║║─║║─╚╝     ║║─╚╝║║─║║║╔╗╔╗║║╔╗╔╗║║║─║║║╔╗╚╝║─║║║║║╚══╗
// ║║║║║║║║─║║╚══╗║─║║─║║─╔╗     ║║─╔╗║║─║║║║║║║║║║║║║║║╚═╝║║║╚╗║║─║║║║╚══╗║
// ║║║║║║║╚═╝║║╚═╝║╔╣─╗║╚═╝║     ║╚═╝║║╚═╝║║║║║║║║║║║║║║╔═╗║║║─║║║╔╝╚╝║║╚═╝║
// ╚╝╚╝╚╝╚═══╝╚═══╝╚══╝╚═══╝     ╚═══╝╚═══╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝─╚╝╚╝─╚═╝╚═══╝╚═══╝

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.substring(prefix.length).split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a voice channel to play music"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send(
        "I don't have permissions to connect to the voice channel"
      );
    if (!permissions.has("SPEAK"))
      return message.channel.send(
        "I don't have permissions to speak in the channel"
      );

    if (url.match(/https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playList = await youtube.getPlaylist(url)
      const videos = await playList.getVideos()
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id)
        await handleVideo(video2, message, voiceChannel, true)
      }
      message.channel.send(`Playlist **${playList.title}** has been added to the queue`)
      return undefined
    } else {
      try {
        var video = await youtube.getVideoByID(url);
      } catch {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          var index = 0
          message.channel.send(`
__**Song Selection**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please select one of the songs ranging from 1-10
            `)
            try {
              var responce = await message.channel.awaitMessages(msg => msg.content > 0 && msg.content < 11, {
                max: 1,
                time: 30000,
                errors: ['time']
              })
            } catch {
              message.channel.send(`No or invaild spmg selection was provided`)
            }
            const videoIndex = parseInt(responce.first().content)
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch {
          return message.channel.send("I couldn't find search results");
        }
      }
      return handleVideo(video, message, voiceChannel)
    }

  } else if (message.content.startsWith(`${prefix}stop`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to stop the music"
      );
    if (!serverQueue) return message.channel.send("There is nothing playing");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    message.channel.send("I have stoped the music for you");
    return undefined;


  } else if (message.content.startsWith(`${prefix}skip`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to skip the music"
      );
    if (!serverQueue) return message.channel.send("There is nothing playing");
    serverQueue.connection.dispatcher.end();
    message.channel.send("I have skipped the music for you");
    return undefined;


  } else if (message.content.startsWith(`${prefix}volume`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to use music commands"
      );
    if (!serverQueue) return message.channel.send("There is nothing playing");
    if (!args[1])
      return message.channel.send(`That volume is: **${serverQueue.volume}**`);
    if (!isNaN(args[1]))
      return message.channel.send(
        "This is not a vaild amount to change the volume to"
      );
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    message.channel.send(`I have changed the volume to: **${args[1]}**`);
    return undefined;


  } else if (message.content.startsWith(`${prefix}np`)) {
    if (!serverQueue) return message.channel.send("There is nothing playing");
    message.channel.send(`Now Playing: **${serverQueue.songs[0].title}**`);
    return undefined;


  } else if (message.content.startsWith(`${prefix}queue`)) {
    if (!serverQueue) return message.channel.send("There is nothing playing");
    message.channel.send(
      `
__**Song Queue**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}
**Now Playing:** ${serverQueue.songs[0].title}
`,
      { split: true }
    );
    return undefined;


  } else if (message.content.startsWith(`${prefix}pause`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to pause the music"
      );
    if (!serverQueue) return message.channel.send("There is nothing playing");
    if (!serverQueue.playing)
      return message.channel.send("The music is already paused");
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    message.channel.send("I have paused the music for you");
    return undefined;


  } else if (message.content.startsWith(`${prefix}resume`)) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You need to be in a voice channel to resume the music"
      );
    if (!serverQueue) return message.channel.send("There is nothing playing");
    if (serverQueue.playing)
      return message.channel.send("The music is already playing");
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    message.channel.send("I have resumed the music for you");
    return undefined;


  } else if (message.content.startsWith(`${prefix}loop`)) {
    if (!message.member.voice.channel) return message.channel.send(`You need to be in a voice channel to use this command!`)
    if (!serverQueue) return message.channel.send(`there is nothing playing.`)

    serverQueue.loop = !serverQueue.loop

    return message.channel.send(`I have now ${serverQueue.loop ? `**Enabled**` : `**Disabled**`} loop.`)
  return undefined
}
});

async function handleVideo(video, message, voiceChannel, playList = false) {
  const serverQueue = queue.get(message.guild.id)

      const song = {
      id: video.id,
      title: Util.escapeMarkdown(video.title),
      url: `https://www.youtube.com/watch?v=${video.id}`
    };

    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
        loop: false
      };
      queue.set(message.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.log(
          `there was an error connecting to the voice channel: ${error}`
        );
        queue.delete(message.guild.id);
        message.channel.send(
          `There was an error connecting to the voice channel: ${error}`
        );
		return undefined
      }
    } else {
      serverQueue.songs.push(song);
      if(playList) return undefined
      return message.channel.send(
        `**${song.title}** has been added to the queue`
      );
    }
  return undefined
}

function play(guild, song, options) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      if(!serverQueue.loop) serverQueue.songs.shift()
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => {
      console.log(error);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.send(`Start Playing: **${song.title}**`);
}


client.login(token); // this is to login the bot
