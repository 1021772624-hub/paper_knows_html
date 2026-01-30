/**
 * RECOMMEND.JS - 智慧推荐页面逻辑
 * 职责：加载文章列表、渲染、跳转
 */

// 渲染文章列表
function renderArticleList(articles) {
  const container = document.querySelector('.recommend-list');
  if (!container) return;

  container.innerHTML = '';

  articles.forEach(article => {
    const articleItem = document.createElement('div');
    articleItem.className = 'recommend-item';
    articleItem.style.cursor = 'pointer';

    articleItem.innerHTML = `
      <div class="recommend-header">
        <div class="recommend-type-wrapper">
          <span class="badge badge-info">AI 生成文章</span>
          <span class="recommend-score">可信度: ${article.confidenceScore}%</span>
        </div>
        <div>
          <span class="text-muted">引用 ${article.sourceCount} 篇文献</span>
        </div>
      </div>
      <h3 class="recommend-title">${article.title}</h3>
      <div class="recommend-meta">
        ${article.tags.map(tag => `<span class="meta-item">${tag}</span>`).join('')}
        <span class="meta-item">${article.createdAt}</span>
      </div>
      <div class="recommend-reason">
        ${article.summary}
      </div>
    `;

    // 点击跳转到文章详情页
    articleItem.addEventListener('click', function() {
      window.location.href = `article.html?id=${article.id}`;
    });

    container.appendChild(articleItem);
  });
}

// 从 API 加载文章列表
async function loadArticles() {
  try {
    const response = await fetch('api/recommend/articles.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.articles) {
      renderArticleList(data.articles);
      console.log('文章列表已加载:', data.articles.length, '篇');
    }

  } catch (error) {
    console.error('加载文章列表失败:', error);
  }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
  loadArticles();
  console.log('智慧推荐页面已初始化');
});
