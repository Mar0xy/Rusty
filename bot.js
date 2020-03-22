const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core-discord');
const axios = require('axios');

const activities_list = [
    "the scripts", 
    "Heartbeats",
    "ROBLOX", 
    "Music"
];
const activity_type = [
	"WATCHING",
	"LISTENING",
	"PLAYING"
];

async function GETHOT(name) {
	const res = await axios.get(`https://www.reddit.com/r/${name}/hot.json?limit=3`);
	if (res.length == 0) {
		return false;
	} else {
		return res.data.data;
	}
}
async function GETRU(name) {
	const res = await axios.get(`https://www.reddit.com/user/${name}/about.json`);
	if (res.length == 0) {
		return false;
	} else {
		return res.data.data;
	}
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus("dnd");
  client.channels.cache.get('supportchannelid').messages.fetch().then(messages => messages.array().forEach(message => message.author.equals(client.user) && message.delete()));
  	const embed = {
		"title": "Create Ticket",
		"description": "Please react with the 🎟️ emoji below to open a ticket",
		"color": 5657474
	};
  client.channels.cache.get('supportchannelid').send({ embed }).then(function (message) {message.react("🎟️")});
  var ista = 0;
  client.setInterval(()=>{
	if(ista == 0){
		client.user.setActivity(activities_list[0], { type: activity_type[0] });
		ista++;
	}else if(ista == 1){
		client.user.setActivity(activities_list[1], { type: activity_type[1] });
		ista++;
	}else if(ista == 2){
		client.user.setActivity(activities_list[2], { type: activity_type[2] });
		ista++;
	}else if(ista == 3){
		client.user.setActivity(activities_list[3], { type: "STREAMING", url: "https://www.twitch.tv/monstercat" });
		ista = 0;
	}
  },60000)
});

client.on("message", message => {
  if (message.channel.type === "dm") return;
  if(message.channel.parent.name == "TicketsCategoryName" && message.content == "!close"){
	  const embed = {
				"title": "Close Ticket",
				"description": "Please react with the ✅ emoji below to close the ticket",
				"color": 5657474
		};
		message.channel.send({ embed }).then(function (message) {message.react("✅")});
  }
  if(message.content == "!getping"){
	  message.delete();
	  message.channel.send("Ping!").then(m => {
		  m.edit(`🏓\nLatency is **${m.createdTimestamp - message.createdTimestamp}ms**\nAPI Latency is **${Math.round(client.ws.ping)}ms**`);
		  setTimeout(function(){m.delete();}, 10000);
	  })
  }
  if(message.channel.id == botchannelid && message.content == "!emergency"){
	  if(!message.member.roles.cache.find(r => r.name === "adminrolename")) return;
	  if(!message.member.voice.channel){
		  const embed = {
			  "title": "Error!",
			  "description": "**Sorry! I sadly couldn't find you in a Voice Channel 🙁**",
			  "color": 16732031
			};
		  message.channel.send({ embed });
		  return;
	  }
	  const vc = message.member.voice.channel;
	  vc.join().then(connection => {
		  const dispatcher = connection.play('./iNSaNiTY.mp3');
		  dispatcher.setVolumeLogarithmic(0.3);
		  const embed = {
			  "title": "Insanity has **begun**",
			  "description": '**"I am always internally screaming"** - *LordDamionDevil*',
			  "color": 16732031
			};
		  message.channel.send({ embed });
		  dispatcher.on("finish", end => {
			  vc.leave();
			  const embed = {
			  "title": "Insanity has **ended**",
			  "description": "**Well it's already over 🙁**",
			  "color": 16732031
			  };
		      message.channel.send({ embed });
		    });
	  }).catch(err => message.channel.send("Death is upon us"));
  }
  if(message.channel.id == botchannelid && message.content.substring(0,6) == "!play "){
	  var url = message.content.replace("!play ", "");
	  if(!url.includes("https://www.youtube.com")) return;
	  if(!message.member.voice.channel){
		  const embed = {
			  "title": "Error!",
			  "description": "**Sorry! I sadly couldn't find you in a Voice Channel 🙁**",
			  "color": 16732031
			};
		  message.channel.send({ embed });
		  return;
	  }
	  const vc = message.member.voice.channel;
	  vc.join().then(async connection => {
		  const input = await ytdl(url, { filter: "audioonly", highWaterMark: 1<<25 });
		  const dispatcher = connection.play(input, {type: 'opus'});
		  dispatcher.setVolumeLogarithmic(0.3);
		  await ytdl.getInfo(url, function(err, info) {
			function secondsToMinutes(time){ return Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2) };
			var verified = "";
			if(info.author.verified == true) { verified = "verifiedemoji" }else{ verified = "❌" };
			const embed = {
				"title": "Now Playing: " + info.title,
				"description": "**Requested by " + message.author.username + "\nSong Length: " + secondsToMinutes(info.length_seconds) + "\nCreators Verification Status: " + verified + "**",
				"color": 16732031,
				"author": {
					"name": info.author.name,
					"url": info.author.channel_url,
					"icon_url": info.author.avatar
				},
				"thumbnail": { "url": "https://img.youtube.com/vi/" + info.video_id + "/maxresdefault.jpg" }
			};
			message.channel.send({ embed });
			global.mvinf = [
				info.title,
				info.video_id,
				info.author.name,
				info.author.avatar,
				info.author.channel_url,
				verified
			];
		  });
		  dispatcher.on("finish", () => {
			  vc.leave();
			  const embed = {
				"title": "Playback of: " + mvinf[0] + " has ended",
				"description": "**Requested by " + message.author.username + "\nCreators Verification Status: " + mvinf[5] + "**",
				"color": 16732031,
				"author": {
					"name": mvinf[2],
					"url": mvinf[4],
					"icon_url": mvinf[3]
				},
				"thumbnail": { "url": "https://img.youtube.com/vi/" + mvinf[1] + "/maxresdefault.jpg" }
			  };
			  message.channel.send({ embed });
		  });
	  }).catch(err => console.log(err));
  }
  if(message.content == "!reboot") {
	  if(!message.member.roles.cache.find(r => r.name === "adminrolename")) return;
	  message.delete();
	  message.channel.send("Rebooting.").then(message => {
		  client.destroy()
		  client.login('NjgyNzE0MzIwODQ0NzUxMDUx.XlhBaQ.L4lk6dBx5JRjt-iiss3Ls7HsJBA').then(() => {
				message.delete();
		   });
	  });
  }
  if(message.content == "!animeme") {
	  GETHOT('animemes').then(gr => {
		 global.gr = gr;
		 const embed = {
			"title": "Please select a post to show.",
			"description": "1. [" + gr.children[1].data.title + "](https://www.reddit.com" + gr.children[1].data.permalink + ") Posted by: " + gr.children[1].data.author + "\n2. [" + gr.children[2].data.title + "](https://www.reddit.com" + gr.children[2].data.permalink + ") Posted by: " + gr.children[2].data.author + "\n3. [" + gr.children[3].data.title + "](https://www.reddit.com" + gr.children[3].data.permalink + ") Posted by: " + gr.children[3].data.author,
			"color": 16729344,
			"footer": {
				"icon_url": "https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-120x120.png",
				"text": "Fetched from Reddit"
			}
		 };
		 message.channel.send({ embed }).then(function (message) {message.react("1️⃣").then(() => {message.react("2️⃣").then(() => {message.react("3️⃣")})})});
	  });
  }
  if(message.content.startsWith("!clear ")){
	  if(!message.member.roles.cache.find(r => r.name === "adminrolename")) return;
	  const loganmad = message.content.replace("!clear ","").match(".*[a-z].*");
	  if(loganmad){
		  const embed = {
			"title": "Error!",
			"description": "Seems like you included a letter in your number.",
			"color": 16732031
		  };
		  message.channel.send({ embed });
		  return;
	  }
	  var amount = message.content.split(' ');
	  var amount = amount[1];
	  if(!amount) return;
	  const date = new Date();
	  if(amount > 100 || amount <= 0){
		  const embed = {
			"title": "Error!",
			"description": "Seems like I couldn't delete the message(s) in this channel.\nThis happens if you give me a value higher than 100 or lower than 1.",
			"color": 16732031
		  };
		  message.channel.send({ embed });
		  return;
	  };
	  message.delete().then(() =>{
		message.channel.messages.fetch({ limit: amount }).then(messages =>{
			message.channel.bulkDelete(messages);
		});
		const embed = {
			"title": "Cleared " + amount + " Message(s) in #" + message.channel.name,
			"color": 3648955,
			"author": {
				"name": message.author.username,
				"icon_url": message.author.displayAvatarURL()
			},
			"footer": {
				"text": "This action was done on " + date.toDateString()
			}
		};
		client.channels.cache.get(`modlogchannelid`).send({ embed })
	  })
  }
})

client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.emoji.name === "🎟️" && reaction.message.channel.id == supportchannelid) {
		if(user.id == client.user.id) return;
        reaction.users.remove(user.id);
		const userticket = user.tag.replace(/#/g, "-");
		const ticket = reaction.message.guild.channels.cache.find(c => c.name === userticket.toLowerCase());
		if (ticket) return;
		reaction.message.guild.channels.create(userticket, {
			type: 'text'
		}).then(channel => {
			let category = reaction.message.guild.channels.cache.find(c => c.name == "TicketsCategoryName" && c.type == "category");
			if (!category) throw new Error("Category channel does not exist");
			channel.setParent(category.id).then(channel => {
				channel.lockPermissions().then(channel => {
					channel.updateOverwrite(user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true });
					const embed = {
						"title": "Ticket Created!",
						"description": "Please wait until one of our staff members responds!\n**This can take up to 24 hours**",
						"color": 5657474
					};
					channel.send({ embed });
				});
			});
		});
	};
	if(reaction.emoji.name === "✅" && reaction.message.channel.parent.name == "TicketsCategoryName" && user.id != client.user.id){
		const embed = {
			"title": "Deleting Ticket",
			"description": "**Ticket will be deleted in 5 seconds**",
			"color": 5657474
		};
		reaction.remove(user.id).then(reaction => {
			reaction.message.channel.send({ embed });
			setTimeout(function(){reaction.message.channel.delete();}, 5000);
		});
	};
	if(reaction.emoji.name === "1️⃣" && reaction.message.embeds[0].title.includes("Please select a post to show.") && reaction.message.author.id == client.user.id && user.id != client.user.id || reaction.emoji.name === "2️⃣" && reaction.message.embeds[0].title.includes("Please select a post to show.") && reaction.message.author.id == client.user.id && user.id != client.user.id || reaction.emoji.name === "3️⃣" && reaction.message.embeds[0].title.includes("Please select a post to show.") && reaction.message.author.id == client.user.id && user.id != client.user.id){
		reaction.message.reactions.removeAll().then(() => {
			var num = 0;
			if(reaction.emoji.name === "1️⃣"){num = 1}else if(reaction.emoji.name === "2️⃣"){num = 2}else{num = 3};
			GETRU(gr.children[num].data.author).then(info => {
				const embed = {
					"title": gr.children[num].data.title,
					"description": "[Open Post](https://www.reddit.com" + gr.children[num].data.permalink + ")",
					"color": 16729344,
					"image": {
						"url": gr.children[num].data.url
					},
					"author": {
						"name": gr.children[num].data.author,
						"url": "https://www.reddit.com/user/" + gr.children[num].data.author,
						"icon_url": info.icon_img.replace(/^(.+?\.(png|jpe?g)).*$/i, '$1')
					},
					"footer": {
						"icon_url": "https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-120x120.png",
						"text": "Fetched from Reddit"
					}
				};
				reaction.message.delete();
				reaction.message.channel.send({ embed });
			});
		});
	};
})

client.on("guildMemberAdd", (member) => {
	const embed = {
		"title": "User Joined",
		"color": 3648955,
		"author": {
			"name": member.user.username + "#" + member.user.discriminator,
			"icon_url": member.user.displayAvatarURL()
		},
		"footer": {
			"text": "This user has joined the server on " + member.joinedAt.toDateString()
		}
	};
	client.channels.cache.get(`modlogchannelid`).send({ embed })
})

client.on("guildMemberRemove", (member) => {
	const date = new Date();
	const embed = {
		"title": "User Left",
		"color": 3648955,
		"author": {
			"name": member.user.username + "#" + member.user.discriminator,
			"icon_url": member.user.displayAvatarURL()
		},
		"footer": {
			"text": "This user has left the server on " + date.toDateString()
		}
	};
	client.channels.cache.get(`modlogchannelid`).send({ embed })
})

client.login('bottoken');