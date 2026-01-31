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
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // 移除所有 active 状态
      navLinks.forEach(l => l.classList.remove('active'));
      // 添加当前 active 状态
      this.classList.add('active');
    });
  });
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

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initThemeToggle();

  console.log('材知道系统已初始化');
});
