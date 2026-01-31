/**
 * INDEX.JS - 我的文献库页面逻辑
 * 职责：文献列表渲染、筛选、排序、PDF 导入、AI 解读
 *
 * 修复要点：
 * 1. 移除所有 inline onclick，使用 addEventListener
 * 2. 防御性渲染，任何字段缺失不影响整体
 * 3. 确保列表永不空白
 */

let selectedFiles = [];
let allPapers = []; // 存储所有文献数据
let currentFilter = 'all'; // 当前筛选类型

// ==================== 快速筛选功能 ====================
window.applyQuickFilter = function(filterType) {
  console.log('[applyQuickFilter] 应用筛选:', filterType);
  currentFilter = filterType;

  let filteredPapers = allPapers;

  switch(filterType) {
    case 'read':
      filteredPapers = allPapers.filter(p => p.read === true);
      break;
    case 'unread':
      filteredPapers = allPapers.filter(p => p.read === false);
      break;
    case 'ai-analyzed':
      filteredPapers = allPapers.filter(p => p.ai_analyzed === true);
      break;
    case 'analyzing':
      filteredPapers = allPapers.filter(p => p.ai_analyzed === false);
      break;
    case 'all':
    default:
      filteredPapers = allPapers;
      break;
  }

  renderPaperTable(filteredPapers);
};

// ==================== 时间格式化函数 ====================
function formatRelativeTime(dateString) {
  if (!dateString) return '-';

  const importDate = new Date(dateString);
  const now = new Date();

  // 计算时间差（毫秒）
  const diffMs = now - importDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '今天';
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return '近七天';
  } else {
    // 七天前显示具体日期
    const year = importDate.getFullYear();
    const month = String(importDate.getMonth() + 1).padStart(2, '0');
    const day = String(importDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// ==================== 统计卡片渲染 ====================
function renderStats(stats) {
  console.log('[renderStats] 更新统计信息:', stats);

  // 防御性处理
  const safeStats = {
    total: stats?.total || 0,
    read: stats?.read || 0,
    unread: (stats?.total || 0) - (stats?.read || 0),
    ai_analyzed: stats?.ai_analyzed || 0,
    analyzing: (stats?.total || 0) - (stats?.ai_analyzed || 0)
  };

  // 更新侧边栏统计信息
  const sidebarStats = document.querySelectorAll('.sidebar-stats .stat-value');
  if (sidebarStats.length >= 3) {
    sidebarStats[0].textContent = safeStats.total;
    sidebarStats[1].textContent = safeStats.read;
    sidebarStats[2].textContent = safeStats.ai_analyzed;
  }

  // 更新快速筛选芯片计数
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    const filterType = chip.getAttribute('data-filter');
    const countSpan = chip.querySelector('.chip-count');
    if (countSpan) {
      switch(filterType) {
        case 'all':
          countSpan.textContent = safeStats.total;
          break;
        case 'read':
          countSpan.textContent = safeStats.read;
          break;
        case 'unread':
          countSpan.textContent = safeStats.unread;
          break;
        case 'ai-analyzed':
          countSpan.textContent = safeStats.ai_analyzed;
          break;
        case 'analyzing':
          countSpan.textContent = safeStats.analyzing;
          break;
      }
    }
  });
}

// ==================== 文献表格渲染（防御性） ====================
function renderPaperTable(papers) {
  console.log('[renderPaperTable] 渲染文献列表，数量:', papers?.length || 0);

  const tbody = document.getElementById('paper-list');
  if (!tbody) {
    console.error('[renderPaperTable] 找不到 paper-list 元素');
    return;
  }

  tbody.innerHTML = '';

  // 情况1：没有文献数据
  if (!papers || papers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem; color: #666;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
          <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">暂无文献数据</div>
          <div style="font-size: 0.9rem; color: #999;">点击右上角"导入文献"按钮开始添加 PDF</div>
        </td>
      </tr>
    `;
    return;
  }

  // 情况2：有文献数据，逐条渲染
  papers.forEach((paper, index) => {
    try {
      const row = document.createElement('tr');

      // 防御性提取字段
      const paperId = paper.id || index;
      const title = paper.title || '未解析标题';
      const journal = paper.journal || '';
      const year = paper.year || '';
      const isRead = paper.read || false;
      const isAiAnalyzed = paper.ai_analyzed || false;
      const importedAt = paper.imported_at || '';

      // 显示逻辑：AI 分析完成后必须显示解析结果，否则显示「解析中」
      const displayJournal = isAiAnalyzed ? (journal || '-') : (journal || '解析中');
      const displayYear = isAiAnalyzed ? (year || '-') : (year || '解析中');
      const displayImportDate = formatRelativeTime(importedAt);

      row.innerHTML = `
        <td style="text-align: center;"><input type="checkbox" class="paper-checkbox" data-paper-id="${paperId}" data-ai-analyzed="${isAiAnalyzed}"></td>
        <td style="padding: 0.75rem;">
          <div class="paper-title" style="font-weight: 500; color: #333;">${title}</div>
        </td>
        <td style="padding: 0.75rem; color: #666;">${displayJournal}</td>
        <td style="text-align: center; padding: 0.75rem; color: #666;">${displayYear}</td>
        <td style="text-align: center; padding: 0.75rem; color: #666;">${displayImportDate}</td>
        <td style="text-align: center; padding: 0.75rem;">
          <span class="badge ${isRead ? 'badge-success' : 'badge-secondary'}"
                style="cursor: pointer; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem;"
                data-action="toggle-read"
                data-paper-id="${paperId}"
                title="点击切换已读/未读状态">
            ${isRead ? '✓ 已读' : '未读'}
          </span>
        </td>
        <td style="text-align: center; padding: 0.75rem;">
          ${isAiAnalyzed
            ? `<span class="badge badge-success" style="margin-right: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem;">✅ 已分析</span>
               <button class="btn btn-sm btn-primary" data-action="view-analysis" data-paper-id="${paperId}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">查看分析</button>`
            : `<button class="btn btn-sm btn-primary" data-action="ai-analyze" data-paper-id="${paperId}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">🤖 AI 辅助阅读</button>`
          }
          <button class="btn btn-sm btn-secondary" data-action="view-pdf" data-paper-id="${paperId}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; margin-left: 0.25rem;">查看 PDF</button>
          <button class="btn btn-sm btn-danger" data-action="delete-paper" data-paper-id="${paperId}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; margin-left: 0.25rem;">删除</button>
        </td>
      `;
      tbody.appendChild(row);
    } catch (error) {
      console.error(`[renderPaperTable] 渲染文献 ${paper?.id} 失败:`, error);
      // 跳过该条，继续渲染其他
    }
  });

  // 渲染完成后，绑定动态按钮事件
  bindDynamicEvents();
  updateBatchAnalyzeButton();
}

// ==================== 绑定动态生成的按钮事件 ====================
function bindDynamicEvents() {
  console.log('[bindDynamicEvents] 绑定动态按钮事件');

  // 切换已读状态
  document.querySelectorAll('[data-action="toggle-read"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const paperId = this.dataset.paperId;
      console.log('[Event] 切换已读状态:', paperId);
      toggleReadStatus(paperId);
    });
  });

  // AI 分析
  document.querySelectorAll('[data-action="ai-analyze"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const paperId = this.dataset.paperId;
      console.log('[Event] AI 分析:', paperId);
      analyzePaper(paperId);
    });
  });

  // 查看分析
  document.querySelectorAll('[data-action="view-analysis"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const paperId = this.dataset.paperId;
      console.log('[Event] 查看分析:', paperId);
      viewAnalysis(paperId);
    });
  });

  // 查看 PDF
  document.querySelectorAll('[data-action="view-pdf"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const paperId = this.dataset.paperId;
      console.log('[Event] 查看 PDF:', paperId);
      viewPDF(paperId);
    });
  });

  // 删除文献
  document.querySelectorAll('[data-action="delete-paper"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const paperId = this.dataset.paperId;
      console.log('[Event] 删除文献:', paperId);
      deletePaper(paperId);
    });
  });

  // 文献复选框变化
  document.querySelectorAll('.paper-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', updateBatchAnalyzeButton);
  });
}

// ==================== 从 API 加载文献 ====================
async function loadPapers() {
  console.log('[loadPapers] 开始加载文献列表');

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[loadPapers] 接收到数据:', data);

    if (data.stats) {
      renderStats(data.stats);
    }

    if (data.papers) {
      allPapers = data.papers; // 存储所有文献
      applyQuickFilter(currentFilter); // 应用当前筛选
      console.log('[loadPapers] 文献列表已加载:', data.papers.length, '篇');
    } else {
      // 即使没有 papers 字段，也要渲染空状态
      allPapers = [];
      renderPaperTable([]);
    }

  } catch (error) {
    console.error('[loadPapers] 加载文献列表失败:', error);

    // 显示错误提示
    const tbody = document.getElementById('paper-list');
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: #e74c3c;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">加载失败</div>
            <div style="font-size: 0.9rem; color: #999;">请检查后端服务是否启动</div>
            <button class="btn btn-primary" style="margin-top: 1rem;" onclick="location.reload()">重新加载</button>
          </td>
        </tr>
      `;
    }
  }
}

// ==================== 同步文献（清除幽灵文献） ====================
async function syncPapers() {
  console.log('[syncPapers] 开始同步文献');

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[syncPapers] 同步完成:', data);

    // 使用同步后的数据更新界面
    if (data.stats) {
      renderStats(data.stats);
    }

    if (data.papers) {
      renderPaperTable(data.papers);
      console.log('[syncPapers] 文献列表已同步:', data.papers.length, '篇');
    }

    return data;

  } catch (error) {
    console.error('[syncPapers] 同步文献失败:', error);
    throw error;
  }
}

// ==================== 切换已读/未读状态 ====================
async function toggleReadStatus(paperId) {
  console.log('[toggleReadStatus] 切换文献', paperId, '的已读状态');

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers/${paperId}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 更新统计信息
    if (data.stats) {
      renderStats(data.stats);
    }

    // 重新加载文献列表以更新显示
    await loadPapers();

  } catch (error) {
    console.error('[toggleReadStatus] 切换已读状态失败:', error);
    alert('操作失败，请重试');
  }
}

// ==================== AI 解读文献 ====================
async function analyzePaper(paperId) {
  console.log('[analyzePaper] 添加文献到分析队列:', paperId);

  // 单篇分析也使用队列系统
  await startQueueAnalysis([paperId]);
}

// ==================== 查看已有的 AI 分析结果 ====================
async function viewAnalysis(paperId) {
  console.log('[viewAnalysis] 查看分析:', paperId);
  await openAdvancedAnalysisModal(paperId, false);
}

// ==================== 查看 PDF ====================
function viewPDF(paperId) {
  console.log('[viewPDF] 打开 PDF:', paperId);
  const pdfUrl = `${API_BASE_URL}/api/papers/${paperId}/pdf`;
  window.open(pdfUrl, '_blank');
}

// ==================== 删除文献 ====================
async function deletePaper(paperId) {
  console.log('[deletePaper] 删除文献:', paperId);

  if (!confirm('确定要删除这篇文献吗？\n\n文献将被移至回收站，可以在回收站中恢复。')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers/${paperId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[deletePaper] 删除成功:', data);

    // 更新统计信息
    if (data.stats) {
      renderStats(data.stats);
    }

    // 更新文献列表
    if (data.papers) {
      renderPaperTable(data.papers);
    }

    alert('文献已移至回收站');

  } catch (error) {
    console.error('[deletePaper] 删除失败:', error);
    alert('删除失败：' + error.message);
  }
}

// ==================== 回收站功能 ====================
async function showTrash() {
  console.log('[showTrash] 显示回收站');

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers?show_deleted=true`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[showTrash] 接收到回收站数据:', data);

    // 更新页面标题
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
      pageTitle.innerHTML = '回收站 <button class="btn btn-sm btn-secondary" onclick="location.reload()" style="margin-left: 1rem; padding: 0.4rem 0.8rem; font-size: 0.875rem;">返回文献库</button>';
    }

    // 隐藏筛选芯片和工具栏
    const filterChips = document.querySelector('.page-header > div:first-child > div');
    const actionButtons = document.querySelector('.page-header > div:last-child');
    const filterBar = document.querySelector('.filter-bar');
    if (filterChips) filterChips.style.display = 'none';
    if (actionButtons) actionButtons.style.display = 'none';
    if (filterBar) filterBar.style.display = 'none';

    // 渲染回收站文献列表
    renderTrashTable(data.papers || []);

  } catch (error) {
    console.error('[showTrash] 加载回收站失败:', error);
    alert('加载回收站失败：' + error.message);
  }
}

function renderTrashTable(papers) {
  console.log('[renderTrashTable] 渲染回收站列表，数量:', papers?.length || 0);

  const tbody = document.getElementById('paper-list');
  if (!tbody) {
    console.error('[renderTrashTable] 找不到 paper-list 元素');
    return;
  }

  tbody.innerHTML = '';

  // 情况1：回收站为空
  if (!papers || papers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem; color: #666;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🗑️</div>
          <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">回收站是空的</div>
          <div style="font-size: 0.9rem; color: #999;">删除的文献会暂时保存在这里</div>
          <button class="btn btn-primary" style="margin-top: 1rem;" onclick="location.href='index.html'">返回文献库</button>
        </td>
      </tr>
    `;
    return;
  }

  // 情况2：有已删除的文献
  papers.forEach((paper, index) => {
    try {
      const row = document.createElement('tr');

      const paperId = paper.id || index;
      const title = paper.title || '未解析标题';
      const journal = paper.journal || '-';
      const year = paper.year || '-';
      const deletedAt = formatRelativeTime(paper.deleted_at);

      row.innerHTML = `
        <td style="text-align: center;"></td>
        <td style="padding: 0.75rem;">
          <div class="paper-title" style="font-weight: 500; color: #333;">${title}</div>
        </td>
        <td style="padding: 0.75rem; color: #666;">${journal}</td>
        <td style="text-align: center; padding: 0.75rem; color: #666;">${year}</td>
        <td style="text-align: center; padding: 0.75rem; color: #666;">${deletedAt}</td>
        <td style="text-align: center; padding: 0.75rem;"><span class="badge badge-danger" style="padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem;">已删除</span></td>
        <td style="text-align: center; padding: 0.75rem;">
          <button class="btn btn-sm btn-success" data-action="restore-paper" data-paper-id="${paperId}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">恢复</button>
          <button class="btn btn-sm btn-danger" data-action="permanent-delete" data-paper-id="${paperId}" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; margin-left: 0.25rem;">永久删除</button>
        </td>
      `;
      tbody.appendChild(row);
    } catch (error) {
      console.error(`[renderTrashTable] 渲染文献 ${paper?.id} 失败:`, error);
    }
  });

  // 绑定回收站按钮事件
  bindTrashEvents();
}

function bindTrashEvents() {
  console.log('[bindTrashEvents] 绑定回收站按钮事件');

  // 恢复文献
  document.querySelectorAll('[data-action="restore-paper"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const paperId = this.dataset.paperId;
      console.log('[Event] 恢复文献:', paperId);
      restorePaper(paperId);
    });
  });

  // 永久删除
  document.querySelectorAll('[data-action="permanent-delete"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const paperId = this.dataset.paperId;
      console.log('[Event] 永久删除:', paperId);
      permanentDeletePaper(paperId);
    });
  });
}

async function restorePaper(paperId) {
  console.log('[restorePaper] 恢复文献:', paperId);

  if (!confirm('确定要恢复这篇文献吗？')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers/${paperId}/restore`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[restorePaper] 恢复成功:', data);

    alert('文献已恢复');

    // 重新加载回收站
    showTrash();

  } catch (error) {
    console.error('[restorePaper] 恢复失败:', error);
    alert('恢复失败：' + error.message);
  }
}

async function permanentDeletePaper(paperId) {
  console.log('[permanentDeletePaper] 永久删除文献:', paperId);

  if (!confirm('确定要永久删除这篇文献吗？\n\n此操作无法撤销，PDF 文件也会被删除！')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/papers/${paperId}?permanent=true`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[permanentDeletePaper] 永久删除成功:', data);

    alert('文献已永久删除');

    // 重新加载回收站
    showTrash();

  } catch (error) {
    console.error('[permanentDeletePaper] 永久删除失败:', error);
    alert('永久删除失败：' + error.message);
  }
}


// ==================== 文件上传功能 ====================
function initFileUpload() {
  console.log('[initFileUpload] 初始化文件上传功能');

  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('pdf-file-input');
  const fileInfo = document.getElementById('file-info');
  const fileName = document.getElementById('file-name');
  const confirmBtn = document.getElementById('confirm-upload-btn');

  if (!dropZone || !fileInput) {
    console.error('[initFileUpload] 找不到必要的 DOM 元素');
    return;
  }

  dropZone.onclick = function() {
    console.log('[Event] 点击上传区域');
    fileInput.click();
  };

  fileInput.onchange = function(e) {
    console.log('[Event] 文件选择变化');
    const files = Array.from(e.target.files);
    if (files.length > 0 && files.every(f => f.type === 'application/pdf')) {
      selectedFiles = files;
      fileName.textContent = files.length === 1 ? files[0].name : `已选择 ${files.length} 个文件`;
      fileInfo.style.display = 'block';
      confirmBtn.disabled = false;
    } else {
      alert('请选择 PDF 文件');
    }
  };

  dropZone.ondragover = function(e) {
    e.preventDefault();
    dropZone.style.borderColor = '#3498db';
    dropZone.style.background = '#f0f8ff';
  };

  dropZone.ondragleave = function() {
    dropZone.style.borderColor = '#ccc';
    dropZone.style.background = 'transparent';
  };

  dropZone.ondrop = function(e) {
    e.preventDefault();
    console.log('[Event] 文件拖放');
    dropZone.style.borderColor = '#ccc';
    dropZone.style.background = 'transparent';
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files.every(f => f.type === 'application/pdf')) {
      selectedFiles = files;
      fileName.textContent = files.length === 1 ? files[0].name : `已选择 ${files.length} 个文件`;
      fileInfo.style.display = 'block';
      confirmBtn.disabled = false;
    } else {
      alert('请拖拽 PDF 文件');
    }
  };
}

// ==================== 打开上传弹窗 ====================
function openUploadModal() {
  console.log('[openUploadModal] 打开上传弹窗');

  const modal = document.getElementById('upload-modal');
  if (modal) {
    modal.style.display = 'flex';
    selectedFiles = [];
    const fileInfo = document.getElementById('file-info');
    const confirmBtn = document.getElementById('confirm-upload-btn');
    if (fileInfo) fileInfo.style.display = 'none';
    if (confirmBtn) confirmBtn.disabled = true;
  }
}

// ==================== 关闭上传弹窗 ====================
function closeUploadModal() {
  console.log('[closeUploadModal] 关闭上传弹窗');

  const modal = document.getElementById('upload-modal');
  if (modal) modal.style.display = 'none';
  selectedFiles = [];
}

// ==================== 确认上传 ====================
async function confirmUpload() {
  console.log('[confirmUpload] 确认上传，文件数:', selectedFiles.length);

  if (!selectedFiles || selectedFiles.length === 0) {
    alert('请先选择文件');
    return;
  }

  const btn = document.getElementById('confirm-upload-btn');
  btn.disabled = true;
  btn.textContent = `上传中 (0/${selectedFiles.length})...`;

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    btn.textContent = `上传中 (${i + 1}/${selectedFiles.length})...`;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(API_BASE_URL + '/api/papers/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || '上传失败');
      }

      await response.json();
      successCount++;
    } catch (error) {
      console.error(`[confirmUpload] 上传 ${file.name} 失败:`, error);
      failCount++;
      errors.push(`${file.name}: ${error.message}`);
    }
  }

  // 显示结果
  let message = `上传完成！\n✓ 成功：${successCount} 个文件`;
  if (failCount > 0) {
    message += `\n✗ 失败：${failCount} 个文件`;
    if (errors.length > 0) {
      message += `\n\n失败详情：\n${errors.join('\n')}`;
    }
  }
  alert(message);

  closeUploadModal();

  // 上传完成后重新加载文献列表
  await loadPapers();

  btn.disabled = false;
  btn.textContent = '确认导入';
}

// ==================== 全选/取消全选 ====================
function toggleSelectAll() {
  console.log('[toggleSelectAll] 切换全选状态');

  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  const paperCheckboxes = document.querySelectorAll('.paper-checkbox');

  paperCheckboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
  });

  updateBatchAnalyzeButton();
}

// ==================== 更新批量分析按钮状态 ====================
function updateBatchAnalyzeButton() {
  const paperCheckboxes = document.querySelectorAll('.paper-checkbox:checked');
  const batchAnalyzeBtn = document.getElementById('batch-analyze-btn');

  if (!batchAnalyzeBtn) return;

  // 筛选出未分析的论文
  const unanalyzedPapers = Array.from(paperCheckboxes).filter(
    checkbox => checkbox.dataset.aiAnalyzed === 'false'
  );

  if (unanalyzedPapers.length > 0) {
    batchAnalyzeBtn.disabled = false;
    batchAnalyzeBtn.textContent = `🤖 批量 AI 分析 (${unanalyzedPapers.length})`;
  } else {
    batchAnalyzeBtn.disabled = true;
    batchAnalyzeBtn.textContent = '🤖 批量 AI 分析';
  }
}

// ==================== 批量分析文献 ====================
async function batchAnalyzePapers() {
  console.log('[batchAnalyzePapers] 开始批量分析');

  const paperCheckboxes = document.querySelectorAll('.paper-checkbox:checked');

  // 筛选出未分析的论文
  const unanalyzedPapers = Array.from(paperCheckboxes).filter(
    checkbox => checkbox.dataset.aiAnalyzed === 'false'
  );

  if (unanalyzedPapers.length === 0) {
    alert('请选择未分析的文献');
    return;
  }

  const paperIds = unanalyzedPapers.map(checkbox => parseInt(checkbox.dataset.paperId));

  if (!confirm(`确定要分析 ${paperIds.length} 篇文献吗？\n\n这可能需要一些时间。`)) {
    return;
  }

  const batchAnalyzeBtn = document.getElementById('batch-analyze-btn');
  batchAnalyzeBtn.disabled = true;
  batchAnalyzeBtn.textContent = `⏳ 分析中 (0/${paperIds.length})...`;

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (let i = 0; i < paperIds.length; i++) {
    const paperId = paperIds[i];
    batchAnalyzeBtn.textContent = `⏳ 分析中 (${i + 1}/${paperIds.length})...`;

    try {
      const response = await fetch(`${API_BASE_URL}/api/papers/${paperId}/analyze`, {
        method: 'POST'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || '分析失败');
      }

      await response.json();
      successCount++;
    } catch (error) {
      console.error(`[batchAnalyzePapers] 分析文献 ${paperId} 失败:`, error);
      failCount++;
      errors.push(`文献 ID ${paperId}: ${error.message}`);
    }
  }

  // 显示结果
  let message = `批量分析完成！\n✓ 成功：${successCount} 篇`;
  if (failCount > 0) {
    message += `\n✗ 失败：${failCount} 篇`;
    if (errors.length > 0) {
      message += `\n\n失败详情：\n${errors.join('\n')}`;
    }
  }
  alert(message);

  // 重新加载文献列表
  await loadPapers();

  // 取消所有选中
  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  if (selectAllCheckbox) selectAllCheckbox.checked = false;

  batchAnalyzeBtn.disabled = true;
  batchAnalyzeBtn.textContent = '🤖 批量 AI 分析';
}

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', async function() {
  console.log('='.repeat(50));
  console.log('[DOMContentLoaded] 文献库页面开始初始化');
  console.log('='.repeat(50));

  // 初始化文件上传功能
  initFileUpload();

  // 绑定静态按钮事件
  const importBtn = document.getElementById('import-pdf-btn');
  if (importBtn) {
    importBtn.addEventListener('click', function() {
      console.log('[Event] 点击导入文献按钮');
      openUploadModal();
    });
  }

  const cancelBtn = document.getElementById('cancel-upload-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      console.log('[Event] 点击取消按钮');
      closeUploadModal();
    });
  }

  const confirmBtn = document.getElementById('confirm-upload-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function() {
      console.log('[Event] 点击确认上传按钮');
      confirmUpload();
    });
  }

  const batchAnalyzeBtn = document.getElementById('batch-analyze-btn');
  if (batchAnalyzeBtn) {
    batchAnalyzeBtn.addEventListener('click', function() {
      console.log('[Event] 点击批量分析按钮');
      batchAnalyzePapers();
    });
  }

  const selectAllCheckbox = document.getElementById('select-all-checkbox');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      console.log('[Event] 全选复选框变化');
      toggleSelectAll();
    });
  }

  // 绑定回收站链接
  const trashLink = document.getElementById('trash-link');
  if (trashLink) {
    trashLink.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('[Event] 点击回收站');
      showTrash();
    });
  }

  // 绑定模态框背景点击关闭
  const uploadModal = document.getElementById('upload-modal');
  if (uploadModal) {
    uploadModal.addEventListener('click', function(e) {
      if (e.target === this) {
        console.log('[Event] 点击模态框背景');
        closeUploadModal();
      }
    });
  }

  // 加载文献列表
  try {
    await loadPapers();
  } catch (error) {
    console.error('[DOMContentLoaded] 初始加载失败:', error);
  }

  // 检查 URL 参数，如果是 view=trash 则显示回收站
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('view') === 'trash') {
    console.log('[DOMContentLoaded] 检测到 view=trash 参数，显示回收站');
    showTrash();
  }

  console.log('[DOMContentLoaded] 文献库页面初始化完成');
});
