$PidFile = Join-Path $PSScriptRoot "gateway-port-forward.pid"

Write-Host "`nStopping E-Commerce demo port-forward..." -ForegroundColor Cyan

if (-not (Test-Path $PidFile)) {
    Write-Host "No saved port-forward process was found."
    exit 0
}

$SavedPid = [int](Get-Content $PidFile)
$Process = Get-CimInstance Win32_Process -Filter "ProcessId = $SavedPid" -ErrorAction SilentlyContinue

if ($Process -and $Process.CommandLine -match "kubectl.*port-forward" -and $Process.CommandLine -match "envoy-default-ecommerce-gateway") {
    Stop-Process -Id $SavedPid -Force
    Write-Host "Port-forward stopped successfully." -ForegroundColor Green
}
else {
    Write-Host "The saved process is no longer the expected port-forward process."
}

Remove-Item $PidFile -Force
