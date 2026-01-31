import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import ArticleCard from '@/components/ArticleCard';
import HeroSection from '@/components/HeroSection';
import ArticleModal from '@/components/ArticleModal';
import Footer from '@/components/Footer';

/**
 * 主页面 - 微信公众号推送栏目
 * 设计理念：现代极简主义，卡片式信息流，响应式布局
 * 布局：头部导航 + 英雄区域 + 左侧分类 + 右侧文章列表 + 页脚
 */

// 模拟数据
const MOCK_CATEGORIES = [
  { id: 'all', name: '全部', icon: '📰', count: 128 },
  { id: 'tech', name: '技术', icon: '💻', count: 45 },
  { id: 'design', name: '设计', icon: '🎨', count: 32 },
  { id: 'lifestyle', name: '生活', icon: '☕', count: 28 },
  { id: 'business', name: '商业', icon: '💼', count: 23 },
];

const MOCK_ARTICLES = [
  {
    id: '1',
    title: '现代 Web 开发的最佳实践',
    excerpt: '深入探讨 React 19、TypeScript 和 Tailwind CSS 在实际项目中的应用...',
    content: '在现代 Web 开发中，选择合适的技术栈至关重要。React 19 带来了许多改进，TypeScript 提供了类型安全，而 Tailwind CSS 让样式开发变得更加高效。本文将详细介绍如何在实际项目中最大化利用这些技术的优势。',
    category: '技术',
    author: '张三',
    date: '2 小时前',
    thumbnail: '/images/category-tech.jpg',
    likes: 234,
    comments: 45,
    categoryId: 'tech',
  },
  {
    id: '2',
    title: '设计系统的构建之道',
    excerpt: '从零开始构建一个完整的设计系统，包括组件库、设计规范和工具链...',
    content: '设计系统是现代设计团队的核心基础设施。它不仅包括可重用的组件库，还包括设计规范、色彩系统、排版规则等。本文将介绍如何从零开始构建一个完整的设计系统。',
    category: '设计',
    author: '李四',
    date: '4 小时前',
    thumbnail: '/images/article-placeholder.jpg',
    likes: 189,
    comments: 32,
    categoryId: 'design',
  },
  {
    id: '3',
    title: '咖啡文化与工作效率的关系',
    excerpt: '研究表明，适量的咖啡因摄入能够提高工作效率和创意思维...',
    content: '咖啡不仅是一种饮品，更是一种文化。研究表明，适量的咖啡因摄入能够提高工作效率、增强专注力和创意思维。本文将探讨咖啡文化与工作效率的关系。',
    category: '生活',
    author: '王五',
    date: '6 小时前',
    thumbnail: '/images/category-lifestyle.jpg',
    likes: 156,
    comments: 28,
    categoryId: 'lifestyle',
  },
  {
    id: '4',
    title: '初创公司融资的关键要素',
    excerpt: '分析成功的初创公司融资案例，揭示投资者最看重的因素...',
    content: '融资是初创公司发展的关键阶段。投资者关注的不仅是商业模式，还包括团队实力、市场前景和执行能力。本文将分析成功融资的关键要素。',
    category: '商业',
    author: '赵六',
    date: '8 小时前',
    thumbnail: '/images/article-placeholder.jpg',
    likes: 142,
    comments: 21,
    categoryId: 'business',
  },
  {
    id: '5',
    title: 'TypeScript 高级类型系统解析',
    excerpt: '深入理解 TypeScript 的泛型、条件类型和映射类型...',
    content: 'TypeScript 的类型系统非常强大。通过泛型、条件类型和映射类型，我们可以编写更加灵活和安全的代码。本文将深入探讨这些高级特性的应用。',
    category: '技术',
    author: '张三',
    date: '10 小时前',
    thumbnail: '/images/category-tech.jpg',
    likes: 198,
    comments: 38,
    categoryId: 'tech',
  },
  {
    id: '6',
    title: 'UI 设计中的色彩心理学',
    excerpt: '颜色如何影响用户的情感和行为，以及如何在设计中正确应用...',
    content: '色彩心理学是 UI 设计的重要基础。不同的颜色能够传达不同的情感，影响用户的行为。本文将介绍如何在设计中正确应用色彩心理学。',
    category: '设计',
    author: '李四',
    date: '12 小时前',
    thumbnail: '/images/article-placeholder.jpg',
    likes: 167,
    comments: 25,
    categoryId: 'design',
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<typeof MOCK_ARTICLES[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 过滤文章
  const filteredArticles = useMemo(() => {
    return MOCK_ARTICLES.filter((article) => {
      const matchesCategory = activeCategory === 'all' || article.categoryId === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleArticleClick = (article: typeof MOCK_ARTICLES[0]) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 头部 */}
      <Header onSearch={setSearchQuery} />

      {/* 英雄区域 */}
      <HeroSection />

      {/* 主容器 */}
      <div className="flex flex-1">
        {/* 侧边栏导航 */}
        <CategoryNav
          categories={MOCK_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* 主内容区 */}
        <main className="flex-1 lg:ml-0">
          <div className="container py-6">
            {/* 标题和过滤信息 */}
            <div className="mb-8">
              <h2 className="font-poppins font-bold text-2xl mb-2">
                {MOCK_CATEGORIES.find((c) => c.id === activeCategory)?.name || '全部文章'}
              </h2>
              <p className="text-muted-foreground">
                {searchQuery ? `搜索结果：${filteredArticles.length} 篇` : `共 ${filteredArticles.length} 篇文章`}
              </p>
            </div>

            {/* 文章列表 */}
            <div className="max-w-2xl">
              {filteredArticles.length > 0 ? (
                <div className="space-y-0">
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      {...article}
                      onClick={() => handleArticleClick(article)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="font-poppins font-semibold text-lg mb-2">没有找到相关文章</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? '尝试更改搜索关键词' : '敬请期待更多内容'}
                  </p>
                </div>
              )}
            </div>

            {/* 加载更多 */}
            {filteredArticles.length > 0 && (
              <div className="flex justify-center mt-8 mb-8">
                <button className="accent-button">
                  加载更多
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 页脚 */}
      <Footer />

      {/* 文章详情模态框 */}
      <ArticleModal
        isOpen={isModalOpen}
        article={selectedArticle || undefined}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
