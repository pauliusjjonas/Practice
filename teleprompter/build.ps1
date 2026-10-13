# Builds Teleprompter.exe and installs it for the current user.
#   powershell -ExecutionPolicy Bypass -File build.ps1
# Re-run after changing teleprompter.pyw to update the installed app.

$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$model = "vosk-model-small-en-us-0.15"
$installRoot = Join-Path $env:LOCALAPPDATA "Programs"
$installDir = Join-Path $installRoot "Teleprompter"
$work = Join-Path $env:TEMP "teleprompter-build"

if (-not (Test-Path (Join-Path $here $model))) { throw "Speech model folder '$model' is missing." }
if (-not (Test-Path (Join-Path $here "icon.ico"))) { python (Join-Path $here "make_icon.py") }

python -m pip install --quiet pyinstaller vosk sounddevice
if ($LASTEXITCODE -ne 0) { throw "pip install failed" }

# the running app locks its files, so close it before replacing them
Get-Process Teleprompter -ErrorAction SilentlyContinue | Stop-Process -Force

python -m PyInstaller --noconfirm --clean --windowed `
    --name Teleprompter `
    --icon (Join-Path $here "icon.ico") `
    --add-data "$(Join-Path $here 'icon.ico');." `
    --add-data "$(Join-Path $here $model);$model" `
    --collect-all vosk `
    --collect-all _sounddevice_data `
    --distpath $installRoot `
    --workpath $work `
    --specpath $work `
    (Join-Path $here "teleprompter.pyw")
if ($LASTEXITCODE -ne 0) { throw "PyInstaller build failed" }

$exe = Join-Path $installDir "Teleprompter.exe"
$shell = New-Object -ComObject WScript.Shell
$lnk = $shell.CreateShortcut((Join-Path ([Environment]::GetFolderPath("Programs")) "Teleprompter.lnk"))
$lnk.TargetPath = $exe
$lnk.WorkingDirectory = $installDir
$lnk.IconLocation = "$exe,0"
$lnk.Description = "Always-on-top teleprompter that follows your voice"
$lnk.Save()

Write-Host "Installed: $exe"
Write-Host "Start Menu shortcut created - search 'Teleprompter', right-click, Pin to taskbar."
