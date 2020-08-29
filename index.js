const Discord = require("discord.js");
const dotenv = require("dotenv");

const util = require("./util");
const connection = require("./database");

// Dictionaries requires
const badWord = require("./dictionaries/Bad_Words.json");

// Bot Configuration:
const Bot = new Discord.Client();
dotenv.config();

Bot.login(process.env.BOT_KEY);

Bot.once("ready", () => {
  Bot.user.setActivity("애국가", {
    type: "LISTENING",
  });

  util.scheduler();
});

// Function Censor Bad Message:
async function messageCensor(message) {
  try {
    await message.delete();
    return await message.channel.send(
      ` [ *message from ${message.author} deleted. Bad word detected* ] \n :flag_kp: **그의 메시지는 조선 민주주의 인민 공화국 정부에 의해 자본주의 적, 반 혁명적, 제국 주의적, 멍청한 내용으로 검열되었습니다.** :flag_kp:`
    );
  } catch (e) {
    console.log(e);
    console.log("error on sending message");
  }
} // End Censor

async function messageMuted(message) {
  try {
    return await message.channel.send(
      `[ *${message.author} mutted for bad behavior* ] \n :flag_kp: **축하합니다. 검열하는 동안 할당량이 소진되었습니다. 30 초를 기다려야합니다.** :flag_kp:`,
      { files: ["./images/0657e1cd66b8cf8d6f2e491d7a0142ae.png"] }
    );
  } catch (e) {
    console.log(e);
    console.log("error on repreending bad person");
  }
}

// Bot Checks:
Bot.on("message", async (message) => {
  try {
    const content = message.content.toLowerCase();
    const authorId = message.author.id;
    const badPeople = await connection.get(authorId);

    if (authorId === "697523839390974105") return;
    if (message.author.bot) return;

    if (badPeople) {
      if (badPeople.threshold >= 5) {
        console.log("mutting");
        let discordUser = message.guild.member(authorId);
        discordUser.roles.add("749101221633196052");
        await messageMuted(message);

        setTimeout(function () {
          discordUser.roles.remove("749101221633196052");
          console.log("revoking exiled role");
        }, 30000);
      } else {
        await messageCensor(message);
        await connection.update(authorId);
      }
    } else {
      let flag = 0;

      for (const key in badWord) {
        if (badWord.hasOwnProperty(key)) {
          const element = badWord[key];
          if (flag > 0) return;

          if (content.includes(element)) {
            await messageCensor(message);
            await connection.add({
              authorId,
              date: new Date(),
              threshold: 1,
            });
            flag++;
          }
        }
      }
    }
  } catch (e) {}
}); // End Bot.on
