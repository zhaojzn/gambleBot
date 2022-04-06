const MongoClient = require('mongodb').MongoClient;
const secret = require('../secrets.json');
const { MongoUri } = require('../secrets.json');

//Check user and make a new account if it does not exist in the database
async function checkRegistered(discordID, discordName) {
    const MClient = new MongoClient(MongoUri, {useNewUrlParser: true, useUnifiedTopology: true});
    //Mongo client log in
    let client = await MClient.connect();
    let query = await client.db("GamblerBot").collection("users").findOne({discordID: discordID});
    if (query == null) {
        let newUser = {
            name: discordName,
            discordID: discordID,
            money: 5000,
            dig: false,
            inGame: false
        }
        await client.db("GamblerBot").collection("users").insertOne(newUser);
        await client.close();
        return {
            balance: 5000,
            dig: false,
            inGame: false
        }
    } else {
        await client.close();
        return {
            balance: query.money,
            dig: query.dig,
            inGame: query.inGame
        }
    }

}

module.exports = {checkRegistered}