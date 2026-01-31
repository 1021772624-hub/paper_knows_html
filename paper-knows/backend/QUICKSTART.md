# 快速启动指南

## 方式一：使用虚拟环境（推荐）

```bash
# 1. 进入后端目录
cd backend

# 2. 创建虚拟环境
python -m venv venv

# 3. 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. 安装依赖
pip install -r requirements.txt

# 5. 初始化数据库
python init_db.py

# 6. 启动服务
python main.py
```

## 方式二：直接安装（如果遇到依赖问题）

```bash
# 1. 进入后端目录
cd backend

# 2. 单独安装核心依赖
pip install fastapi uvicorn sqlalchemy

# 3. 初始化数据库
python init_db.py

# 4. 启动服务
python main.py
```

## 验证服务

启动成功后，访问：
- API 根路径: http://localhost:8000
- 文献列表: http://localhost:8000/api/papers
- API 文档: http://localhost:8000/docs

## 前端对接

修改前端 `assets/js/pages/index.js` 中的 API_BASE_URL：

```javascript
const API_BASE_URL = 'http://localhost:8000';
```

然后使用 Live Server 打开前端页面即可。

## 常见问题

### Q: pip install 失败
A: 尝试使用国内镜像源：
```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### Q: 端口被占用
A: 修改 main.py 中的端口号，或使用：
```bash
uvicorn main:app --port 8001
```

### Q: CORS 错误
A: 确保 config.py 中的 CORS_ORIGINS 包含前端地址。
