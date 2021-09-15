require('dotenv').config();
const utils = require('./utils');

// IDで指定されたchannelの24時間以内のpost数を集計する
async function getNumberOfDayPost(app, token, channel) {
  const unixDayTime = 1000 * 60 * 60 * 24;
  const current = new Date();
  const yesterday = (new Date((current.valueOf() - unixDayTime)).getTime() / 1000);
  const oldest = yesterday.toString();

  const result = await app.client.conversations.history({
    token,
    channel,
    oldest,
    limit: 500,
  });

  return {
    channel,
    numberOfPost: Object.keys(result.messages).length
  };
}

// 全てのチャンネルの情報と流速のペアをソートして返す
async function getAllChannelsNumberOfPost(app, token) {
  const conversations = (await app.client.conversations.list()).channels;
  let channelsInfoWithNumberOfPost = [];

  for (i = 0; i < Object.keys(conversations).length; i++) {
    const numberOfPost = (await getNumberOfDayPost(app, token, conversations[i].id)).numberOfPost;
    const channelWithNumberOfPost = { channel: conversations[i], numberOfPost };
    channelsInfoWithNumberOfPost.push(channelWithNumberOfPost);
  }

  // こっちのコードは動かない(多分クロージャ内でオブジェクトが破棄されている)
  /*   conversations.forEach(async (conversation) => {
      const numberOfPost = (await getNumberOfDayPost(app, token, conversation.id)).numberOfPost;
      const channelWithNumberOfPost = { channel: conversation, numberOfPost };
      channelsInfoWithNumberOfPost.push(channelWithNumberOfPost);
      // channelsInfoWithNumberOfPost.push({ channels: conversation, numberOfPost: (await getNumberOfDayPost(app, token, conversation.id)).numberOfPost });
    });
   */

  return channelsInfoWithNumberOfPost.sort(function (a, b) { return b.numberOfPost - a.numberOfPost });
}

// 過去24時間の流速をchannelに投稿
async function postChatSpeed(app, token, channel) {
  const channelArray = await getAllChannelsNumberOfPost(app, token);

  let text = "*⏱本日の 流速強さ ランキング (575)🏃‍♂️🏃‍♂️🏃‍♂️*\n";
  for (i = 0; i < channelArray.length; i++) {
    const s = `<${process.env.SLACK_URL}/archives/${channelArray[i].channel.id}|#${channelArray[i].channel.name}>:\t${channelArray[i].numberOfPost}\n`;
    text += s;
  }

  await app.client.chat.postMessage({
    token,
    channel,
    text
  });
}

exports.postChatSpeed = postChatSpeed;