const Discord = require("discord.js");
const dotenv = require("dotenv");

const util = require("./util");

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
function messageCensor(message) {
  message.delete();
  return message.channel.send(
    ` [ *message from ${message.author} deleted* ] \n :flag_kp: **그의 메시지는 조선 민주주의 인민 공화국 정부에 의해 자본주의 적, 반 혁명적, 제국 주의적, 멍청한 내용으로 검열되었습니다.** :flag_kp:`
  );
} // End Censor

// Bot Checks:
Bot.on("message", (message) => {
  const content = message.content.toLowerCase();
  const authorId = message.author.id;
  const arrayBadPeople = util.readBadPeople();
  let flag = 0;

  if (
    arrayBadPeople.filter(
      (censoredPeople) => censoredPeople.authorId == authorId
    ).length == 1
  ) {
    messageCensor(message);
    return;
  } else {
    badWord.some((word) => {
      if (flag > 0) return;

      if (content.includes(word)) {
        messageCensor(message);
        util.writeBadPeople({
          authorId,
          date: new Date(),
        });
        flag++;
      }
    });
  }
}); // End Bot.on
