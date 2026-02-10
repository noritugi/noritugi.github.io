# ====== New-LumePost.ps1 ======

# 記事タイトル（半角英数）を入力
$title = Read-Host "記事タイトルを半角英数で入力してください"

# 日付取得
$year = (Get-Date).ToString("yyyy")
$month = (Get-Date).ToString("MM")
$day = (Get-Date).ToString("dd")

# ファイル名生成
# yyyy/MM-dd-title.md
$dirPath = "posts/$year"
$fileName = "$month-$day-$title.md"
$filePath = Join-Path $dirPath $fileName

# ディレクトリが無ければ作成
if (!(Test-Path $dirPath)) {
    New-Item -ItemType Directory -Path $dirPath | Out-Null
}

# Markdown本文生成
$content = @"
---
title: $title
description: 
date: $year-$month-$day
tags:
  - hoge
---

<!-- more -->

"@

# ファイル作成
Set-Content -Path $filePath -Value $content -Encoding UTF8

Write-Host "Created: $filePath"
