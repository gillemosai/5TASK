$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$pwd\5Task App.lnk")
$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = "/c ""$pwd\Iniciar App.bat"""
$Shortcut.WindowStyle = 7 # Minimized
$Shortcut.IconLocation = "shell32.dll,3" # Folder icon
$Shortcut.Save()
Write-Host "Atalho '5Task App.lnk' re-criado com sucesso!"
Write-Host "Tente fixar este novo atalho na barra de tarefas."
