$ErrorActionPreference = "Stop"

$ExpectedContext = "kind-ecommerce"
$GatewayService = "envoy-default-ecommerce-gateway-e52ea345"
$Namespace = "envoy-gateway-system"
$Port = "8081"
$PidFile = Join-Path $PSScriptRoot "gateway-port-forward.pid"

Write-Host "`nStarting E-Commerce demo..." -ForegroundColor Cyan

$Context = kubectl config current-context
if ($Context -ne $ExpectedContext) {
    throw "Wrong Kubernetes context. Expected $ExpectedContext but found $Context"
}

kubectl get nodes
if ($LASTEXITCODE -ne 0) {
    throw "Kubernetes cluster is not accessible."
}

kubectl get service $GatewayService -n $Namespace
if ($LASTEXITCODE -ne 0) {
    throw "Envoy Gateway service was not found."
}

if (Test-Path $PidFile) {
    $ExistingPid = [int](Get-Content $PidFile)
    $ExistingProcess = Get-Process -Id $ExistingPid -ErrorAction SilentlyContinue

    if ($ExistingProcess) {
        Write-Host "A port-forward process may already be running (PID $ExistingPid)." -ForegroundColor Yellow
        Write-Host "Check http://localhost:$Port before starting another one."
        exit 0
    }

    Remove-Item $PidFile -Force
}

$Process = Start-Process -FilePath "kubectl" `
    -ArgumentList @(
        "port-forward",
        "-n", $Namespace,
        "svc/$GatewayService",
        "$Port`:80"
    ) `
    -PassThru `
    -WindowStyle Hidden

Start-Sleep -Seconds 3

if ($Process.HasExited) {
    throw "Port-forward failed to start. Run the kubectl port-forward command manually to inspect the error."
}

$Process.Id | Set-Content $PidFile

Write-Host "`nE-Commerce gateway port-forward started." -ForegroundColor Green
Write-Host "Open: http://localhost:$Port"
Write-Host "Process ID: $($Process.Id)"
