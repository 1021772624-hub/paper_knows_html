# Paper Knows - 开发环境启动指南

## 快速启动

### Windows 用户

双击运行 `start-dev.bat` 文件即可启动所有开发服务器。

```bash
# 或在命令行中运行
start-dev.bat
```

### 手动启动

如果需要手动启动各个服务：

#### 1. 启动智慧推荐前端服务
```bash
cd wechat-push-frontend-2.0
pnpm dev
```
服务将运行在: http://localhost:3000

#### 2. 启动主应用
使用 Live Server 或其他静态服务器打开 `index.html`

## 服务说明

### 智慧推荐服务 (Port 3000)
- **目录**: `wechat-push-frontend-2.0/`
- **技术栈**: React + Vite + TypeScript
- **访问地址**: http://localhost:3000
- **说明**: 为智慧推荐页面提供内容，通过 iframe 嵌入到主应用中

### 主应用
- **入口文件**: `index.html`
- **技术栈**: 原生 HTML/CSS/JavaScript
- **说明**: 文献管理主界面

## 常见问题

### Q: 智慧推荐页面无法打开？
A: 确保 `wechat-push-frontend-2.0` 服务正在运行。使用 `start-dev.bat` 或手动启动该服务。

### Q: 端口 3000 被占用？
A: Vite 会自动寻找下一个可用端口（如 3001）。如果发生这种情况，需要修改 `recommend.html` 中的 iframe src 地址。

### Q: 如何停止所有服务？
A:
- 如果使用 `start-dev.bat`，按任意键即可停止
- 手动启动的服务，在对应的终端窗口按 `Ctrl+C`

## 开发建议

1. **首次运行**: 确保在 `wechat-push-frontend-2.0` 目录下已运行 `pnpm install`
2. **推荐工具**: 使用 VS Code + Live Server 扩展来运行主应用
3. **浏览器**: 推荐使用 Chrome 或 Edge 进行开发

## 版本信息

- Paper Knows: v1.0.1
- Node.js: 建议 v18 或更高版本
- pnpm: v10.4.1 或更高版本
