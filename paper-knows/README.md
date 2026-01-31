# Paper Knows（材知道）

基于科研文献的智能分析与智慧推荐系统。

---

## 🚀 项目简介

**Paper Knows（材知道）** 是一个面向材料科研场景的智能工具，目标是帮助研究人员：

- 管理与组织科研文献
- 基于已有文献进行 AI 智慧推荐
- 从文献中提炼研究方向与实验方案
- 预测材料性能与实验方向
- 构建个人或课题组的科研知识体系

当前仓库包含 **前端项目（HTML / CSS / JavaScript）** 和 **后端架构规划**。

---

## ✨ 当前版本

### v0.2.0 – 完整 MVP 功能实现

本版本完成了三大核心页面的完整功能实现：

**智慧推荐页面升级：**
- 智慧推荐页面由「列表推荐」升级为「研究型文章推荐」
- 推荐内容基于内部文献库生成，而非外部爬取
- 每条推荐包含 AI 生成的研究关联说明
- 支持文章详情页，包含 Markdown 渲染和引用文献展示

**材料预测页面实现：**
- 完整的预测配置表单（材料体系、目标性能、参考文献范围）
- 动态加载和渲染预测结果
- 支持按材料体系和性能指标筛选
- 置信度可视化展示（进度条 + 颜色编码）
- 统计卡片动态更新

**文献库页面：**
- 支持从 API 加载文献数据
- 动态渲染文献列表和统计信息
- 预留筛选和排序功能接口

**技术特性：**
- 页面结构模块化，便于后续对接后端 API
- 当前阶段使用 mock 数据
- 所有页面均已实现完整交互逻辑

---

## 🧠 产品设计理念

- 推荐内容以"公众号式文章"呈现，降低科研阅读门槛
- 强调推荐理由与研究背景的可解释性
- 为后续研究方向预测与实验方案生成提供统一入口
- 材料预测结果可视化，便于快速评估

---

## 🧱 技术栈

### 前端
- HTML / CSS / JavaScript
- 无前端框架（轻量、可控、易与 AI 系统结合）
- 预留 API 接口结构，便于扩展

### 后端（规划中）
- Python + FastAPI
- SQLite 数据库
- AI 服务集成（文献分析、文章生成、材料预测）

---

## 📁 项目结构

### 前端目录结构

```
paper-knows/
├─ index.html              # 我的文献库页面
├─ recommend.html          # 智慧推荐页面
├─ article.html            # 文章详情页
├─ predict.html            # 材料预测页面
├─ api/
│  ├─ recommend/
│  │  ├─ articles.json     # 推荐文章列表 mock 数据
│  │  └─ article_001.json  # 文章详情 mock 数据
│  └─ predict/
│     └─ results.json      # 预测结果 mock 数据
├─ assets/
│  ├─ css/
│  │  ├─ base.css          # 全局基础样式
│  │  ├─ layout.css        # 整体布局
│  │  ├─ components.css    # 通用组件
│  │  └─ modules/
│  │     ├─ sidebar.css    # 侧边栏模块
│  │     ├─ header.css     # 页面头部模块
│  │     ├─ stat-cards.css # 统计卡片模块
│  │     ├─ filter-bar.css # 筛选栏模块
│  │     ├─ table.css      # 表格模块
│  │     ├─ recommend.css  # 推荐模块
│  │     └─ predict.css    # 预测模块
│  └─ js/
│     ├─ main.js           # 全局逻辑
│     ├─ mock-data.js      # Mock 数据管理
│     └─ pages/
│        ├─ index.js       # 文献库页面逻辑
│        ├─ recommend.js   # 推荐页面逻辑
│        ├─ article.js     # 文章详情页逻辑
│        └─ predict.js     # 预测页面逻辑
└─ README.md
```

### 后端目录结构（规划）

```
backend/
├─ main.py                 # FastAPI 应用入口
├─ config.py               # 配置文件
├─ models/
│  ├─ paper.py             # 文献数据模型
│  ├─ insight.py           # 洞察数据模型
│  └─ article.py           # 文章数据模型
├─ repositories/
│  ├─ base.py              # 基础仓储类
│  ├─ paper_repo.py        # 文献仓储
│  ├─ insight_repo.py      # 洞察仓储
│  └─ article_repo.py      # 文章仓储
├─ services/
│  ├─ pdf_service.py       # PDF 解析服务
│  ├─ ai_insight_service.py # AI 洞察生成服务
│  └─ ai_article_service.py # AI 文章生成服务
├─ routes/
│  ├─ papers.py            # 文献相关路由
│  ├─ ai.py                # AI 服务路由
│  └─ recommendations.py   # 推荐相关路由
├─ data/
│  ├─ papers.db            # SQLite 数据库
│  └─ papers/              # PDF 文件存储
└─ utils/
   └─ id_generator.py      # ID 生成工具
```

---

## 📄 页面说明

### 1. 我的文献库（index.html）

**功能模块：**
- PAGE_HEADER：页面标题与副标题
- STAT_CARDS：统计卡片（总文献/已读/AI精读/实验方案）
- FILTER_BAR：筛选栏（排序/分类/状态）
- CONTENT_AREA：文献列表表格

**数据来源：** API 接口（当前使用 mock 数据）

### 2. 智慧推荐（recommend.html）

**功能模块：**
- PAGE_HEADER：页面标题与副标题
- STAT_CARDS：统计卡片（推荐文章/研究方向/实验方案）
- RECOMMEND_LIST：AI 生成文章列表

**交互逻辑：** 点击文章卡片跳转到文章详情页

### 3. 文章详情（article.html）

**功能模块：**
- ARTICLE_HEADER：文章标题、元数据、标签
- ARTICLE_CONTENT：Markdown 渲染的文章正文
- REFERENCES_LIST：引用文献列表

**技术实现：** 简单 Markdown 解析器（支持标题、粗体、列表）

### 4. 材料预测（predict.html）

**功能模块：**
- PAGE_HEADER：页面标题与副标题
- PREDICT_CONFIG：预测任务配置表单
- STAT_CARDS：预测结果概览卡片
- PREDICT_RESULT_TABLE：预测结果表格

**交互逻辑：**
- 表单验证
- 筛选功能
- 置信度可视化

---

## 🎨 CSS 架构

### 基础层
- **base.css**：CSS Reset、全局变量（颜色、字体、间距）、滚动条样式
- **layout.css**：Sidebar + Main Content 的整体布局结构
- **components.css**：通用组件基础样式（按钮、卡片、徽章、表单、表格）

### 模块层
- **sidebar.css**：侧边栏相关样式（Logo、统计、导航、设置）
- **header.css**：页面头部样式
- **stat-cards.css**：统计卡片样式
- **filter-bar.css**：筛选栏样式
- **table.css**：内容表格样式
- **recommend.css**：推荐页面特有样式
- **predict.css**：预测页面特有样式

**重要原则：** 每个模块 CSS 文件只负责对应模块的样式，不得跨模块编写样式。

---

## 💻 JavaScript 架构

### 全局层
- **main.js**：全局逻辑（侧边栏导航高亮、主题切换、全局事件监听）
- **mock-data.js**：集中管理所有 mock 数据

### 页面层
- **pages/index.js**：文献库页面逻辑（API 加载、列表渲染、筛选）
- **pages/recommend.js**：推荐页面逻辑（文章列表加载、点击跳转）
- **pages/article.js**：文章详情页逻辑（Markdown 解析、内容渲染）
- **pages/predict.js**：预测页面逻辑（配置、筛选、结果展示）

**重要原则：** 页面 JS 文件不允许操作其他页面的 DOM。

---

## 🚀 使用方法

### 本地运行

1. 直接在浏览器中打开任意 HTML 文件即可运行
2. 推荐使用 Live Server 或类似工具以获得更好的开发体验

### 开发规范

1. **模块化原则**：修改某个模块时，只修改对应的 CSS/JS 文件
2. **注释规范**：所有 HTML 页面必须保留模块注释标识
3. **命名规范**：使用语义化的 class 名称，遵循 BEM 或类似规范
4. **数据管理**：所有 mock 数据统一在对应的 JSON 文件中管理

---

## 🔧 后续扩展规则

### 添加新页面

1. 创建新的 HTML 文件（如 `analysis.html`）
2. 复用 Sidebar 结构，修改导航 active 状态
3. 在 `assets/js/pages/` 下创建对应的 JS 文件
4. 如需特殊样式，在 `assets/css/modules/` 下创建对应的 CSS 文件

### 添加新模块

1. 在 HTML 中使用 `<!-- MODULE: XXX -->` 标识模块边界
2. 在 `assets/css/modules/` 下创建对应的 CSS 文件
3. 在对应页面的 JS 文件中添加模块逻辑

### 修改样式

1. **全局样式**：修改 `base.css` 中的 CSS 变量
2. **布局调整**：修改 `layout.css`
3. **组件样式**：修改 `components.css`
4. **模块样式**：修改对应的 `modules/*.css` 文件

### 添加数据

在 `api/` 目录下创建对应的 JSON 文件，并在对应页面的 JS 文件中使用 fetch 加载。

---

## 🔜 后续计划（v0.3.0）

- 实现后端 API（FastAPI + SQLite）
- 接入 AI 服务（文献分析、文章生成、材料预测）
- PDF 文件上传与解析
- 用户认证与权限管理
- 数据持久化与同步

---

## ⚠️ 注意事项

1. **不要引入框架**：本项目严格使用原生技术栈
2. **不要混合职责**：CSS 和 JS 文件必须按职责拆分
3. **保持简洁**：这是 MVP 阶段，重点是结构清晰，不要过度设计
4. **模块注释**：HTML 中的模块注释不得删除，便于后续维护

---

## 📞 技术支持

如有问题，请参考本 README 或查看代码注释。

---

**项目状态：** v0.2.0 MVP 完成
**最后更新：** 2026-01-30
