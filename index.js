const Discord = require('discord.js');
const { prefix, token } = require('./config.json')
const client = new Discord.Client();
const { MessageEmbed } = require('discord.js');
const { MessageAttachment } = require("discord.js");

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async message => {
    // if cabot is pinged:
    if (message.mentions.users.first() && message.mentions.users.first().id === "742440632236113961") {
        message.channel.send("Hello! I'm the official bot of the Underdogs Cup server. My prefix is `!` and you can type !help to see my list of commands.");
    }

    // this will check if a message starts with the bot prefix or if the message sender is a Discord bot themselves
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // will take messages from Discord and check if they match the commands below
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'cabpun') {
        const puns = [
            "What does he do when he’s disappointed?\nCaboozled sighs",
            "What's Cab's favorite mathematical symbol?\nCaboozled_pi.",
            "What's gonna happen when Cab misdrops?\nHe'll Caboozled_die.",
            "What do his followers/underlings call him?\nCaboozled sen-pie.",
            "What do Cab's fans say when he brutally murders them (in Tetris)?\nCaboozled, why?!",
            "What does Cab do when he's sleepy?\nCaboozled lies (in bed).",
            "What does Cab do when he gets tagged?\nCaboozled replies.",
            "What does Cab do when he loses his X rank?\nCaboozled cries.",
            "What does Cab do at the store?\nCaboozled buys.",
            "How does Cab feel when he gets disconnected?\nConfuzled_pie.",
            "What does Cab do in zero gravity?\nCaboozled flies.",
            "What kind of bread does Cab eat?\nCaboozled rye.",
            "What does Cab serve at a fast food restaurant?\nCaboozled fries.",
            "How does Cab act when he's embarrassed?\nCaboozled shie.",
            "What's Cab's gender?\nCaboozled guy.",
            "What does Cab do to you no one?\nCaboozled spies.",
            "What happens when Cab goes 6-6 against another player?\nCaboozled ties.",
            "When does Cab do when he's in a tourney?\nCaboozled vies.",
            "What does cab say when hes tired of bad puns?\nCaboozled_bye."
        ]

        const randomPun = Math.floor((Math.random() * puns.length));
        message.channel.send(puns[randomPun]);
    }
    
    else if (command === "avatar" || command === "pfp") {
        let target = message.mentions.users.first() || message.author;

        const Embed = {
            color: 0x92C6DD,
            author: {
                name: `${target.username}'s avatar:`,
            },
            image:{
                url: `${target.displayAvatarURL({ format: "png", dynamic: true, size: 256 })}`,
            },
        };
        message.channel.send( { embed:Embed });
    }
    
    else if (command === "cabdab") {
        const pic = new MessageAttachment("cabdab.png");
		    message.channel.send(pic);
    }

    else if (command === "roles") {
        // if (!message.member.hasPermission("MANAGE_CHANNELS")) {
        //     return message.reply("You do not have permissions to use this command");
        // }

        let embed = new MessageEmbed()
        .setTitle('Server Roles')
        .setDescription('React to this message with the emote corresponding to the role you want!\n\n<:cabwot:739717347618717726> - Quiz Subscriber Role (Grants ability to view tetris exercises)\n<:thonk:733831723187568690> - Lecture Announcements Role (Will receive pings)\n:video_camera: - For people who can record vs replays for others to submit with their coaching requests (see #how-to-find a coach for details)')
        .setColor('00688B')
        let sentEmbed = await message.channel.send(embed);
        sentEmbed.react('739717347618717726')
        sentEmbed.react('733831723187568690')
    }

    else if (command === "help") {
        message.channel.send("**Commands**:\n!help, !ping, !cabpun, !roles, !nickname, !avatar, !togglecoach [coaches only], and !queue [coaches only]");
    }

    else if (command === "ping") {
        message.channel.send("Pong, I'm currently online! My prefix is `!` and you can type !help to see my list of commands.")
    }

    else if (command === "togglecoach") {
      const coachRole = "721831112103428160";
      const activeCoachRole = "769805724930277416";
      const retiredCoachRole = "771925290145677322"

      if (message.member.roles.cache.has(coachRole)){
        if (message.member.roles.cache.has(activeCoachRole)) {
          message.member.roles.remove(activeCoachRole);
          message.reply("Unset as active coach.");
        } else {
          message.member.roles.add(activeCoachRole);
          message.reply("Set as active coach.");
        }
      } else if (message.member.roles.cache.has(retiredCoachRole)){
        message.member.roles.remove(retiredCoachRole);
        message.member.roles.add(activeCoachRole);
        message.member.roles.add(coachRole);
        message.reply("Set as active coach. Welcome back!");
      }

    }

    else if (command === "nickname" || command === "nick") {
      let participantRole = "785609922654109796";
      if (message.member.roles.cache.has(participantRole)) {
        message.reply("Tournament participants cannot change their nickname to make finding your opponent easier on tournament day.")
      } 
      else if (args.join(" ").length > 32) {
        message.reply("The nickname you provided is too long (greater than 32 characters). Please contact a staff member if you need help.")
      }
      else {
        message.member.setNickname(args.join(" "))
        .then(() => message.reply("nickname set"))
        .catch(() => {message.reply("I can't change your nickname, probably because of permissions. Please contact a staff member if you need help.")});
      }
    }
    
    else if (command === "queue") {
      const coachRole = "721831112103428160";
      const serverID = "718603683624910941";
      const channelID = "773575708613935104";
      const staffRole = "718603985874845737";

      if (message.member.roles.cache.has(coachRole) || message.member.roles.cache.has(staffRole)) {
        client.channels.fetch(channelID).then((queueChannel) => {
          var toSend = "**Unanswered Coaching Requests**\n";
          queueChannel.messages.fetch().then((messages) => {
            var arr = [];
            messages.each((msg) => {
              if (msg.reactions.cache.size == 0 && msg.embeds.length > 0) {
                  var nameField = msg.embeds[0].fields.find(e => e.name == "Username");
                  var learnField = msg.embeds[0].fields.find(e => e.name == "What they want to work on");
                  if (!nameField || !learnField)
                    return;
                  arr.unshift(`${nameField.value}: https://discord.com/channels/${serverID}/${channelID}/${msg.id} \n  What they want to work on: ${learnField.value} \n`)
              }
            })

            for (var i = 0; i < arr.length; i++) {
              if (toSend.length + arr[i].length >= 2000) {
                message.channel.send(toSend);
                toSend = "";
              }
              toSend += arr[i];
            }
            if (toSend.length > 0)
              message.channel.send(toSend);

          }).catch((e) => {
            message.channel.send(e.message)
          })
        })
      } else {
        message.channel.send("insufficient perms");
      }
    }
});

// UC server id, for adding a role after adding reaction
client.on("messageReactionAdd", async (reaction, user)=>{
    try {
        if(reaction.message.partial) await reaction.message.fetch();
        if(reaction.partial) await reaction.fetch();

        if(user.bot) return;
        if(!reaction.message.guild) return;

        //restrict it so that you can only react to the msg sent by the roles command
        if(!reaction.message.embeds[0]) return;
        if(reaction.message.embeds[0].title != "Server Roles") return;

        if(reaction.message.guild.id === '718603683624910941'){
            if(reaction.emoji.name === 'cabwot'){
                await reaction.message.guild.members.cache.get(user.id).roles.add('742435236243046482');
            }
            else if(reaction.emoji.name === "thonk") {
                await reaction.message.guild.members.cache.get(user.id).roles.add('744805166888386560');
            }
        }
    }
    catch (e) {
        console.log(e);
    }
});

// UC server id, for removing a role after removal of reaction
client.on("messageReactionRemove", async (reaction, user)=>{
    try{
        if(reaction.message.partial) await reaction.message.fetch();
        if(reaction.partial) await reaction.fetch();

        if(user.bot) return;
        if(!reaction.message.guild) return;

        // restrict it so that you can only react to the msg sent by the roles command
        if(!reaction.message.embeds[0]) return;
        if(reaction.message.embeds[0].title != "Server Roles") return;

        if(reaction.message.guild.id === '718603683624910941'){
            if(reaction.emoji.name === 'cabwot'){
                await reaction.message.guild.members.cache.get(user.id).roles.remove('742435236243046482');
            }
            else if(reaction.emoji.name === "thonk") {
                await reaction.message.guild.members.cache.get(user.id).roles.remove('744805166888386560');
            }
            else if(reaction.emoji.name === "📹") {
                await reaction.message.guild.members.cache.get(user.id).roles.remove('769766202527449108');
            }
        }
    }
    catch (e) {
        console.log(e);
    }
});

client.login(process.env.BOT_TOKEN);
