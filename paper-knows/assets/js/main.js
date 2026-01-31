/**
 * MAIN.JS - 全局逻辑
 * 职责：侧边栏导航高亮、主题切换、全局事件监听
 */

// 防御性校验：确保 config.js 已加载
if (typeof API_BASE_URL === 'undefined') {
  throw new Error('❌ API_BASE_URL 未定义，config.js 未正确加载');
}

console.log('[main.js] API_BASE_URL 已加载:', API_BASE_URL);

// 导航高亮逻辑
function initNavigation() {
  // 根据当前 URL 设置初始 active 状态
  setActiveNavByUrl();

  // 获取所有导航链接
  const navLinks = document.querySelectorAll('aside nav a[href]');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // 移除所有 active 状态
      navLinks.forEach(l => removeActiveStyles(l));
      // 添加当前 active 状态
      addActiveStyles(this);
    });
  });
}

// 根据当前 URL 设置导航高亮
function setActiveNavByUrl() {
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;

  // 获取所有导航链接（使用新的选择器）
  const navLinks = document.querySelectorAll('aside nav a[href]');

  // 移除所有链接的激活样式
  navLinks.forEach(link => {
    removeActiveStyles(link);
  });

  // 检查是否是回收站页面
  if (currentSearch.includes('view=trash')) {
    const trashLink = document.getElementById('trash-link');
    if (trashLink) {
      addActiveStyles(trashLink);
      return;
    }
  }

  // 根据当前页面路径设置 active
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // 跳过回收站链接（已在上面处理）
    if (link.id === 'trash-link') return;

    // 提取链接的路径部分（不包含查询参数）
    const linkPath = href.split('?')[0];
    const linkFileName = linkPath.split('/').pop();
    const currentFileName = currentPath.split('/').pop() || 'index.html';

    // 匹配当前页面
    if (linkFileName === currentFileName) {
      addActiveStyles(link);
    }
  });
}

// 添加激活样式（Tailwind CSS）
function addActiveStyles(link) {
  link.classList.add('bg-blue-50', 'border', 'border-blue-100');
  // 更新图标颜色
  const icon = link.querySelector('svg');
  if (icon) {
    icon.classList.remove('group-hover:text-blue-500', 'group-hover:text-red-400');
    icon.classList.add('text-blue-500');
  }
  // 更新文字颜色
  const text = link.querySelector('span');
  if (text) {
    text.classList.add('text-blue-700');
  }
}

// 移除激活样式（Tailwind CSS）
function removeActiveStyles(link) {
  link.classList.remove('bg-blue-50', 'border', 'border-blue-100', 'active');
  // 恢复图标颜色
  const icon = link.querySelector('svg');
  if (icon) {
    icon.classList.remove('text-blue-500');
    // 根据链接类型恢复 hover 样式
    if (link.id === 'trash-link') {
      icon.classList.add('group-hover:text-red-400');
    } else {
      icon.classList.add('group-hover:text-blue-500');
    }
  }
  // 恢复文字颜色
  const text = link.querySelector('span');
  if (text) {
    text.classList.remove('text-blue-700');
  }
}

// 主题切换逻辑（占位）
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      // 后续可扩展深色模式样式
    });
  }
}

// 侧边栏折叠逻辑
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');

  if (sidebarToggle && sidebar) {
    // 从 localStorage 读取侧边栏状态
    const sidebarExpanded = localStorage.getItem('sidebarExpanded') === 'true';
    if (sidebarExpanded) {
      sidebar.classList.add('expanded');
    }

    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('expanded');
      // 保存侧边栏状态到 localStorage
      localStorage.setItem('sidebarExpanded', sidebar.classList.contains('expanded'));
    });
  }
}

// 快速筛选芯片逻辑
function initFilterChips() {
  const filterChips = document.querySelectorAll('.filter-chip');

  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      // 移除所有 active 状态
      filterChips.forEach(c => {
        c.style.background = 'white';
        c.style.color = '#666';
        c.classList.remove('active');
      });

      // 添加当前 active 状态
      this.classList.add('active');
      this.style.background = '#3498db';
      this.style.color = 'white';

      // 触发筛选逻辑（如果页面有相关函数）
      const filterType = this.getAttribute('data-filter');
      if (typeof window.applyQuickFilter === 'function') {
        window.applyQuickFilter(filterType);
      }
    });
  });
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initThemeToggle();
  initSidebarToggle();
  initFilterChips();

  console.log('材知道系统已初始化');
});
