# noritsugi-log

* https://blog.vuwuv.com

## コメント受け付けトゥート
```
.\make-toot.ps1 .\posts\<該当記事>.md
```
出力された文面をコピーしてトゥートしてください。

該当記事のfront matterに以下を記入
```
comments:
  src: '<当該トゥートのURL>'
```

そしてリポジトリへプッシュしてビルドを実行してください。

## タグ
日本語タグは使えません。  
半角英数を使ってください。