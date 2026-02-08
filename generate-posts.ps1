$root = "posts"
$count = 200

# 期間（ランダム日付の範囲）
$start = Get-Date "2023-01-01"
$end   = Get-Date "2025-12-31"

# 乱数
$rand = New-Object System.Random

for ($i = 1; $i -le $count; $i++) {
  # ランダム日付生成
  $range = ($end - $start).Days
  $date = $start.AddDays($rand.Next($range))

  $year = $date.Year
  $filenameDate = $date.ToString("MM-dd")
  $frontDate = $date.ToString("yyyy-MM-dd")

  # ディレクトリ作成
  $dir = Join-Path $root $year
  New-Item -ItemType Directory -Force -Path $dir | Out-Null

  # ファイル名
  $slug = "test-post-$i"
  $path = Join-Path $dir "$filenameDate-$slug.md"

  # front-matter
  $content = @"
---
title: テスト記事 $i
description: 自動生成されたテスト記事です
date: $frontDate
layout: post.vto
---
"@

  Set-Content -Path $path -Value $content -Encoding UTF8
}

Write-Host "✅ $count 件の Markdown ファイルを生成しました"