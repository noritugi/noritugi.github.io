# 乗継ログ

* https://blog.vuwuv.com

## コメント受け付けトゥート
```
deno task post ./posts/path/to/article.md
```
このタスクは以下のことを行います。

* コメント受け付けトゥートの投稿
* 該当記事のfront matterに以下を書き込む
```
comments:
  src: '<当該トゥートのURL>'
```

確認できたら、速やかにリポジトリへプッシュしてビルドを実行してください。

## タグ
日本語タグは使えません。  
半角英数を使ってください。