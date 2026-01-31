import subprocess
import webbrowser
import time
import os
import sys
import signal
import winreg
import shlex

def get_default_browser_command():
    """Tries to find the command for the default HTTP browser from the Windows Registry."""
    try:
        # Check UserChoice for specific protocol handler
        key_path = r"Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice"
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, key_path) as key:
            prog_id = winreg.QueryValueEx(key, 'ProgId')[0]
        
        # Look up the command for that ProgId
        command_path = fr"{prog_id}\shell\open\command"
        with winreg.OpenKey(winreg.HKEY_CLASSES_ROOT, command_path) as key:
            command = winreg.QueryValueEx(key, '')[0]
            
        # Extract the executable path from the command string (usually "path" %1)
        # Using shlex to handle quoted paths correctly
        args = shlex.split(command)
        if args:
            return args[0]
            
    except Exception as e:
        print(f"Could not detect default browser from registry: {e}")
    
    return None

def find_browser_executable():
    """Finds a compatible browser executable (Chrome, Edge, etc)."""
    
    # 1. Try to get the user's default browser
    default_browser = get_default_browser_command()
    if default_browser and os.path.exists(default_browser):
        # Check if it looks like a Chromium browser (supporting --app)
        name = os.path.basename(default_browser).lower()
        if any(x in name for x in ['chrome', 'msedge', 'brave', 'opera']):
            print(f"Navegador padrão detectado: {name}")
            return default_browser

    # 2. Fallback: Search for Edge (Guaranteed on Windows) or Chrome
    print("Buscando navegadores alternativos...")
    possible_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            print(f"Navegador encontrado: {path}")
            return path
            
    return None

def cleanup_server(server_process):
    """Terminates the server process tree."""
    print("\nEncerrando o servidor e processos filhos...")
    try:
        # On Windows, taskkill is more reliable for killing process trees
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(server_process.pid)], 
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        print(f"Erro ao encerrar processos: {e}")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    package_json = os.path.join(base_dir, 'package.json')
    
    if not os.path.exists(package_json):
        print("ERRO: package.json não encontrado no diretório atual!")
        input("Pressione Enter para sair...")
        return

    # 1. Start the Server
    print("Iniciando o Servidor (npm run dev)...")
    try:
        # Create a new process group so we can kill the whole tree later
        server_process = subprocess.Popen(
            ['npm', 'run', 'dev'], 
            cwd=base_dir, 
            shell=True
        )
    except Exception as e:
        print(f"Erro ao iniciar o servidor: {e}")
        input("Pressione Enter para sair...")
        return

    # Wait a bit for the server to spin up
    print("Aguardando inicialização (4 segundos)...")
    time.sleep(4)
    
    app_url = "http://localhost:5173"

    # 2. Launch the Browser
    browser_exe = find_browser_executable()
    
    if browser_exe:
        print(f"Abrindo App em modo janela segura...")
        try:
            # Launch in Application Mode (--app=URL)
            # This creates a dedicated window and usually allows waiting for exit
            browser_process = subprocess.Popen([browser_exe, f"--app={app_url}"])
            
            print("\n>>> O APLICATIVO ESTÁ RODANDO <<<")
            print("Quando você fechar a janela do App, o servidor será desligado automaticamente.")
            
            # Wait for the browser window to be closed
            browser_process.wait()
            print("\nJanela do App fechada detectada.")
            
        except Exception as e:
            print(f"Erro ao lançar navegador: {e}")
            print("Tentando abrir no navegador padrão sem monitoramento...")
            webbrowser.open(app_url)
    else:
        print("Nenhum navegador compatível com 'Modo App' encontrado.")
        print("Abrindo no navegador padrão do sistema...")
        webbrowser.open(app_url)
        print("AVISO: O servidor NÃO será fechado automaticamente.")
        print("Você precisará fechar esta janela preta manualmente.")

    # 3. Cleanup
    cleanup_server(server_process)
    sys.exit(0)

if __name__ == "__main__":
    main()
