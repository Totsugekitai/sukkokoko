# sukkokoko

slack botです。

## 使い方

### 下準備

`.env` ファイルに以下を記載。
```
SLACK_SIGNING_SECRET=<bot-slack-signing-secret>
SLACK_BOT_TOKEN=xoxb-...
SLACK_URL=https://hogehoge.slack.com  // 末尾にスラッシュを付けない
CHANNEL=random // 流速強さランキングを投稿したいチャンネル名
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