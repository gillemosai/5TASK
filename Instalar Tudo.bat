@echo off
setlocal
title Instalador Automatico 5Task

:: Verifica permissoes de Administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ==========================================================
    echo  ATENCAO: Este script precisa ser executado como ADMIN.
    echo  Clique com o botao direito e selecione "Executar como Administrador".
    echo ==========================================================
    echo.
    pause
    exit
)

echo.
echo ==========================================================
echo        INICIANDO INSTALACAO AUTOMATICA - 5Task
echo ==========================================================
echo.

:: 1. Verificar e Instalar Node.js
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo [1/4] Node.js nao encontrado. Instalando via Winget...
    winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    if %errorLevel% neq 0 (
        echo ERRO ao instalar Node.js. Tente instalar manualmente em nodejs.org
        pause
        exit
    )
    echo Node.js instalado com sucesso!
) else (
    echo [1/4] Node.js ja esta instalado.
)

:: 2. Verificar e Instalar Python
where python >nul 2>&1
if %errorLevel% neq 0 (
    echo [2/4] Python nao encontrado. Instalando via Winget...
    winget install -e --id Python.Python.3.11 --silent --accept-package-agreements --accept-source-agreements
    if %errorLevel% neq 0 (
        echo ERRO ao instalar Python. Tente instalar manualmente em python.org
        pause
        exit
    )
    echo Python instalado com sucesso!
) else (
    echo [2/4] Python ja esta instalado.
)

:: Atualiza as variaveis de ambiente para garantir que node e python sejam encontrados
call refreshenv >nul 2>&1

echo.
echo [3/4] Instalando dependencias do projeto (Isso pode demorar um pouco)...
echo Instalando dependencias do Front-end...
call npm install
echo Instalando dependencias do Back-end...
cd server
call npm install
cd ..

echo.
echo [4/4] Criando atalho na Area de Trabalho...
powershell -ExecutionPolicy Bypass -File "Criar Atalho.ps1"

echo.
echo ==========================================================
echo           INSTALACAO CONCLUIDA COM SUCESSO!
echo ==========================================================
echo.
echo Agora voce pode usar o atalho "5Task App" para abrir o sistema.
echo.
pause
