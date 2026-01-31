/**
 * ANALYSIS-QUEUE.JS - 分析队列管理系统
 * 职责：管理文献分析队列，显示进度条，支持取消操作
 */

// 队列状态
let analysisQueue = [];
let isAnalyzing = false;
let currentAnalysisIndex = 0;
let shouldCancelAnalysis = false;

// 显示进度条
function showProgressBar() {
  const progressBar = document.getElementById('analysis-progress-bar');
  if (progressBar) {
    progressBar.style.display = 'block';
  }
}

// 隐藏进度条
function hideProgressBar() {
  const progressBar = document.getElementById('analysis-progress-bar');
  if (progressBar) {
    progressBar.style.display = 'none';
  }
  shouldCancelAnalysis = false;
}

// 更新进度条
function updateProgressBar(current, total, paperTitle) {
  const progressStatus = document.getElementById('progress-status');
  const progressCurrentPaper = document.getElementById('progress-current-paper');
  const progressCount = document.getElementById('progress-count');
  const progressBarFill = document.getElementById('progress-bar-fill');

  if (progressStatus) {
    progressStatus.textContent = '正在分析文献...';
  }
  if (progressCurrentPaper) {
    progressCurrentPaper.textContent = `当前: ${paperTitle}`;
  }
  if (progressCount) {
    progressCount.textContent = `进度: ${current}/${total}`;
  }
  if (progressBarFill) {
    const percentage = (current / total) * 100;
    progressBarFill.style.width = `${percentage}%`;
  }
}

// 取消分析
function cancelAnalysis() {
  if (confirm('确定要取消当前的分析任务吗？')) {
    shouldCancelAnalysis = true;
    console.log('[cancelAnalysis] 用户请求取消分析');
  }
}

// 开始队列分析
async function startQueueAnalysis(paperIds) {
  if (isAnalyzing) {
    alert('已有分析任务正在进行中，请等待完成');
    return;
  }

  analysisQueue = paperIds;
  isAnalyzing = true;
  currentAnalysisIndex = 0;
  shouldCancelAnalysis = false;

  showProgressBar();

  for (let i = 0; i < analysisQueue.length; i++) {
    if (shouldCancelAnalysis) {
      console.log('[startQueueAnalysis] 分析已取消');
      break;
    }

    currentAnalysisIndex = i + 1;
    const paperId = analysisQueue[i];

    // 获取文献标题
    try {
      const response = await fetch(`${API_BASE_URL}/api/papers`);
      const data = await response.json();
      const paper = data.papers.find(p => p.id === paperId);
      const paperTitle = paper?.title || `文献 ${paperId}`;

      updateProgressBar(currentAnalysisIndex, analysisQueue.length, paperTitle);

      console.log(`[startQueueAnalysis] 分析文献 ${paperId} (${currentAnalysisIndex}/${analysisQueue.length})`);

      const analyzeResponse = await fetch(`${API_BASE_URL}/api/papers/${paperId}/analyze`, {
        method: 'POST'
      });

      if (!analyzeResponse.ok) {
        throw new Error(`HTTP error! status: ${analyzeResponse.status}`);
      }

      await analyzeResponse.json();
      console.log(`[startQueueAnalysis] 文献 ${paperId} 分析完成`);

    } catch (error) {
      console.error(`[startQueueAnalysis] 分析文献 ${paperId} 失败:`, error);
    }

    // 短暂延迟，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 分析完成，刷新列表
  if (typeof loadPapers === 'function') {
    await loadPapers();
  }

  isAnalyzing = false;
  hideProgressBar();

  if (!shouldCancelAnalysis) {
    alert(`分析完成！共处理 ${currentAnalysisIndex} 篇文献`);
  } else {
    alert(`分析已取消。已完成 ${currentAnalysisIndex - 1} 篇文献`);
  }
}

// 初始化取消按钮
function initCancelButton() {
  const cancelBtn = document.getElementById('cancel-analysis-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelAnalysis);
  }
}

// 页面加载时初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCancelButton);
} else {
  initCancelButton();
}
