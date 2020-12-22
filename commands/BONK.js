const Discord = require("discord.js");
const cheerio = require("cheerio");
const request = require("request");
const Canvas = require("canvas");

const prefix = ">";
const prefix2 = ">";

module.exports = {
  name: "BONK",
  description: "BONK",
  async execute(message, args, mention) {
    const canvas = Canvas.createCanvas(700, 376);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(
      "https://cdn.discordapp.com/attachments/693291324954247232/743259009603338260/9749_bonk.png"
    );
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    // ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "white";
    // ctx.strokeStyle = "Magenta";

    const avatar = await Canvas.loadImage(
      message.author.displayAvatarURL({ format: "jpg" })
    ).catch(err => console.log(err));

    const avatar1 = await Canvas.loadImage(
      mention.displayAvatarURL({ format: "jpg" })
    ).catch(err => console.log(err));

    ctx.beginPath();
//    ctx.arc(235, 135, 75, 0, Math.PI * 2, true); //both: subtract 75
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#fffffff";
    ctx.stroke();
    ctx.closePath();
    ctx.drawImage(avatar, 160, 60, 150, 150);
    ctx.save();


  ctx.save();
  ctx.restore();
  ctx.beginPath();
//  ctx.arc(525, 300, 75, 0, Math.PI * 2, true); //both: subtract 75
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#fffffff";
  ctx.stroke();
  ctx.closePath();
  ctx.drawImage(avatar1, 475, 235, 120, 120);
  ctx.save();




    const final = new Discord.MessageAttachment(canvas.toBuffer(), "BONK.gif");

    return message.channel.send(final).then(() => {
        message.channel.send(`HEY ${mention}, ${message.author} has BONKED You!`);
    });
  }
}
