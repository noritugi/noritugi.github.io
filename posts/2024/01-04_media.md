---
title: Mastodon←→MisskeyのアニメーションGIFとWEBPの見え方
description:  Mastodon←→MisskeyのアニメーションGIFとWEBPの見え方について小まとめ
date: 2024-01-04
tags:
  - Misskey
  - Mastodon
  - fediverse
comments:
  src: 'https://uni.vuwuv.com/@noritsugi/115562848863959385'
---
<!-- more -->

## 前置き
メディアをMastodon(v4.2.3)にアップロードすると画像、音声、ビデオの各メディアファイルがエンコードされる。Misskeyのようにエンコードしないというオプションはないようである。  
この記事ではMastodonとMisskeyそれぞれのアニメーションGIFとWEBPファイルの見え方ついて少しまとめる。

確認環境
* Webインターフェース
* Mastodon v4.2.3(自分のサーバー)
* Fedibird v3.4.1
* Misskey 2023.12.2(misskey.cloud)

## 各サーバー間の見え方

### Mastodon→Mastodon
* アニメーションGIF:アップロードしたサーバー上でMP4動画にエンコードされる。  
Mastodonインスタンス上ではループアニメーションとして繰り返し再生される。
* アニメーションWEBP:静止画WEBP画像にエンコードされてしまい、動画としては使えなくなってしまう。

### Mastodon→Misskey
* アニメーションGIF:ただのMP4動画として再生される。ループアニメーションとして繰り返し再生されない。
* アニメーションWEBP:ただの静止画として表示される。

### Misskey→Misskey
* アニメーションGIF:「オリジナル画像を保持」のオプションの有無にかかわらずループアニメーションとして再生される。
* アニメーションWEBP:「オリジナル画像を保持」のオプションの有無にかかわらずループアニメーションとして再生される。

#### Misskey→Mastodon
* アニメーションGIF:「オリジナル画像を保持」のオプションの有無にかかわらずループアニメーションとして再生される。
* アニメーションWEBP:「オリジナル画像を保持」のオプションの有無にかかわらずループアニメーションとして再生される。

## まとめ
### アニメーションGIF

サーバー|Mastodonクライアント|Misskeyクライアント
:--|:--:|--:
Mastodon|ループアニメーション再生|MP4動画再生
Misskey|ループアニメーション再生|ループアニメーション再生

### アニメーションWEBP

サーバー|Mastodonクライアント|Misskeyクライアント
:--|:--:|--:
Mastodon|静止画|静止画
Misskey|ループアニメーション再生|ループアニメーション再生

現時点で何も考えずループアニメーション画像を見せたいのであれば、Misskeyを使う方がいいよという結果になった。

ちなみにMastodonの「アニメーションGIFを自動再生する」のオプション有無はアニメーションWEBPについてはまったく関係しない。つまり静止画WEBPだけサポートしているけどアニメーションWEBPはまだサポートしてないよというところだろう。

## おまけ

(レイアウトが崩れていなければ)左がアニメーションGIF画像、右がアニメーションWEBP画像。

Fedibird(Mastodon)は仕様上ログインしてない状態では、デフォルト設定のマウスオーバーの状態でしかアニメーション再生されない。

### Fedibird
<iframe src="https://fedibird.com/@noritsugi/115565724975420470/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400" allowfullscreen="allowfullscreen"></iframe><script src="https://fedibird.com/embed.js" async="async"></script>

### Misskey.cloud
<iframe src="https://misskey.cloud/embed/notes/af6v0q34id" data-misskey-embed-id="v1_af6v30qzd6" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" style="border: none; width: 100%; max-width: 500px; height: 300px; color-scheme: light dark;"></iframe>
<script defer src="https://misskey.cloud/embed.js"></script>