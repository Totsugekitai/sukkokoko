require('dotenv').config();

const { App } = require('@slack/bolt');
const utils = require('./src/utils');
const chat_speed = require('./src/chat_speed');

async function main() {
  const token = process.env.SLACK_BOT_TOKEN;

  const app = new App({
    token,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  });

  const [_, conversationsNameMap] = await utils.getConversationsInformation(app);

  chat_speed.postChatSpeed(app, token, conversationsNameMap[process.env.CHANNEL].id);

  console.log('⚡️ Bolt app is running!');
}

main();