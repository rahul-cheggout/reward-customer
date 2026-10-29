<#
.SYNOPSIS
  Deployment script for Azure (Static Web App or Azure Storage Static Website)
#>

param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("swa", "storage")]
    [string]$Target = "swa",

    [Parameter(Mandatory=$false)]
    [string]$DeploymentToken,

    [Parameter(Mandatory=$false)]
    [string]$StorageAccountName,

    [Parameter(Mandatory=$false)]
    [string]$SasToken
)

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Cheggout Loyalty - Azure Deployment Helper " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Build project
Write-Host "`n[1/2] Building production bundle..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Aborting deployment."
    exit 1
}
Write-Host "Build complete -> dist/" -ForegroundColor Green

# 2. Deploy
if ($Target -eq "swa") {
    Write-Host "`n[2/2] Deploying to Azure Static Web Apps..." -ForegroundColor Yellow
    if ($DeploymentToken) {
        npx @azure/static-web-apps-cli deploy ./dist --deployment-token $DeploymentToken --env production
    } else {
        Write-Host "No deployment token provided. Starting interactive Azure SWA deployment..." -ForegroundColor Cyan
        npx @azure/static-web-apps-cli deploy ./dist --env production
    }
}
elseif ($Target -eq "storage") {
    Write-Host "`n[2/2] Deploying to Azure Storage Static Website ($`web)..." -ForegroundColor Yellow
    if (-not $StorageAccountName) {
        $StorageAccountName = Read-Host "Enter Azure Storage Account name"
    }

    if ($SasToken) {
        Write-Host "Uploading via AzCopy using SAS Token..." -ForegroundColor Cyan
        azcopy copy "./dist/*" "https://$StorageAccountName.blob.core.windows.net/`$web?$SasToken" --recursive --overwrite=true
    } else {
        Write-Host "Uploading via Azure CLI (az storage blob upload-batch)..." -ForegroundColor Cyan
        az storage blob upload-batch -s ./dist -d '$web' --account-name $StorageAccountName --auth-mode key --overwrite
    }
}
