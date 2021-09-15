require('dotenv').config();
// const utils = require('./utils');

// IDで指定されたchannelの24時間以内のpost数を集計する
async function getNumberOfDayPost(app, token, channel) {
  const unixDayTime = 1000 * 60 * 60 * 24;
  const current = new Date();
  const yesterday = (new Date((current.valueOf() - unixDayTime)).getTime() / 1000);
  const oldest = yesterday.toString();

  try {
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
  } catch (error) {
    return undefined;
  }
}

// 全てのチャンネルの情報と流速のペアをソートして返す
async function getAllChannelsNumberOfPost(app, token) {
  const conversations = (await app.client.conversations.list()).channels;
  let channelsInfoWithNumberOfPost = [];

  // conversationsをforEachで回したらクロージャ内でオブジェクトが破棄されて厳しくなったので普通のfor文で書いてます
  for (i = 0; i < Object.keys(conversations).length; i++) {
    const channelObject = await getNumberOfDayPost(app, token, conversations[i].id);
    if (channelObject === undefined) continue;
    const numberOfPost = channelObject.numberOfPost;
    const channelWithNumberOfPost = { channel: conversations[i], numberOfPost };
    channelsInfoWithNumberOfPost.push(channelWithNumberOfPost);
  }

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
  console.log("post chat speed log");
}

exports.postChatSpeed = postChatSpeed;