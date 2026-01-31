# Paper Knows 后端 API

基于 FastAPI + SQLite 的最小可运行后端骨架。

---

## 📁 项目结构

```
backend/
├─ main.py                 # FastAPI 应用入口
├─ config.py               # 配置文件
├─ database.py             # 数据库连接
├─ init_db.py              # 数据库初始化脚本
├─ requirements.txt        # Python 依赖
├─ models/
│  └─ paper.py             # Paper 数据模型
├─ routes/
│  └─ papers.py            # 文献相关路由
└─ data/
   └─ papers.db            # SQLite 数据库（运行后自动生成）
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 初始化数据库

```bash
python init_db.py
```

这将创建 SQLite 数据库并插入 3 条 mock 文献数据。

### 3. 启动服务

```bash
python main.py
```

或使用 uvicorn：

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

服务将运行在 `http://localhost:8000`

---

## 📡 API 接口

### GET /api/papers

获取所有文献列表及统计信息。

**响应示例：**

```json
{
  "stats": {
    "total": 3,
    "read": 1,
    "ai_analyzed": 3,
    "experiment_plans": 3
  },
  "papers": [
    {
      "id": 1,
      "title": "SiC/SiC 陶瓷基复合材料界面层研究进展",
      "authors": "张三, 李四, 王五",
      "year": 2023,
      "category": "陶瓷基复合材料",
      "imported_at": "2024-01-15T10:30:00",
      "read_status": "read"
    }
  ]
}
```

---

## 🗄️ 数据模型

### Paper

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键 |
| title | String | 文献标题 |
| authors | String | 作者列表 |
| year | Integer | 发表年份 |
| category | String | 文献分类 |
| imported_at | DateTime | 导入时间 |
| read_status | String | 阅读状态（unread/reading/read）|

---

## 🔧 技术栈

- **FastAPI**: 现代 Python Web 框架
- **SQLAlchemy**: ORM 框架
- **SQLite**: 轻量级数据库
- **Uvicorn**: ASGI 服务器

---

## 📝 开发说明

### 修改数据库路径

编辑 `config.py` 中的 `DATABASE_URL`。

### 添加新字段

1. 修改 `models/paper.py` 中的 `Paper` 类
2. 删除 `data/papers.db`
3. 重新运行 `python init_db.py`

### 查看 API 文档

启动服务后访问：
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## ⚠️ 注意事项

1. 这是最小可运行版本，仅实现核心功能
2. 未实现 PDF 解析、AI 服务等高级功能
3. 生产环境需要添加认证、日志、错误处理等
4. SQLite 适合开发和小规模使用，生产环境建议迁移到 PostgreSQL

---

**版本：** v0.2.0
**最后更新：** 2026-01-30
