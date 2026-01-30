/**
 * INDEX.JS - 我的文献库页面逻辑
 * 职责：文献列表渲染、筛选、排序
 */

// 渲染文献列表（占位实现）
function renderPaperList() {
  const tbody = document.getElementById('paper-list');
  if (!tbody) return;

  // 使用 mock 数据渲染
  if (typeof mockPapers !== 'undefined') {
    // 后续可在此处实现动态渲染逻辑
    console.log('文献数据已加载:', mockPapers.length, '篇');
  }
}

// 筛选逻辑（占位）
function initFilters() {
  const filterSelects = document.querySelectorAll('.filter-select');

  filterSelects.forEach(select => {
    select.addEventListener('change', function() {
      console.log('筛选条件变更:', this.id, this.value);
      // 后续实现筛选逻辑
    });
  });
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
  renderPaperList();
  initFilters();

  console.log('文献库页面已初始化');
});
