/**
 * ARTICLE.JS - 文章详情页逻辑
 * 职责：加载文章内容、渲染 Markdown、展示引用文献
 */

// 简单的 Markdown 转 HTML 函数
function parseMarkdown(markdown) {
  let html = markdown;

  // 标题
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 列表
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // 段落
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol')) {
      return para;
    }
    return para.trim() ? `<p>${para}</p>` : '';
  }).join('\n');

  return html;
}

// 获取 URL 参数
function getArticleId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// 渲染文章内容
function renderArticle(article) {
  // 标题
  document.getElementById('article-title').textContent = article.title;

  // 元数据
  document.getElementById('article-date').textContent = article.createdAt;
  document.getElementById('article-confidence').textContent = `可信度 ${article.confidenceScore}%`;
  document.getElementById('article-source-count').textContent = `引用 ${article.sourceCount} 篇文献`;

  // 标签
  const tagsContainer = document.getElementById('article-tags');
  tagsContainer.innerHTML = '';
  article.tags.forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.className = 'badge badge-info';
    tagElement.textContent = tag;
    tagsContainer.appendChild(tagElement);
  });

  // 正文（Markdown 转 HTML）
  const contentContainer = document.getElementById('article-content');
  contentContainer.innerHTML = parseMarkdown(article.content);
}

// 渲染引用文献
function renderReferences(references) {
  const container = document.getElementById('references-list');
  container.innerHTML = '';

  if (!references || references.length === 0) {
    container.innerHTML = '<p class="text-muted">暂无引用文献</p>';
    return;
  }

  references.forEach(ref => {
    const refItem = document.createElement('div');
    refItem.className = 'reference-item';
    refItem.innerHTML = `
      <div class="reference-title">${ref.title}</div>
      <div class="reference-meta">
        ${ref.authors} · ${ref.year} · <span class="badge badge-info">${ref.category}</span>
      </div>
    `;
    container.appendChild(refItem);
  });
}

// 从 API 加载文章
async function loadArticle() {
  const articleId = getArticleId();

  if (!articleId) {
    console.error('缺少文章 ID');
    document.getElementById('article-content').innerHTML = '<p class="text-muted">文章不存在</p>';
    return;
  }

  try {
    // 使用 mock 数据
    const response = await fetch(`api/recommend/${articleId}.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 渲染文章
    if (data.article) {
      renderArticle(data.article);
    }

    // 渲染引用文献
    if (data.references) {
      renderReferences(data.references);
    }

  } catch (error) {
    console.error('加载文章失败:', error);
    document.getElementById('article-content').innerHTML = '<p class="text-muted">加载失败，请稍后重试</p>';
  }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
  loadArticle();
  console.log('文章详情页已初始化');
});
