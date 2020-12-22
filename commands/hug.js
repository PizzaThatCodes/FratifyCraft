const Discord = require("discord.js");
const cheerio = require("cheerio");
const request = require("request");

const { prefix } = require('../config.json');

module.exports = {
  name: "hug",
  description: "animals",
  execute(message, args) {

  const mention = message.mentions.users.first();

    image(message);

function image(message) {
var options = {
  url: "http://results.dogpile.com/serp?qc=images&q=" + "Anime Hug gifs",
  method: "GET",
  headers: {
    Accept: "text/html",
    "User-Agent": "Chrome"
  }
};

request(options, function(error, response, responseBody) {
  if (error) {
    return;
  }

  $ = cheerio.load(responseBody);

  var links = $(".image a.link");

  var urls = new Array(links.length)
    .fill(0)
    .map((v, i) => links.eq(i).attr("href"));

  // console.log(urls);

  if (!urls.length) {
    return;
  }

  // Send result

  const hugembed17 = new Discord.MessageEmbed()
  .setTitle(message.author.username + " Huged Someone")
  .setImage(urls[Math.floor(Math.random() * urls.length)])
  .setFooter(message.author.username + " has huged " + mention.username)
  .setTimestamp();

  message.channel.send(hugembed17);
});
}

  }
};
