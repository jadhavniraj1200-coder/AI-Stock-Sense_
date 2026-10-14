<#
  Swad Restaurant - Local Lightweight Web Server
  Zero external dependencies. Uses .NET HttpListener built into Windows PowerShell.
#>

$port = 3000
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host ""
    Write-Host "==========================================================================" -ForegroundColor DarkYellow
    Write-Host "  Swad Restaurant - Smart Inventory & Food Waste Management Prototype" -ForegroundColor Yellow
    Write-Host "  Local Server running at: $prefix" -ForegroundColor Green
    Write-Host "  Press Ctrl+C to stop the server." -ForegroundColor Gray
    Write-Host "==========================================================================" -ForegroundColor DarkYellow
    Write-Host ""

    # Open default browser automatically
    Start-Process $prefix

    $baseDir = $PSScriptRoot
    if (-not $baseDir) { $baseDir = (Get-Location).Path }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($rawPath) -or $rawPath -eq "") {
            $rawPath = "index.html"
        }

        $filePath = Join-Path $baseDir $rawPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawPath")
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }

        $response.Close()
    }
}
catch {
    Write-Host "Server Error: $_" -ForegroundColor Red
}
finally {
    $listener.Stop()
}
