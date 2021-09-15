# sukkokoko

slack botです。

## 使い方

### 下準備

`.env` ファイルに以下を記載。
```
SLACK_SIGNING_SECRET=<bot-slack-signing-secret>
SLACK_BOT_TOKEN=xoxb-...
SLACK_URL=https://hogehoge.slack.com  // 末尾にスラッシュを付けない
```

### 起動

```shell
$ node app.js
```