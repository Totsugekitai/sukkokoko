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

exports.getConversationsInformation = getConversationsInformation;
exports.getDateFromTsString = getDateFromTsString;