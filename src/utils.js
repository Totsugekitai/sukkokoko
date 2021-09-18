const { App } = require('@slack/bolt');

// channel情報をマップにして返す関数
// IDがキーのマップとnameがキーのマップの2つ
async function getConversationsInformation(app) {
  const conversations = (await app.client.conversations.list()).channels;
  let conversationsIdMap = {}; // channel情報をIDで引けるようにしたマップ
  conversations.forEach(conversation => {
    const conversationId = conversation['id'];
    conversationsIdMap[conversationId] = conversation;
  });
  let conversationsNameMap = {}; // channel情報をnameで引けるようにしたマップ
  conversations.forEach(conversation => {
    const conversationName = conversation['name'];
    conversationsNameMap[conversationName] = conversation;
  });

  return [conversationsIdMap, conversationsNameMap];
}

// ts メンバからDate型を得る関数
// 戻ってくる時刻は日本時刻
function getDateFromTsString(tsString) {
  const JSTString = new Date(parseFloat(tsString) * 1000).toLocaleString({ timeZone: 'Asia/Tokyo' });
  return new Date(JSTString);
}

// 主にbotをchannel IDにinviteする関数
async function inviteChannel(channel, users) {
  try {
    const appUser = new App({
      token: process.env.SLACK_USER_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET
    });
    await appUser.client.conversations.invite({
      token: process.env.SLACK_USER_TOKEN,
      channel,
      users
    });
  } catch (error) {
    if (error.data.error !== 'already_in_channel' && error.data.error !== 'is_archived') console.error(error);
  }
}

// ボットの情報を取ってくる関数
async function getBotInfo(app, token, botName) {
  try {
    const usersList = await app.client.users.list({ token });
    let botInfo = undefined;
    for (let i = 0; i < usersList.members.length; i++) {
      if (usersList.members[i].name === botName) {
        botInfo = usersList.members[i];
      }
    }
    return botInfo;
  } catch (error) {
    return undefined;
  }
}

// channel内にボットが参加しているか判定する関数
async function isBotJoined(app, token, channel, botId) {
  try {
    const members = await app.client.conversations.members({
      token,
      channel
    });
    members.members.forEach(userId => {
      if (userId === botId) return true;
    });
    return false;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

exports.getConversationsInformation = getConversationsInformation;
exports.getDateFromTsString = getDateFromTsString;
exports.inviteChannel = inviteChannel;
exports.getBotInfo = getBotInfo;
exports.isBotJoined = isBotJoined;