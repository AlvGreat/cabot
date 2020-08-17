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
        ]

        const randomPun = Math.floor((Math.random() * puns.length));
        message.channel.send(puns[randomPun]);
    }

    else if (command === "quizpings" || command === "roles") {
        // if (!message.member.hasPermission("MANAGE_CHANNELS")) {
        //     return message.reply("You do not have permissions to use this command");
        // }
        
        let embed = new MessageEmbed()
        .setTitle('Quiz Pings')
        .setDescription('React to this message with <:cabwot:739717347618717726> to view and receive pings from the quiz channels!')
        .setColor('00688B')
        let sentEmbed = await message.channel.send(embed);
        sentEmbed.react('739717347618717726')
    }
    
    else if (command === "ping") {
        message.channel.send("Pong, I'm currently online! My commands are: !cabpun, !quizpings")
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
        if(reaction.message.embeds[0].title != "Quiz Pings") return;

        if(reaction.message.guild.id === '718603683624910941'){
            if(reaction.emoji.name === 'cabwot'){
                await reaction.message.guild.members.cache.get(user.id).roles.add('742435236243046482');
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
        if(reaction.message.embeds[0].title != "Quiz Pings") return;

        if(reaction.message.guild.id === '718603683624910941'){
            if(reaction.emoji.name === 'cabwot'){
                await reaction.message.guild.members.cache.get(user.id).roles.remove('742435236243046482');
            }
        }
    }
    catch (e) {
        console.log(e);
    }
});

client.login(process.env.BOT_TOKEN);
// client.login(token);