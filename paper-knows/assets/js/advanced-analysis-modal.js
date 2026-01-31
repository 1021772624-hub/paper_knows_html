/**
 * ADVANCED-ANALYSIS-MODAL.JS - 论文 AI 深度理解工作台
 * 职责：展示完整的 AI 分析结果，包含文献深度解析和实验方案两个标签页
 */

// 渲染高级分析模态框
function renderAdvancedAnalysisModal(paperId, analysis, fromCache = false) {
  // 创建或获取模态框
  let modal = document.getElementById('advanced-analysis-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'advanced-analysis-modal';
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 1200px;
      height: 90vh;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 1000;
      display: flex;
      flex-direction: column;
    `;
    document.body.appendChild(modal);

    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.id = 'advanced-analysis-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 999;';
    overlay.onclick = () => closeAdvancedAnalysisModal();
    document.body.appendChild(overlay);
  }

  // 渲染模态框内容
  modal.innerHTML = `
    <div style="padding: 1.5rem 2rem; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="margin: 0; font-size: 1.5rem; color: #2c3e50;">🤖 AI 深度解读</h2>
        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #7f8c8d;">
          ${fromCache ? '📦 来自缓存' : '✨ 最新分析'} |
          分析时间: ${new Date(analysis.ai_meta.analysis_time).toLocaleString()} |
          置信度: ${analysis.ai_meta.confidence}
        </p>
      </div>
      <button onclick="closeAdvancedAnalysisModal()" style="background: none; border: none; font-size: 2rem; cursor: pointer; color: #95a5a6;">×</button>
    </div>

    <div style="display: flex; border-bottom: 1px solid #e0e0e0; padding: 0 2rem; background: #f8f9fa; align-items: center; justify-content: space-between;">
      <div style="display: flex;">
        <button class="tab-btn active" data-tab="deep-analysis" onclick="switchTab('deep-analysis')" style="padding: 1rem 1.5rem; border: none; background: none; cursor: pointer; border-bottom: 3px solid #3498db; font-weight: 600; color: #2c3e50;">
          📚 文献深度解析
        </button>
        <button class="tab-btn" data-tab="experiment-plan" onclick="switchTab('experiment-plan')" style="padding: 1rem 1.5rem; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #7f8c8d;">
          🔬 实验方案
        </button>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button onclick="viewPDF(${paperId})" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
          📄 查看 PDF
        </button>
        <button onclick="reanalyzePaper(${paperId})" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
          🔄 重新分析
        </button>
      </div>
    </div>

    <div style="flex: 1; overflow-y: auto; padding: 2rem;">
      <div id="tab-deep-analysis" class="tab-content active">
        ${renderDeepAnalysisTab(analysis)}
      </div>
      <div id="tab-experiment-plan" class="tab-content" style="display: none;">
        ${renderExperimentPlanTab(analysis)}
      </div>
    </div>
  `;
}

// 渲染文献深度解析标签页
function renderDeepAnalysisTab(analysis) {
  const basic = analysis.basic_info || {};
  const background = analysis.background_and_problem || {};
  const objectives = analysis.research_objectives || {};
  const methodology = analysis.methodology || {};
  const results = analysis.key_results || {};
  const innovation = analysis.innovation_analysis || {};
  const limitations = analysis.limitations || {};

  return `
    <!-- 1. 论文基本信息 -->
    <section style="margin-bottom: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 8px;">
      <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem;">
        📄 论文基本信息
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
        <div><strong>标题：</strong>${basic.title || '未知'}</div>
        <div><strong>作者：</strong>${basic.authors || '未知'}</div>
        <div><strong>期刊：</strong>${basic.journal || '未知'}</div>
        <div><strong>出版社：</strong>${basic.publisher || '未知'}</div>
        <div><strong>发表时间：</strong>${basic.publish_date || '未知'}</div>
        <div><strong>DOI：</strong>${basic.doi || '未知'}</div>
        <div><strong>分类：</strong><span class="badge badge-info">${basic.category || '未知'}</span></div>
        <div><strong>关键词：</strong>${(basic.keywords || []).map(k => `<span class="badge badge-secondary" style="margin-right: 0.5rem;">${k}</span>`).join('')}</div>
      </div>
    </section>

    <!-- 2. 研究背景与问题定义 -->
    <section style="margin-bottom: 2rem;">
      <h3 style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 0.5rem;">
        🎯 研究背景与问题定义
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <p><strong>研究背景：</strong><br>${background.research_background || '暂无数据'}</p>
        <p><strong>领域痛点：</strong><br>${background.field_pain_points || '暂无数据'}</p>
        <p><strong>现有方法不足：</strong><br>${background.existing_methods_limitations || '暂无数据'}</p>
      </div>
    </section>

    <!-- 3. 研究目标 -->
    <section style="margin-bottom: 2rem;">
      <h3 style="color: #2c3e50; border-bottom: 2px solid #9b59b6; padding-bottom: 0.5rem;">
        🎓 研究目标
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <p><strong>核心研究问题：</strong><br>${objectives.core_research_question || '暂无数据'}</p>
        <p><strong>适用范围说明：</strong><br>${objectives.scope_description || '暂无数据'}</p>
      </div>
    </section>

    <!-- 4. 技术路线/方法论拆解 -->
    <section style="margin-bottom: 2rem;">
      <h3 style="color: #2c3e50; border-bottom: 2px solid #f39c12; padding-bottom: 0.5rem;">
        🔧 技术路线/方法论拆解
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <p><strong>整体研究流程：</strong><br>${methodology.overall_workflow || '暂无数据'}</p>
        <p><strong>实验设计逻辑：</strong><br>${methodology.experimental_design_logic || '暂无数据'}</p>
        <p><strong>关键技术：</strong><br>${(methodology.key_techniques || []).map(t => `• ${t}`).join('<br>')}</p>
        <p><strong>表征方法：</strong><br>${(methodology.characterization_methods || []).map(m => `• ${m}`).join('<br>')}</p>
      </div>
    </section>

    <!-- 5. 核心结果总结 -->
    <section style="margin-bottom: 2rem;">
      <h3 style="color: #2c3e50; border-bottom: 2px solid #27ae60; padding-bottom: 0.5rem;">
        📊 核心结果总结
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <p><strong>关键实验结果：</strong><br>${results.main_findings || '暂无数据'}</p>
        <p><strong>数据趋势解读：</strong><br>${results.data_trends || '暂无数据'}</p>
        <p><strong>支撑结论的证据：</strong><br>${results.supporting_evidence || '暂无数据'}</p>
      </div>
    </section>

    <!-- 6. 创新点分析 -->
    <section style="margin-bottom: 2rem; padding: 1.5rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
      <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #ffc107; padding-bottom: 0.5rem;">
        💡 创新点分析
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <p><strong>方法创新：</strong><br>${innovation.method_innovation || '暂无数据'}</p>
        <p><strong>机理创新：</strong><br>${innovation.mechanism_innovation || '暂无数据'}</p>
        <p><strong>工程/应用创新：</strong><br>${innovation.application_innovation || '暂无数据'}</p>
        <p><strong>与前人工作的差异：</strong><br>${innovation.difference_from_prior_work || '暂无数据'}</p>
      </div>
    </section>

    <!-- 7. 局限性与未解决问题 -->
    <section style="margin-bottom: 2rem; padding: 1.5rem; background: #f8d7da; border-radius: 8px; border-left: 4px solid #dc3545;">
      <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #dc3545; padding-bottom: 0.5rem;">
        ⚠️ 局限性与未解决问题
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <p><strong>作者承认的限制：</strong><br>${limitations.author_acknowledged || '暂无数据'}</p>
        <p><strong>AI 推断的潜在风险点：</strong><br>${limitations.ai_inferred_risks || '暂无数据'}</p>
      </div>
    </section>
  `;
}

// 渲染实验方案标签页
function renderExperimentPlanTab(analysis) {
  const replication = analysis.experiment_replication || {};
  const extension = analysis.experiment_extension || {};
  const comparative = analysis.comparative_analysis || {};
  const risks = analysis.risks_and_warnings || {};

  return `
    <!-- 1. 实验复现方案 -->
    <section style="margin-bottom: 2rem; padding: 1.5rem; background: #d1ecf1; border-radius: 8px; border-left: 4px solid #17a2b8;">
      <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #17a2b8; padding-bottom: 0.5rem;">
        🔬 实验复现方案
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <p><strong>材料准备：</strong><br>${replication.materials_preparation || '暂无数据'}</p>
        <p><strong>工艺参数：</strong><br>${replication.process_parameters || '暂无数据'}</p>
        <p><strong>表征方法：</strong><br>${replication.characterization_methods || '暂无数据'}</p>
        <p><strong>评价指标：</strong><br>${replication.evaluation_metrics || '暂无数据'}</p>
        <div style="margin-top: 1rem;">
          <strong>复现步骤：</strong>
          <ol style="margin-top: 0.5rem;">
            ${(replication.step_by_step_guide || []).map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      </div>
    </section>

    <!-- 2. 扩展实验建议 -->
    <section style="margin-bottom: 2rem;">
      <h3 style="color: #2c3e50; border-bottom: 2px solid #28a745; padding-bottom: 0.5rem;">
        🚀 扩展实验建议
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <p><strong>参数优化建议：</strong><br>${extension.parameter_optimization || '暂无数据'}</p>
        <p><strong>材料体系迁移方案：</strong><br>${extension.material_system_transfer || '暂无数据'}</p>
        <p><strong>替代工艺路线：</strong><br>${extension.alternative_routes || '暂无数据'}</p>
      </div>
    </section>

    <!-- 3. 横向对比分析 -->
    <section style="margin-bottom: 2rem; padding: 1.5rem; background: #e2e3e5; border-radius: 8px;">
      <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #6c757d; padding-bottom: 0.5rem;">
        📊 横向对比分析
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <p><strong>与相似文献的实验条件对比：</strong><br>${comparative.similar_works_comparison || '暂无数据'}</p>
        <p><strong>性能与成本对比：</strong><br>${comparative.performance_cost_comparison || '暂无数据'}</p>
        <p><strong>适用场景对比：</strong><br>${comparative.application_scenarios || '暂无数据'}</p>
      </div>
    </section>

    <!-- 4. 风险与失败点提示 -->
    <section style="margin-bottom: 2rem; padding: 1.5rem; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
      <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #ffc107; padding-bottom: 0.5rem;">
        ⚠️ 风险与失败点提示
      </h3>
      <div style="margin-top: 1rem; line-height: 1.8; color: #555;">
        <div style="margin-bottom: 1rem;">
          <strong>易失败步骤：</strong>
          <ul style="margin-top: 0.5rem;">
            ${(risks.failure_prone_steps || []).map(step => `<li style="color: #dc3545;">${step}</li>`).join('')}
          </ul>
        </div>
        <div style="margin-bottom: 1rem;">
          <strong>实验注意事项：</strong>
          <ul style="margin-top: 0.5rem;">
            ${(risks.experimental_precautions || []).map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div>
          <strong>新手警告：</strong>
          <ul style="margin-top: 0.5rem;">
            ${(risks.beginner_warnings || []).map(warning => `<li style="color: #fd7e14;">${warning}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

// 切换标签页
function switchTab(tabName) {
  // 更新标签按钮状态
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
      btn.style.borderBottom = '3px solid #3498db';
      btn.style.color = '#2c3e50';
      btn.style.fontWeight = '600';
    } else {
      btn.classList.remove('active');
      btn.style.borderBottom = '3px solid transparent';
      btn.style.color = '#7f8c8d';
      btn.style.fontWeight = 'normal';
    }
  });

  // 更新内容显示
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === `tab-${tabName}`) {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  });
}

// 重新分析
async function reanalyzePaper(paperId) {
  if (!confirm('确定要重新分析这篇文献吗？\n\n这将覆盖现有的分析结果。')) {
    return;
  }

  const modal = document.getElementById('advanced-analysis-modal');
  modal.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column;"><h3>🤖 正在重新分析...</h3><p>请稍候，这可能需要一些时间</p></div>';

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers/${paperId}/analyze?force_reanalyze=true`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    renderAdvancedAnalysisModal(paperId, result.analysis, false);

    // 重新加载文献列表
    if (typeof loadPapers === 'function') {
      await loadPapers();
    }
  } catch (error) {
    console.error('重新分析失败:', error);
    modal.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column;">
        <h3 style="color: #e74c3c;">❌ 重新分析失败</h3>
        <p>${error.message}</p>
        <button onclick="closeAdvancedAnalysisModal()" class="btn btn-primary">关闭</button>
      </div>
    `;
  }
}

// 关闭模态框
function closeAdvancedAnalysisModal() {
  const modal = document.getElementById('advanced-analysis-modal');
  const overlay = document.getElementById('advanced-analysis-overlay');
  if (modal) modal.remove();
  if (overlay) overlay.remove();
}

// 打开高级分析模态框（主入口函数）
async function openAdvancedAnalysisModal(paperId, forceReanalyze = false) {
  // 创建临时 loading 模态框
  let modal = document.getElementById('advanced-analysis-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'advanced-analysis-modal';
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 1200px;
      height: 90vh;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    `;
    document.body.appendChild(modal);

    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.id = 'advanced-analysis-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 999;';
    overlay.onclick = () => closeAdvancedAnalysisModal();
    document.body.appendChild(overlay);
  }

  modal.innerHTML = '<h3>🤖 加载分析结果...</h3><p>请稍候</p>';

  try {
    const url = forceReanalyze
      ? `${API_BASE_URL}/api/papers/${paperId}/analyze?force_reanalyze=true`
      : `${API_BASE_URL}/api/papers/${paperId}/analyze`;

    const response = await fetch(url, { method: 'POST' });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    renderAdvancedAnalysisModal(paperId, result.analysis, result.from_cache);

    // 重新加载文献列表
    if (typeof loadPapers === 'function') {
      await loadPapers();
    }
  } catch (error) {
    console.error('加载分析结果失败:', error);
    modal.innerHTML = `
      <div style="text-align: center;">
        <h3 style="color: #e74c3c;">❌ 加载失败</h3>
        <p>${error.message}</p>
        <button onclick="closeAdvancedAnalysisModal()" class="btn btn-primary">关闭</button>
      </div>
    `;
  }
}


// 重新分析文献
async function reanalyzePaper(paperId) {
  if (!confirm('确定要重新分析这篇文献吗？\n\n这将使用 AI 重新解析 PDF 内容。')) {
    return;
  }

  closeAdvancedAnalysisModal();

  // 使用队列系统进行重新分析
  if (typeof startQueueAnalysis === 'function') {
    await startQueueAnalysis([paperId]);
  } else {
    alert('分析系统未就绪，请刷新页面后重试');
  }
}
