# PowerShell script to package the BloodBridge project into a clean ZIP archive with .git history preserved
$destinationZip = "C:\Users\shaik\OneDrive\Desktop\BLOOD_BRIDGE(PROJECT-1).zip"
$sourceDir = "C:\Users\shaik\OneDrive\Desktop\BLOOD_BRIDGE(PROJECT-1)"
$stagingDir = "$env:TEMP\BloodBridge_Staging"

Write-Host "Packaging BloodBridge with .git history into $destinationZip..."

if (Test-Path $destinationZip) {
    Remove-Item $destinationZip -Force
}

if (Test-Path $stagingDir) {
    Remove-Item $stagingDir -Recurse -Force
}

New-Item -ItemType Directory -Path $stagingDir | Out-Null

# Exclude dependencies, build artifacts, local databases, and ANY .env files (zero secrets)
$excludePatterns = @(
    "node_modules",
    "dist",
    "build",
    "coverage",
    "backups",
    ".env",
    "*.env",
    "*.db",
    "*.db-journal",
    "*.sqlite",
    "*.log",
    ".DS_Store",
    "Thumbs.db"
)

# Note: -Force includes hidden directories such as .git
Get-ChildItem -Path $sourceDir -Recurse -Force | Where-Object {
    $item = $_
    $skip = $false

    # Always preserve .env.example
    if ($item.Name -eq ".env.example") {
        return $true
    }

    # Strict exclusions
    foreach ($pat in $excludePatterns) {
        if ($item.Name -like $pat -or $item.FullName -like "*\$pat\*" -or $item.FullName -like "*\$pat") {
            $skip = $true
            break
        }
    }
    -not $skip
} | ForEach-Object {
    $item = $_
    $targetPath = $item.FullName.Replace($sourceDir, $stagingDir)
    if ($item.PSIsContainer) {
        if (-not (Test-Path $targetPath)) {
            New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
        }
    } else {
        $parentDir = Split-Path $targetPath -Parent
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }
        Copy-Item -Path $item.FullName -Destination $targetPath -Force
    }
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($stagingDir, $destinationZip, [System.IO.Compression.CompressionLevel]::Optimal, $false)

Remove-Item $stagingDir -Recurse -Force

Write-Host "BloodBridge ZIP successfully generated at: $destinationZip"
Get-Item $destinationZip | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
