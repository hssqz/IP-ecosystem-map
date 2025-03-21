#!/bin/bash

# 进入项目根目录
cd "$(dirname "$0")"

# 检查Python依赖是否安装
if ! pip3 list | grep -q "flask"; then
  echo "正在安装Python依赖..."
  pip3 install -r requirements.txt
fi

# 启动应用
echo "正在启动IP生态图谱系统..."
npm start 