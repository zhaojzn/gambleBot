const Discord = require('discord.js');
const { token } = require('./secrets.json');
const client = new Discord.Client();
const getBalance = require('./helpers/getBalance');
const checkRegistered = require('./helpers/checkRegistered');
const updateMoney = require('./helpers/updateMoney');
const blackjack = require('./games/blackjack');
const crash = require('./games/crash');
const duel = require('./games/duel');
const hideHouse = require('./games/hide');
//Discord client login
client.login(token);

client.once('ready', () => {
    console.log(`Bot is ready as ${client.user.tag}!`);
    client.user.setActivity(`Gambling Bot | -help`, {type: "PLAYING"});
});
//Listener function for the games
client.on('message', async msg => {
    try {
        if (msg.author.bot) return;
        if (!msg.content.toLowerCase().startsWith('-')) return;
        let discordID = msg.author.id;
        let discordUsername = msg.author.username;

        if (msg.content.toLowerCase().startsWith('-crash')) {
            let values = await checkRegistered.checkRegistered(discordID, discordUsername);
            let amount = msg.content.split(' ')[1];
            await crash.crash(msg, amount, values.balance, values.dig, values.inGame, client);

        } else if (msg.content.toLowerCase().startsWith('-blackjack')) {
            let values = await checkRegistered.checkRegistered(discordID, discordUsername);
            let amount = msg.content.split(' ')[1];
            await blackjack.blackjack(msg, amount, values.balance, values.dig, values.inGame, client);
        } else if (msg.content.toLowerCase().startsWith('-hide')) {
            let values = await checkRegistered.checkRegistered(discordID, discordUsername);
            let amount = msg.content.split(' ')[2];
            let hideNumber = msg.content.split(' ')[1];
            await hideHouse.hide(msg, hideNumber, amount, values.balance, values.dig, values.inGame);
        } else if (msg.content.toLowerCase().startsWith('-duel')) {
            let values = await checkRegistered.checkRegistered(discordID, discordUsername);
            let enemyID = msg.mentions.users.first();
            let amount = msg.content.split(' ')[2];
            await duel.duel(msg, enemyID, amount, values.balance, values.dig, values.inGame, client);
        } else if (msg.content.toLowerCase() === '-balance') {
            let values = await checkRegistered.checkRegistered(discordID, discordUsername);
            await balance(msg, values.balance);
        } else if (msg.content.toLowerCase() === '-dig') {
            let values = await checkRegistered.checkRegistered(discordID, discordUsername);
            await dig(msg, values.balance, values.dig, values.inGame);

        } else if (msg.content.toLowerCase() === '-beg') {
            let values = await checkRegistered.checkRegistered(discordID, discordUsername);
            await beg(msg, values.balance, values.dig, values.inGame);
        } else if (msg.content.toLowerCase() === '-help') {
            let url = "https://github.com/zhaojzn/gambleBot";
            let replyEmblem = new Discord.MessageEmbed()
                .setColor("LUMINOUS_VIVID_PINK")
                .setTitle("Help")
                .setDescription("To see how the code works please visit the github link by clicking on Help title.")
                .addFields(
                    {name: "balance", value: "Command: -balance"},
                    {name: "blackjack", value: "Command: -blackjack (bet-amount)"},
                    {name: "crash", value: "Command: -crash (bet-amount)"},
                    {name: "dig", value: "Command: -dig"},
                    {name: "duel", value: "Command: -duel @user (bet-amount)"},
                    {name: "hide", value: "Command: -hide (1-3) (bet-amount)"},
                    {name: "beg", value: "Command: -beg"})
                .setURL(url);
            await msg.reply(replyEmblem)
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
});

//function to get some money
async function dig(msg, balance, dig, inGame) {
    let discordID = msg.author.id;
    let discordName = msg.author.username;
    if (dig === false) {
        dig = true;
        let random = [500, 1000, 1500, 750, 1750, 3000];
        let extraMoney = (Math.random() * 5).toFixed(0);
        extraMoney = parseInt(extraMoney);
        extraMoney = random[extraMoney];
        msg.reply(`You found $${extraMoney}!`);
        await updateMoney.updateMoney(discordID, discordName, (balance + extraMoney), dig, inGame);
        let wait = setInterval(async () => {
            balance = await getBalance.getBalance(discordID);
            dig = false;
            await updateMoney.updateMoney(discordID, discordName, balance, dig, inGame)
            clearInterval(wait);
        }, 10800000)
    } else {
        msg.reply("You have already claimed your free chance, please wait 3 hrs!");
    }

}

//function to show the balance
async function balance(msg, balance) {
    msg.reply(`You have $${balance} in balance.`);
}

// when teh user has less than $5 and you can get maximum of $5-50
async function beg(msg, balance, dig, inGame) {
    let discordID = msg.author.id;
    let discordName = msg.author.username;
    if (balance <= 50) {
        let random = [10, 25, 15, 35, 5, 45];
        let extraMoney = (Math.random() * 5).toFixed(0);
        extraMoney = parseInt(extraMoney);
        extraMoney = random[extraMoney];
        msg.reply(`You begged for $${extraMoney}!`);
        await updateMoney.updateMoney(discordID, discordName, (balance + extraMoney), dig, inGame);
    } else {
        msg.reply("You cannot beg if you have more than $50!");
    }
}


//async function scratch(){}

//async function roulette(){}
