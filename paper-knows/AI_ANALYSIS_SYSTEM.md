# Paper Knows AI 分析系统说明

## 系统架构

### 数据模型

**Paper 表新增字段：**
- `ai_analysis_json`: TEXT - 存储完整的 AI 分析结果（JSON 格式）
- `ai_analysis_time`: DATETIME - AI 分析时间
- `ai_analyzed`: BOOLEAN - 是否已进行 AI 分析
- `has_experiment_plan`: BOOLEAN - 是否包含实验方案

### AI 分析 JSON 结构

```json
{
  "metadata": {
    "title": "论文标题",
    "authors": "作者列表",
    "publisher": "出版商",
    "journal": "期刊名称",
    "publish_date": "发表日期",
    "doi": "DOI",
    "keywords": ["关键词1", "关键词2"],
    "category": "研究领域分类",
    "research_field": "具体研究方向"
  },
  "paper_summary": {
    "problem_background": "研究背景",
    "research_objective": "研究目标",
    "core_methods": "核心方法",
    "main_results": "主要结果",
    "key_conclusions": "关键结论"
  },
  "innovation_analysis": {
    "core_innovations": ["创新点1", "创新点2"],
    "compared_with_prior_work": "与前人工作对比",
    "novelty_type": "创新类型"
  },
  "methodology_analysis": {
    "experimental_design": "实验设计",
    "materials_used": ["材料1", "材料2"],
    "parameters": {"参数名": "参数值"},
    "limitations": "方法局限性"
  },
  "experiment_suggestions": {
    "replication_plan": "复现实验步骤",
    "extension_ideas": ["扩展方向1", "扩展方向2"],
    "risk_points": ["风险点1", "风险点2"]
  },
  "ai_meta": {
    "analysis_model": "Claude Sonnet 4.5",
    "analysis_time": "2026-01-30T17:40:29Z",
    "confidence": "high/medium/low"
  }
}
```

## API 接口

### 分析文献

**请求：**
```
POST /api/papers/{paper_id}/analyze
```

**响应：**
```json
{
  "paper_id": 1,
  "title": "论文标题",
  "summary_plain": "研究背景摘要",
  "innovations": ["创新点1", "创新点2"],
  "experiment_plans": [
    {
      "title": "实验方案标题",
      "steps": ["步骤1", "步骤2"]
    }
  ],
  "ai_meta": {
    "analysis_model": "Claude Sonnet 4.5",
    "analysis_time": "2026-01-30T17:40:29Z",
    "confidence": "medium"
  }
}
```

### 获取文献列表

**请求：**
```
GET /api/papers
```

**响应包含：**
- `stats.ai_analyzed`: AI 已分析的文献数量
- `stats.experiment_plans`: 包含实验方案的文献数量
- 每篇文献的 `ai_analyzed` 和 `has_experiment_plan` 状态

## 工作流程

### 1. 导入阶段（轻量）

```
用户上传 PDF
    ↓
保存 PDF 文件
    ↓
创建数据库记录
    ↓
设置 ai_analyzed = false
```

**不在导入时调用 AI**

### 2. AI 分析阶段（用户触发）

```
用户点击 "AI 辅助阅读"
    ↓
前端调用 POST /api/papers/{id}/analyze
    ↓
后端提取 PDF 文本（前 20 页）
    ↓
调用 LLM 生成结构化 JSON
    ↓
保存 JSON 到数据库
    ↓
更新状态标记
    ↓
返回分析摘要
```

### 3. 前端展示

- 文献列表显示 "AI 已分析" 标记
- 统计卡片实时更新
- 点击可查看完整分析结果

## AI Prompt 设计

**核心要求：**
1. 必须输出严格的 JSON 格式
2. 所有字段必须填写
3. 不包含任何其他文字

**Prompt 模板：**
```
你是一个专业的科研文献分析助手。请仔细阅读以下学术论文内容，
并按照指定的 JSON 格式输出分析结果。

**重要要求：**
1. 必须输出严格的 JSON 格式，不要包含任何其他文字
2. 所有字段都必须填写，如果信息不明确，填写 "未知" 或空数组
3. 保持客观、准确、专业

**论文内容：**
{paper_content}

**请输出以下 JSON 格式的分析结果：**
{json_schema}
```

## 实现状态

### 已完成
- ✅ 数据库模型更新
- ✅ AI 分析服务（使用模拟数据）
- ✅ API 接口实现
- ✅ 状态统计更新
- ✅ JSON 结构化存储

### 待完成
- ⏳ 集成真实 LLM API（Anthropic Claude API）
- ⏳ 前端 UI 更新（添加 "AI 辅助阅读" 按钮）
- ⏳ 分析结果展示页面
- ⏳ 重新分析功能
- ⏳ 批量分析功能

## 测试验证

### 测试步骤

1. **导入文献**
```bash
curl -X POST http://127.0.0.1:8000/api/papers/import
```

2. **触发 AI 分析**
```bash
curl -X POST http://127.0.0.1:8000/api/papers/1/analyze
```

3. **检查统计**
```bash
curl http://127.0.0.1:8000/api/papers | jq '.stats'
```

### 预期结果

- 导入后：`ai_analyzed = 0`
- 分析后：`ai_analyzed = 1`, `experiment_plans = 1`
- 统计实时更新

## 扩展建议

1. **LLM 集成**
   - 使用 Anthropic Claude API
   - 配置 API Key
   - 处理 rate limiting

2. **前端增强**
   - 添加分析进度条
   - 展示分析结果
   - 支持导出分析报告

3. **性能优化**
   - 异步分析队列
   - 缓存分析结果
   - 增量更新

4. **功能扩展**
   - 批量分析
   - 重新分析
   - 分析历史记录
   - 自定义分析模板
