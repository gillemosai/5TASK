#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}   Instalador 5Task para Linux/Mac   ${NC}"
echo -e "${GREEN}=========================================${NC}\n"

# 1. Verificar Node.js
echo -e "${YELLOW}[1/4] Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERRO: Node.js não encontrado!${NC}"
    echo "Por favor instale o Node.js antes de continuar:"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  Fedora: sudo dnf install nodejs"
    echo "  Arch: sudo pacman -S nodejs npm"
    exit 1
else
    echo -e "${GREEN}✓ Node.js detectado: $(node -v)${NC}"
fi

# 2. Verificar Python 3
echo -e "\n${YELLOW}[2/4] Verificando Python 3...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}ERRO: Python 3 não encontrado!${NC}"
    echo "Por favor instale o Python 3:"
    echo "  Ubuntu/Debian: sudo apt install python3"
    exit 1
else
    echo -e "${GREEN}✓ Python 3 detectado: $(python3 --version)${NC}"
fi

# 3. Instalar Dependências
echo -e "\n${YELLOW}[3/4] Instalando dependências (npm install)...${NC}"

echo "Instalando dependências do Frontend..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao instalar dependências do Frontend.${NC}"
    exit 1
fi

echo "Instalando dependências do Backend..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Falha ao instalar dependências do Backend.${NC}"
    exit 1
fi
cd ..

# 4. Criar Atalho Desktop (.desktop)
echo -e "\n${YELLOW}[4/4] Configurando atalho...${NC}"
CURRENT_DIR=$(pwd)
ICON_PATH="$CURRENT_DIR/public/vite.svg" # Fallback icon if specific one doesn't exist
LAUNCHER_PATH="$CURRENT_DIR/launcher.py"

DESKTOP_FILE="5task.desktop"

cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=5Task
Comment=Quantum Productivity Engine
Exec=python3 "$LAUNCHER_PATH"
Icon=$ICON_PATH
Path=$CURRENT_DIR
Terminal=true
Categories=Utility;Productivity;
EOF

chmod +x "$DESKTOP_FILE"
chmod +x "launcher.py"

echo -e "${GREEN}✓ Arquivo '$DESKTOP_FILE' criado no diretório atual.${NC}"
echo "Para instalar no menu de aplicativos do sistema, execute:"
echo "  mv 5task.desktop ~/.local/share/applications/"

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}   INSTALAÇÃO CONCLUÍDA!   ${NC}"
echo -e "${GREEN}=========================================${NC}"
echo "Para iniciar o app, execute:"
echo "  ./5task.desktop"
echo "  ou"
echo "  python3 launcher.py"
