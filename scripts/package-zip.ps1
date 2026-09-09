# PowerShell script to package the BloodBridge project into a clean ZIP archive
$destinationZip = "C:\Users\shaik\OneDrive\Desktop\BLOOD_BRIDGE(PROJECT-1).zip"
$sourceDir = "C:\Users\shaik\OneDrive\Desktop\BLOOD_BRIDGE(PROJECT-1)"
$stagingDir = "$env:TEMP\BloodBridge_Staging"

Write-Host "Packaging BloodBridge into $destinationZip..."

if (Test-Path $destinationZip) {
    Remove-Item $destinationZip -Force
}

if (Test-Path $stagingDir) {
    Remove-Item $stagingDir -Recurse -Force
}

New-Item -ItemType Directory -Path $stagingDir | Out-Null

$exclude = @("node_modules", "dist", ".git", "dev.db", "dev.db-journal", "*.log")

Get-ChildItem -Path $sourceDir -Recurse | Where-Object {
    $item = $_
    $skip = $false
    foreach ($pat in $exclude) {
        if ($item.FullName -like "*\$pat*" -or $item.Name -like $pat) {
            $skip = $true
            break
        }
    }
    -not $skip
} | Copy-Item -Destination {
    $targetPath = $_.FullName.Replace($sourceDir, $stagingDir)
    $parentDir = Split-Path $targetPath -Parent
    if (-not (Test-Path $parentDir)) {
        New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
    }
    $targetPath
} -Force

Compress-Archive -Path "$stagingDir\*" -DestinationPath $destinationZip -CompressionLevel Optimal

Remove-Item $stagingDir -Recurse -Force

Write-Host "BloodBridge ZIP successfully generated at: $destinationZip"
Get-Item $destinationZip | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
