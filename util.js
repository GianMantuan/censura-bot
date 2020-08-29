const cron = require("node-cron");
const connection = require("./database");

const util = {};

// Scheduler at every 5 minutes:
util.scheduler = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("verifying...");
    await util.verify();
  });
}; // End Scheduler

util.verify = async () => {
  const FIVE_MIN = 5 * 60 * 1000;
  try {
    badPeople = await connection.all();

    for (const person of badPeople) {
      let dateDiff = new Date() - new Date(person.date);
      if (dateDiff > FIVE_MIN) {
        console.log("removing");
        await connection.remove(person.authorId);
      }
    }
  } catch (e) {
    console.log("error verifying removing from censorshit");
  }
};

module.exports = util;
