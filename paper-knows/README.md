# 材知道（Paper Knows）前端工程

## 项目简介

材知道（Paper Knows）是一个科研文献管理 + 智能推荐 + 材料预测工具系统。本项目为 MVP 阶段的前端工程骨架。
# Paper Knows（材知道）

基于科研文献的智能分析与智慧推荐系统。

---

## 🚀 项目简介

**Paper Knows（材知道）** 是一个面向材料科研场景的智能工具，目标是帮助研究人员：

- 管理与组织科研文献
- 基于已有文献进行 AI 智慧推荐
- 从文献中提炼研究方向与实验方案
- 构建个人或课题组的科研知识体系

当前仓库为 **前端项目（HTML / CSS / JavaScript）**。

---

## ✨ 当前版本

### v0.2.0 – 智慧推荐升级为 AI 研究文章

本版本完成了智慧推荐页面的关键形态升级：

- 智慧推荐页面由「列表推荐」升级为「研究型文章推荐」
- 推荐内容基于内部文献库生成，而非外部爬取
- 每条推荐包含 AI 生成的研究关联说明
- 页面结构模块化，便于后续对接后端 API
- 当前阶段使用 mock 数据

---

## 🧠 产品设计理念

- 推荐内容以“公众号式文章”呈现，降低科研阅读门槛
- 强调推荐理由与研究背景的可解释性
- 为后续研究方向预测与实验方案生成提供统一入口

---

## 🧱 技术栈

- HTML / CSS / JavaScript
- 无前端框架（轻量、可控、易与 AI 系统结合）
- 预留 API 接口结构，便于扩展

---

## 🔜 后续计划（v0.3.0）

- 接入后端 API（文献库 / 推荐系统）
- AI 生成研究文章服务（基于本地文献数据库）
- 支持文章详情页与可分享链接

**技术栈：** HTML + CSS + 原生 JavaScript（无框架、无构建工具）

**版本：** v1.0.0 MVP

## 目录结构

```
paper-knows/
├─ index.html              # 我的文献库页面
├─ recommend.html          # 智慧推荐页面
├─ predict.html            # 材料预测页面
├─ assets/
│  ├─ css/
│  │  ├─ base.css          # 全局基础样式（Reset、变量、字体）
│  │  ├─ layout.css        # 整体布局（Sidebar + Main Content）
│  │  ├─ components.css    # 通用组件（按钮、卡片、表格）
│  │  ├─ modules/
│  │  │  ├─ sidebar.css    # 侧边栏模块样式
│  │  │  ├─ header.css     # 页面头部模块样式
│  │  │  ├─ stat-cards.css # 统计卡片模块样式
│  │  │  ├─ filter-bar.css # 筛选栏模块样式
│  │  │  ├─ table.css      # 表格模块样式
│  │  │  ├─ recommend.css  # 推荐模块样式
│  │  │  └─ predict.css    # 预测模块样式
│  └─ js/
│     ├─ main.js           # 全局逻辑（导航、主题切换）
│     ├─ mock-data.js      # Mock 数据管理
│     └─ pages/
│        ├─ index.js       # 文献库页面逻辑
│        ├─ recommend.js   # 推荐页面逻辑
│        └─ predict.js     # 预测页面逻辑
└─ README.md
```

## 页面说明

### 1. 我的文献库（index.html）

**功能模块：**
- PAGE_HEADER：页面标题与副标题
- STAT_CARDS：统计卡片（总文献/已读/AI精读/实验方案）
- FILTER_BAR：筛选栏（排序/分类/状态）
- CONTENT_AREA：文献列表表格

**导航状态：** "我的文献库" 为 active

### 2. 智慧推荐（recommend.html）

**功能模块：**
- PAGE_HEADER：页面标题与副标题
- STAT_CARDS：统计卡片（推荐文献/研究方向/实验方案）
- RECOMMEND_LIST：推荐内容列表

**导航状态：** "智慧推荐" 为 active

### 3. 材料预测（predict.html）

**功能模块：**
- PAGE_HEADER：页面标题与副标题
- PREDICT_CONFIG：预测任务配置表单
- STAT_CARDS：预测结果概览卡片
- PREDICT_RESULT_TABLE：预测结果表格

**导航状态：** "材料预测" 为 active

## CSS 文件职责

### 基础层
- **base.css**：CSS Reset、全局变量（颜色、字体、间距）、滚动条样式
- **layout.css**：Sidebar + Main Content 的整体布局结构
- **components.css**：通用组件基础样式（按钮、卡片、徽章、表单、表格）

### 模块层
- **sidebar.css**：仅包含侧边栏相关样式（Logo、统计、导航、设置）
- **header.css**：仅包含页面头部样式
- **stat-cards.css**：仅包含统计卡片样式
- **filter-bar.css**：仅包含筛选栏样式
- **table.css**：仅包含内容表格样式
- **recommend.css**：仅包含推荐页面特有样式
- **predict.css**：仅包含预测页面特有样式

**重要原则：** 每个模块 CSS 文件只负责对应模块的样式，不得跨模块编写样式。

## JavaScript 文件职责

### 全局层
- **main.js**：全局逻辑（侧边栏导航高亮、主题切换、全局事件监听）
- **mock-data.js**：集中管理所有 mock 数据（文献、推荐、预测、统计）

### 页面层
- **pages/index.js**：仅处理文献库页面逻辑（列表渲染、筛选、排序）
- **pages/recommend.js**：仅处理推荐页面逻辑（推荐列表渲染、交互）
- **pages/predict.js**：仅处理预测页面逻辑（配置、预测、结果展示）

**重要原则：** 页面 JS 文件不允许操作其他页面的 DOM。

## 使用方法

### 本地运行

1. 直接在浏览器中打开任意 HTML 文件即可运行
2. 推荐使用 Live Server 或类似工具以获得更好的开发体验

### 开发规范

1. **模块化原则**：修改某个模块时，只修改对应的 CSS/JS 文件
2. **注释规范**：所有 HTML 页面必须保留模块注释标识
3. **命名规范**：使用语义化的 class 名称，遵循 BEM 或类似规范
4. **数据管理**：所有 mock 数据统一在 `mock-data.js` 中管理

## 后续扩展规则

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

在 `mock-data.js` 中添加新的数据结构，并在对应页面的 JS 文件中使用。

## 注意事项

1. **不要引入框架**：本项目严格使用原生技术栈
2. **不要混合职责**：CSS 和 JS 文件必须按职责拆分
3. **保持简洁**：这是 MVP 阶段，重点是结构清晰，不要过度设计
4. **模块注释**：HTML 中的模块注释不得删除，便于后续维护

## 技术支持

如有问题，请参考本 README 或查看代码注释。

---

**项目状态：** MVP 初始化完成
**最后更新：** 2026-01-30
