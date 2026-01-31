# Paper Knows 同步功能修复说明

## 问题描述
1. 前端文献列表使用 mock 数据，不是从数据库获取
2. 文献数量与 data_paper_1 文件夹中的 PDF 实际数量不一致
3. 删除 PDF 文件后，前端和统计信息不会更新
4. 侧边栏统计信息从未更新（CSS 类名不匹配）

## 修复内容

### 1. 后端修改

#### `backend/main.py`
- **新增**: 应用启动时自动同步功能
- 使用 `@app.on_event("startup")` 装饰器
- 启动时自动调用 `sync_papers_with_filesystem()` 清理无效数据

```python
@app.on_event("startup")
def startup_sync():
    """应用启动时自动同步文献数据与文件系统"""
    db = next(get_db())
    try:
        result = sync_papers_with_filesystem(db)
        print(f"[启动同步] {result['message']}")
    except Exception as e:
        print(f"[启动同步失败] {str(e)}")
    finally:
        db.close()
```

#### `backend/services/sync_service.py`
- **增强**: 同步功能现在支持双向同步
  - 删除数据库中存在但文件系统中不存在的记录（清理幽灵文献）
  - 添加文件系统中存在但数据库中没有的记录（自动导入新文件）
- **修复**: 路径标准化，处理 Windows 反斜杠问题
- **返回**: 新增 `added` 字段，显示新增的文献数量

### 2. 前端修改

#### `index.html`
- **删除**: `mock-data.js` 脚本引用
- **更新**: JavaScript 版本号从 v=3 升级到 v=4（强制浏览器刷新缓存）

```html
<!-- 修改前 -->
<script src="assets/js/mock-data.js?v=3"></script>
<script src="assets/js/main.js?v=3"></script>
<script src="assets/js/pages/index.js?v=3"></script>

<!-- 修改后 -->
<script src="assets/js/main.js?v=4"></script>
<script src="assets/js/pages/index.js?v=4"></script>
```

#### `assets/js/pages/index.js`
- **修复**: `renderStats()` 函数现在同时更新两处统计信息
  - 主内容区的统计卡片（`.stat-card-value`）
  - 侧边栏的统计信息（`.stat-value`）

```javascript
function renderStats(stats) {
  // 更新主内容区统计卡片
  const statCards = document.querySelectorAll('.stat-card-value');
  if (statCards.length >= 4) {
    statCards[0].textContent = stats.total || 0;
    statCards[1].textContent = stats.read || 0;
    statCards[2].textContent = stats.ai_analyzed || 0;
    statCards[3].textContent = stats.experiment_plans || 0;
  }

  // 更新侧边栏统计信息
  const sidebarStats = document.querySelectorAll('.sidebar-stats .stat-value');
  if (sidebarStats.length >= 4) {
    sidebarStats[0].textContent = stats.total || 0;
    sidebarStats[1].textContent = stats.read || 0;
    sidebarStats[2].textContent = stats.ai_analyzed || 0;
    sidebarStats[3].textContent = stats.experiment_plans || 0;
  }
}
```

### 3. 数据流程

#### 启动流程
```
1. 后端启动
   ↓
2. 执行 startup_sync()
   ↓
3. 调用 sync_papers_with_filesystem()
   ↓
4. 扫描 data_paper_1 文件夹
   ↓
5. 删除无效记录 + 添加新文件
   ↓
6. 数据库与文件系统完全同步
```

#### 前端加载流程
```
1. 页面加载
   ↓
2. 调用 syncPapers() (POST /api/papers/sync)
   ↓
3. 后端执行同步并返回最新数据
   ↓
4. 前端更新统计信息（主内容区 + 侧边栏）
   ↓
5. 前端渲染文献列表
```

#### 文件操作流程
```
1. 用户上传 PDF / 删除 PDF
   ↓
2. 前端调用 syncPapers()
   ↓
3. 后端同步数据库与文件系统
   ↓
4. 返回最新数据
   ↓
5. 前端立即更新显示
```

## 测试步骤

### 1. 重启后端服务
```bash
cd backend
python main.py
```

查看控制台输出，应该看到：
```
[启动同步] 同步完成：保留 X 篇，新增 Y 篇，删除 Z 条无效记录
```

### 2. 清除浏览器缓存
- 按 `Ctrl + Shift + Delete` 清除缓存
- 或使用 `Ctrl + F5` 强制刷新

### 3. 验证同步功能

#### 测试场景 1: 初始加载
1. 打开 `http://localhost:5500/index.html`（或你的前端地址）
2. 检查页面显示的文献数量
3. 检查 `data_paper_1` 文件夹中的 PDF 数量
4. **预期**: 两者数量一致

#### 测试场景 2: 删除 PDF
1. 从 `data_paper_1` 文件夹中删除 1 个 PDF 文件
2. 刷新页面（F5）
3. **预期**:
   - 文献列表减少 1 篇
   - 顶部统计卡片"总文献"减少 1
   - 侧边栏"总文献"减少 1

#### 测试场景 3: 添加 PDF
1. 复制一个新的 PDF 文件到 `data_paper_1` 文件夹
2. 刷新页面（F5）
3. **预期**:
   - 文献列表增加 1 篇
   - 顶部统计卡片"总文献"增加 1
   - 侧边栏"总文献"增加 1

#### 测试场景 4: 手动同步
1. 打开浏览器开发者工具（F12）
2. 在 Console 中执行: `syncPapers()`
3. **预期**: 看到同步日志，数据更新

### 4. 使用测试脚本
```bash
cd backend
python test_sync.py
```

这会显示同步前后的数据库状态。

## 核心原则

✅ **单一数据源**: `data_paper_1` 文件夹是唯一真实来源
✅ **自动同步**: 后端启动时自动同步
✅ **实时更新**: 前端每次加载都会同步
✅ **双向同步**: 删除无效记录 + 添加新文件
✅ **无 Mock 数据**: 前端完全依赖 API

## 文件清单

### 修改的文件
- `backend/main.py` - 添加启动同步
- `backend/services/sync_service.py` - 增强同步功能
- `assets/js/pages/index.js` - 修复统计更新
- `index.html` - 删除 mock-data.js

### 新增的文件
- `backend/test_sync.py` - 同步功能测试脚本

## 常见问题

### Q: 页面显示的数量还是不对？
A:
1. 确认后端已重启
2. 清除浏览器缓存（Ctrl + Shift + Delete）
3. 使用 Ctrl + F5 强制刷新
4. 检查浏览器控制台是否有错误

### Q: 侧边栏统计没有更新？
A: 这个问题已修复。确保使用的是 `index.js?v=4` 版本。

### Q: 删除 PDF 后数据库没有更新？
A: 刷新页面会自动触发同步。或者重启后端服务。

### Q: 如何手动触发同步？
A:
- 方法 1: 刷新页面（前端会自动调用同步）
- 方法 2: 重启后端服务（启动时自动同步）
- 方法 3: 调用 API `POST http://127.0.0.1:8000/api/papers/sync`

## 下一步建议

1. **定时同步**: 可以添加定时任务，每隔一段时间自动同步
2. **文件监控**: 使用 watchdog 库监控文件夹变化，实时同步
3. **批量操作**: 添加批量删除、批量导入功能
4. **日志记录**: 记录每次同步的详细日志
