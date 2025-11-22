---
title: Akkomaインスタンス立ち上げ
description: Akkomaでお一人様インスタンスを立てた
date: 2023-08-03
tags:
  - server
  - akkoma
  - fediverse
---

<!-- more -->

## 概要

AWS Lightsailの
* 5ドルプラン(メモリ1GB・SSD40GB)
* Ubuntu 22.04
* Docker

でAkkomaインスタンスを立ち上げた。

Akkomaにした理由としては
* 低リソースでも稼動する
* Misskeyのリアクションが受け取れる

の二点。

## 運用者としての注意点

* [Mitigating the recent Pleroma issues](https://webb.spiderden.org/2023/05/26/pleroma-mitigation/)

によると2023年5月現在PleromaとAkkomaに脆弱性があるとのこと。  
お一人様インスタンスには影響はないらしいが、  
メディアのURLをサブドメインにリダイレクトすることで、この脆弱性の影響を軽減できるらしい。  
詳細はリンク先記事参照。

## まとめ

お一人様インスタンスだからいつまで続けるか不明🤔  
Fediverseなんもわからん。
