const Discord = require('discord.js');
const { prefix, token } = require('./config.json')
const client = new Discord.Client();
const { MessageEmbed } = require('discord.js');

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async message => {
    //this will check if a message starts with the bot prefix or if the message sender is a Discord bot themselves
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //will take messages from Discord and check if they match the commands below
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
        sentEmbed.react('📹')
    }

    else if (command === "ping") {
        message.channel.send("Pong, I'm currently online! My commands are: !ping, !cabpun, !roles, and !togglecoach")
    }
    else if (command === "togglecoach") {
      let coachRole = "721831112103428160";
      let activeCoachRole = "769805724930277416";

      //var coachRole = "769812406758539285";
      //var activeCoachRole = "647172876406882329";
      if (message.member.roles.cache.has(coachRole)){
        if (message.member.roles.cache.has(activeCoachRole)) {
          message.member.roles.remove(activeCoachRole);
          message.reply("Unset as active coach.");
        } else {
          message.member.roles.add(activeCoachRole);
          message.reply("Set as active coach.");
        }
      }
    } else if (command == "nickname") {
      let participantRole = "785609922654109796";
      if (message.member.roles.cache.has(participantRole)) {
        message.reply("Tournament participants cannot change their nickname to make finding your opponent easier on tournament day.")
      } else {
        message.member.setNickname(args.join(" "))
        .then(() => message.reply("nickname set"))
        .catch(() => {message.reply("I can't change your nickname, probably because of permissions")});
      }
    }
});

//UC server id, for adding a role after adding reaction
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
            else if(reaction.emoji.name === "📹") {
                await reaction.message.guild.members.cache.get(user.id).roles.add('769766202527449108');
            }
        }
    }
    catch (e) {
        console.log(e);
    }
});

//UC server id, for removing a role after removal of reaction
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
