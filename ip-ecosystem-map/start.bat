@echo off
echo 正在检查Python依赖...
pip list | findstr flask >nul 2>&1
if errorlevel 1 (
    echo 正在安装Python依赖...
    pip install -r requirements.txt
)

echo 正在启动IP生态图谱系统...
npm start 