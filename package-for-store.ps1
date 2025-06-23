# Omnisearch Extension Packaging Script v1.1
# This script creates a clean ZIP file for Chrome Web Store submission

Write-Host "🔍 Omnisearch Extension - Chrome Store Packaging" -ForegroundColor Blue
Write-Host "=================================================" -ForegroundColor Blue

# Read version from manifest.json
$manifestContent = Get-Content "manifest.json" -Raw | ConvertFrom-Json
$version = $manifestContent.version
Write-Host "📋 Detected version: $version" -ForegroundColor Cyan

# Create output directory
$outputDir = ".\store-package"
$zipName = "omnisearch-extension-v$version.zip"

if (Test-Path $outputDir) {
    Remove-Item $outputDir -Recurse -Force
    Write-Host "✓ Cleaned existing package directory" -ForegroundColor Green
}

New-Item -ItemType Directory -Path $outputDir | Out-Null
Write-Host "✓ Created package directory" -ForegroundColor Green

# Files to include in the extension package
$filesToInclude = @(
    "manifest.json",
    "popup.html",
    "popup.js", 
    "settings.html",
    "settings.js",
    "icon-16.png",
    "icon-32.png", 
    "icon-48.png",
    "icon-128.png",
    "icon.png",
    "icon.svg"
)

# Copy files to package directory
Write-Host "`n📦 Copying extension files..." -ForegroundColor Yellow
foreach ($file in $filesToInclude) {
    if (Test-Path $file) {
        Copy-Item $file $outputDir
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (not found)" -ForegroundColor Red
    }
}

# Create ZIP file
Write-Host "`n📦 Creating ZIP package..." -ForegroundColor Yellow
$zipPath = ".\$zipName"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Use PowerShell's Compress-Archive
Compress-Archive -Path "$outputDir\*" -DestinationPath $zipPath -CompressionLevel Optimal

if (Test-Path $zipPath) {
    $zipSize = (Get-Item $zipPath).Length
    $zipSizeKB = [math]::Round($zipSize / 1KB, 2)
    Write-Host "✓ Created $zipName ($zipSizeKB KB)" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create ZIP file" -ForegroundColor Red
    exit 1
}

# Cleanup temp directory
Remove-Item $outputDir -Recurse -Force
Write-Host "✓ Cleaned up temporary files" -ForegroundColor Green

# Display next steps
Write-Host "`n🚀 Package Ready for Chrome Web Store!" -ForegroundColor Blue
Write-Host "=======================================" -ForegroundColor Blue
Write-Host "📁 Package file: $zipName" -ForegroundColor White
Write-Host "📏 Size: $zipSizeKB KB" -ForegroundColor White
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to: https://chrome.google.com/webstore/devconsole/" -ForegroundColor White
Write-Host "2. Click 'New Item'" -ForegroundColor White
Write-Host "3. Upload: $zipName" -ForegroundColor White
Write-Host "4. Fill out store listing details" -ForegroundColor White
Write-Host "5. Submit for review" -ForegroundColor White
Write-Host "`n📖 See CHROME_STORE_GUIDE.md for detailed instructions" -ForegroundColor Cyan

# Verify package contents
Write-Host "`n🔍 Package Contents Verification:" -ForegroundColor Yellow
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
foreach ($entry in $zip.Entries) {
    Write-Host "  ✓ $($entry.Name)" -ForegroundColor Green
}
$zip.Dispose()

Write-Host "`n✅ Packaging complete!" -ForegroundColor Green 