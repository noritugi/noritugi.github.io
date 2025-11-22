---
title: AkkomaをやめてMastodonにした
description: 低リソースでMastodonインスタンス
date: 2023-09-14T00:00:00.000Z
tags:
  - server
  - Mastodon
  - fediverse
---

<!-- more -->

## 理由
* UIが好きになれなかった
* 文字コード廻りでエラーが発生した
* ドキュメントが少ない

## 構成
AWS Lightsail
* 5ドルプラン(メモリ1GB・SSD40GB)
* Ubuntu 22.04

今回はDockerコンテナではなく、ホストに直接インストールした。

## 知見
インストールは公式の [Installing from source](https://docs.joinmastodon.org/admin/install/) に従ってインストールした。

### スワップ
スワップは必ず用意する。1GBの場合、スワップは3GBでいいというネット情報を鵜呑みして3GB用意。
```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=3072
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```
起動時に有効になるように ``/etc/fstab`` へ追記
```bash
echo "/swapfile swap swap defaults 0 0" | sudo tee -a /etc/fstab
```
freeコマンドで有効になってるか確認する。
```
free -h
               total        used        free      shared  buff/cache   available
Mem:           924Mi       666Mi        63Mi        11Mi       195Mi        86Mi
Swap:          3.0Gi       829Mi       2.2Gi
```

### 初回セットアップ時のアセットファイルのコンパイルで失敗する
メモリが足りないため失敗する。

一旦失敗したファイルを削除する。
```
bundle exec rake assets:clobber RAILS_ENV=production
```
nodeのオプションを付けて再コンパイル
```
bundle exec rake assets:precompile RAILS_ENV=production NODE_OPTIONS=--max_old_space_size=924
```
これで成功した。

### メールの再テスト
[サーバからのメールちゃんと届く？(Mastodonサーバ管理者向け チェックリストの解説)](https://blog.noellabo.jp/entry/mastodon-admin-checklist#%E3%82%B5%E3%83%BC%E3%83%90%E3%81%8B%E3%82%89%E3%81%AE%E3%83%A1%E3%83%BC%E3%83%AB%E3%81%A1%E3%82%83%E3%82%93%E3%81%A8%E5%B1%8A%E3%81%8F)
より  
mastodonユーザーで、liveディレクトリより
```
RAILS_ENV=production bin/rails runner "UserMailer.new.mail(to:'admin@example.com', subject: 'test', body: 'awoo').deliver"
```
で再度メールを飛ばせる。リンクした記事は知見が多くて助かる。

## まとめ
Mastodonインスタンスにメモリ1GBでは正直つらい😭


<iframe src="https://uni.vuwuv.com/@noritsugi/111502707067824361/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="800" allowfullscreen="allowfullscreen"></iframe><script src="https://uni.vuwuv.com/embed.js" async="async"></script>

<iframe src="https://uni.vuwuv.com/@noritsugi/111502988244619603/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="800" allowfullscreen="allowfullscreen"></iframe><script src="https://uni.vuwuv.com/embed.js" async="async"></script>
