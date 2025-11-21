Param(
    [Parameter(Mandatory=$true)]
    [string]$File
)

# ===== 設定 =====
$BLOG_URL = "https://blog.vuwuv.com"

# ===== ファイル読み込み =====
$content = Get-Content $File -Raw

# ===== マルチラインで front matter を抽出 =====
$regex = "(?ms)^---\s*(.*?)\s*---"
if ($content -notmatch $regex) {
    Write-Host "YAML Front Matter が見つかりません。" -ForegroundColor Red
    exit 1
}

$yaml = $matches[1]

# ===== YAML から値抽出 =====
# title
if ($yaml -match "(?m)^title:\s*(.+)$") {
    $title = $matches[1].Trim()
} else {
    $title = "(タイトルなし)"
}

# date
if ($yaml -match "(?m)^date:\s*(.+)$") {
    $date = $matches[1].Trim()
} else {
    $date = Get-Date -Format "yyyy-MM-dd"
}

# 年を取得
$year = $date.Substring(0,4)

# slug
$slug = [System.IO.Path]::GetFileNameWithoutExtension($File)

# 公開URL
$postUrl = "$BLOG_URL/posts/$year/$slug/"

# ===== トゥート文面 =====
$toot = @"
📖 新しいブログ記事を公開しました！

📌 $title
🔗 $postUrl

コメントはこのトゥートに返信してください。
"@

Write-Host ""
Write-Host "===== 以下を Mastodon にコピペして投稿してください =====" -ForegroundColor Cyan
Write-Host ""
Write-Host $toot -ForegroundColor Yellow
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
