# sukkokoko

過去24時間のslackの流速を投稿するbotです。

## 使い方

### 下準備

`.env` ファイルに以下を記載。
```
SLACK_SIGNING_SECRET=<bot-slack-signing-secret>
SLACK_BOT_TOKEN=xoxb-...
SLACK_USER_TOKEN=xoxp-...
CHANNEL=random // 流速強さランキングを投稿したいチャンネル名
BOT_NAME=sukkokoko // ボットの名前
```

### 起動

```shell
$ node app.js
```

あとはcronとかで定時実行されるようにしてください。

## Botの権限について

scopeに以下を含めるようにしてください。

### Bot Token Scopes

- channels:history
- channels:read
- chat:write
- users:read

### User Token Scopes

- channels:write