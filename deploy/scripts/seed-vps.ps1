# ═══════════════════════════════════════════════════════════════
# VDCD Backend — Local PowerShell Seed Script for VPS
# ═══════════════════════════════════════════════════════════════
# Usage:
#   .\deploy\scripts\seed-vps.ps1 [-VpsHost <ip>] [-VpsPort <port>] [-VpsUser <user>]
# ═══════════════════════════════════════════════════════════════
param (
    [string]$VpsHost = $env:VPS_HOST,
    [string]$VpsPort = $(if ($env:VPS_PORT) { $env:VPS_PORT } else { "22" }),
    [string]$VpsUser = $(if ($env:VPS_USER) { $env:VPS_USER } else { "deploy" }),
    [string]$SqlFile = "docs/full-database-seed.sql"
)

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "         VDCD LOCAL SEED RUNNER FOR VPS (POWERSHELL)           " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

if (-not $VpsHost) {
    $VpsHost = Read-Host "Nhập địa chỉ VPS Host (IP hoặc Domain)"
}

if (-not (Test-Path $SqlFile)) {
    Write-Host "❌ Không tìm thấy file SQL tại: $SqlFile" -ForegroundColor Red
    exit 1
}

$confirm = Read-Host "Bạn có chắc chắn muốn nạp dữ liệu $SqlFile vào VPS $VpsHost (Cổng $VpsPort)? (nhập YES)"
if ($confirm -ne "YES") {
    Write-Host "⚠️ Đã hủy thao tác." -ForegroundColor Yellow
    exit 0
}

Write-Host "🚀 Đang truyền file SQL và thực thi vào container vdcd-postgres trên VPS..." -ForegroundColor Green
Get-Content $SqlFile | ssh -p $VpsPort -o StrictHostKeyChecking=no "$VpsUser@$VpsHost" "docker exec -i vdcd-postgres psql -U vdcd_user -d vdcd_db"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Nạp dữ liệu hoàn tất! Đang xóa cache Redis..." -ForegroundColor Green
    ssh -p $VpsPort -o StrictHostKeyChecking=no "$VpsUser@$VpsHost" "docker exec vdcd-redis redis-cli FLUSHDB"
    Write-Host "🎉 Hoàn tất quá trình seed dữ liệu vào VPS!" -ForegroundColor Cyan
} else {
    Write-Host "❌ Có lỗi xảy ra trong quá trình nạp dữ liệu." -ForegroundColor Red
}
