const MongoClient = require('mongodb').MongoClient;
const secret = require('../secrets.json');
const { MongoUri } = require('../secrets.json');

// function to get the balance of the user
async function getBalance(discordID) {
    const MClient = new MongoClient(MongoUri, {useNewUrlParser: true, useUnifiedTopology: true});
    let client = await MClient.connect();
    let query = await client.db("GamblerBot").collection("users").findOne({discordID: discordID});
    if (client) {
        await client.close();
    }
    return query.money;

}

module.exports = {getBalance}