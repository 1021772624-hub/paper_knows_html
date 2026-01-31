/**
 * 增强的表格渲染器 - 杂志排版风格
 * Enhanced Table Renderer with Magazine-style Layout
 */

// 渲染单个文献行（优化版）
function renderPaperRowEnhanced(paper) {
  const row = document.createElement('tr');
  row.dataset.paperId = paper.id;

  // 复选框列
  const checkboxCell = document.createElement('td');
  checkboxCell.style.textAlign = 'center';
  checkboxCell.innerHTML = `<input type="checkbox" class="paper-checkbox" value="${paper.id}">`;
  row.appendChild(checkboxCell);

  // 标题列（带标签）
  const titleCell = document.createElement('td');
  const tags = paper.tags || [];
  const tagsHTML = tags.map(tag => {
    const tagClass = tag.toLowerCase().includes('computational') ? 'cyan' : '';
    return `<span class="paper-tag ${tagClass}">${tag}</span>`;
  }).join('');

  titleCell.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <div style="font-weight: 600; color: #1e293b; font-size: 0.9375rem; line-height: 1.4;">
        ${paper.title}
      </div>
      ${tags.length > 0 ? `<div style="display: flex; gap: 0.375rem; flex-wrap: wrap;">${tagsHTML}</div>` : ''}
    </div>
  `;
  row.appendChild(titleCell);

  // 期刊列
  const journalCell = document.createElement('td');
  if (paper.status === 'analyzing') {
    journalCell.innerHTML = `
      <span class="status-badge analyzing">
        ⟳ 解析中
      </span>
    `;
  } else {
    journalCell.innerHTML = `
      <div style="font-size: 0.875rem; color: #64748b; line-height: 1.4;">
        ${paper.journal || '-'}
      </div>
    `;
  }
  row.appendChild(journalCell);

  // 年份列
  const yearCell = document.createElement('td');
  yearCell.style.textAlign = 'center';
  yearCell.innerHTML = `
    <div style="font-weight: 500; color: #334155; font-size: 0.875rem;">
      ${paper.year || '-'}
    </div>
  `;
  row.appendChild(yearCell);

  // 导入日期列
  const dateCell = document.createElement('td');
  dateCell.style.textAlign = 'center';
  dateCell.innerHTML = `
    <div style="font-size: 0.8125rem; color: #94a3b8;">
      ${formatDate(paper.importDate)}
    </div>
  `;
  row.appendChild(dateCell);

  // 状态列
  const statusCell = document.createElement('td');
  statusCell.style.textAlign = 'center';
  const statusBadge = getStatusBadge(paper.readStatus);
  statusCell.innerHTML = statusBadge;
  row.appendChild(statusCell);

  // 操作列
  const actionsCell = document.createElement('td');
  actionsCell.innerHTML = renderActionButtons(paper);
  row.appendChild(actionsCell);

  // 如果正在解析，添加高亮效果
  if (paper.status === 'analyzing') {
    row.style.background = 'rgba(251, 191, 36, 0.05)';
  }

  return row;
}

// 获取状态徽章
function getStatusBadge(readStatus) {
  const badges = {
    'read': '<span class="status-badge read">✓ 已读</span>',
    'unread': '<span class="status-badge unread">未读</span>',
    'analyzing': '<span class="status-badge analyzing">⟳ 解析中</span>'
  };
  return badges[readStatus] || badges['unread'];
}

// 渲染操作按钮
function renderActionButtons(paper) {
  const buttons = [];

  if (paper.status === 'analyzing') {
    // 解析中状态
    buttons.push(`
      <button class="action-btn" disabled title="AI 辅助阅读">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </button>
    `);
    buttons.push(`
      <button class="action-btn" disabled title="查看 PDF">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </button>
    `);
  } else if (paper.aiAnalyzed) {
    // 已分析状态
    buttons.push(`
      <button class="action-btn" onclick="viewAnalysis('${paper.id}')" title="查看分析">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </button>
    `);
    buttons.push(`
      <button class="action-btn" onclick="viewPDF('${paper.id}')" title="查看 PDF">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </button>
    `);
    buttons.push(`
      <button class="action-btn" onclick="openOriginalLink('${paper.id}')" title="原文链接">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </button>
    `);
  } else {
    // 未分析状态
    buttons.push(`
      <button class="action-btn" onclick="startAIAnalysis('${paper.id}')" title="开始 AI 分析">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </button>
    `);
    buttons.push(`
      <button class="action-btn" onclick="viewPDF('${paper.id}')" title="查看 PDF">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
      </button>
    `);
  }

  // 分隔线
  buttons.push(`<div style="width: 1px; height: 20px; background: rgba(226, 232, 240, 0.6); margin: 0 0.25rem;"></div>`);

  // 删除按钮
  buttons.push(`
    <button class="action-btn danger" onclick="deletePaper('${paper.id}')" title="删除">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
    </button>
  `);

  return `<div class="action-buttons">${buttons.join('')}</div>`;
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 重置时间部分以便比较日期
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return '今天';
  } else if (date.getTime() === yesterday.getTime()) {
    return '昨天';
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }
}

// 示例数据
const samplePapers = [
  {
    id: 'p1',
    title: 'High-precision molecular dynamics simulation of UO2-PuO2: Pair potentials comparison in helium behavior',
    journal: 'Journal of Nuclear Materials',
    year: 2011,
    importDate: new Date().toISOString(),
    readStatus: 'read',
    status: 'analyzed',
    aiAnalyzed: true,
    tags: ['Nuclear materials', 'Computational']
  },
  {
    id: 'p2',
    title: 'A NEW APPROACH TO DETERMINE AND EVALUATE THE POISSON\'S RATIO OF WOOD',
    journal: '',
    year: 2024,
    importDate: new Date().toISOString(),
    readStatus: 'read',
    status: 'analyzing',
    aiAnalyzed: false,
    tags: []
  },
  {
    id: 'p3',
    title: 'A Novel Dry Blending Method to Reduce Coefficient of Thermal Expansion of Epoxy Resin',
    journal: 'Beilstein Archives',
    year: 2019,
    importDate: new Date().toISOString(),
    readStatus: 'unread',
    status: 'uploaded',
    aiAnalyzed: false,
    tags: []
  }
];

// 渲染示例数据（用于测试）
function renderSampleData() {
  const tbody = document.getElementById('paper-list');
  if (!tbody) return;

  tbody.innerHTML = '';
  samplePapers.forEach(paper => {
    tbody.appendChild(renderPaperRowEnhanced(paper));
  });
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderPaperRowEnhanced,
    getStatusBadge,
    renderActionButtons,
    formatDate
  };
}
