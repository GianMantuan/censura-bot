const cron = require("node-cron");
const fs = require("fs");

const util = {};

// Scheduler at every 5 minutes:
util.scheduler = () => {
  cron.schedule("*/5 * * * *", () => {
    console.log("verifying...");
    util.verifyBadPeopleTimestamp();
  });
}; // End Scheduler

// Read JSON Bad_People:
util.readBadPeople = () => {
  return JSON.parse(fs.readFileSync("./dictionaries/Bad_People.json"));
}; // End Read

// Write JSON Bad_People
util.writeBadPeople = (people, reset = false) => {
  let arrayBadPeople;

  if (reset) {
    arrayBadPeople = people;
  } else {
    arrayBadPeople = util.readBadPeople();
    arrayBadPeople.push(people);
  }

  return fs.writeFileSync(
    "./dictionaries/Bad_People.json",
    JSON.stringify(arrayBadPeople)
  );
}; // End Write

// Verify Bad_People Timestamp:
util.verifyBadPeopleTimestamp = () => {
  util.writeBadPeople([], true);
}; // End Verify

module.exports = util;
