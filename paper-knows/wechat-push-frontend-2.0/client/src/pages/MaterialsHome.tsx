import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import MaterialArticleCard from '@/components/MaterialArticleCard';
import MaterialArticleModal from '@/components/MaterialArticleModal';
import MaterialsHeroSection from '@/components/MaterialsHeroSection';
import Footer from '@/components/Footer';
import { MATERIAL_CATEGORIES, MOCK_MATERIAL_ARTICLES } from '@/data/materialArticles';
import type { MaterialArticle, ResearchMethod } from '@/types/materials';

/**
 * 材料科学研究推送平台 - 主页面
 * 设计理念：单栏垂直流，简化导航，整合搜索
 * 布局：头部 + 英雄区域（含分类卡片） + 控制栏 + 文章列表 + 页脚
 */

export default function MaterialsHome() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<ResearchMethod[]>([]);
  const [minCitations, setMinCitations] = useState(0);
  const [minImpactFactor, setMinImpactFactor] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<MaterialArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 获取所有研究方法
  const allMethods = Array.from(
    new Set(MOCK_MATERIAL_ARTICLES.flatMap((article) => article.tags))
  ) as ResearchMethod[];

  // 过滤文章
  const filteredArticles = useMemo(() => {
    return MOCK_MATERIAL_ARTICLES.filter((article) => {
      // 分类过滤
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory;

      // 搜索过滤
      const matchesSearch =
        searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));

      // 研究方法过滤
      const matchesMethods =
        selectedMethods.length === 0 ||
        selectedMethods.some((method) => article.tags.includes(method));

      // 引用数过滤
      const matchesCitations = article.citations >= minCitations;

      // 影响因子过滤
      const matchesImpactFactor =
        minImpactFactor === 0 || (article.impactFactor && article.impactFactor >= minImpactFactor);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesMethods &&
        matchesCitations &&
        matchesImpactFactor
      );
    });
  }, [activeCategory, searchQuery, selectedMethods, minCitations, minImpactFactor]);

  const handleArticleClick = (article: MaterialArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    // 滚动到内容区域
    document.getElementById('content-stream')?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedMethods([]);
    setMinCitations(0);
    setMinImpactFactor(0);
    setActiveCategory('all');
  };

  const hasActiveFilters = searchQuery || selectedMethods.length > 0 || minCitations > 0 || minImpactFactor > 0 || activeCategory !== 'all';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 头部 */}
      <Header onSearch={setSearchQuery} />

      {/* 英雄区域 - 包含分类卡片 */}
      <MaterialsHeroSection
        onCategoryClick={handleCategoryClick}
        activeCategory={activeCategory}
      />

      {/* 主内容区 - 单栏垂直流 */}
      <main className="flex-1" id="content-stream">
        <div className="container py-8 max-w-6xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-6">
            <h2 className="font-poppins font-bold text-3xl mb-2">
              {activeCategory === 'all'
                ? '最新研究'
                : MATERIAL_CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </h2>
            <p className="text-muted-foreground">
              {activeCategory === 'all'
                ? '汇聚五大材料领域的最新研究进展和学术成果'
                : MATERIAL_CATEGORIES.find((c) => c.id === activeCategory)?.description}
            </p>
          </div>

          {/* 控制栏 - 整合搜索和过滤 */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6 space-y-4">
            {/* 第一行：激活的过滤条件 + 搜索框 */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 激活的分类标签 */}
              {activeCategory !== 'all' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                  <span>{MATERIAL_CATEGORIES.find((c) => c.id === activeCategory)?.name}</span>
                  <button
                    onClick={() => setActiveCategory('all')}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 内联搜索框 */}
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="在当前分类中搜索标题、作者、关键词..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    🔍
                  </span>
                </div>
              </div>
            </div>

            {/* 第二行：过滤器和排序 */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                {/* 全部领域按钮 */}
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border hover:bg-muted'
                  }`}
                >
                  全部领域 ({MOCK_MATERIAL_ARTICLES.length})
                </button>

                <div className="h-6 w-px bg-border"></div>

                {/* 高级过滤按钮 */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-background border border-border hover:bg-muted transition-colors"
                >
                  高级过滤 {showAdvancedFilters ? '▲' : '▼'}
                </button>

                {/* 清除过滤 */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    清除所有过滤
                  </button>
                )}
              </div>

              {/* 排序选项 */}
              <select className="px-4 py-2 rounded-lg text-sm bg-background border border-border">
                <option>按相关性排序</option>
                <option>按日期排序</option>
                <option>按引用数排序</option>
              </select>
            </div>

            {/* 高级过滤面板 */}
            {showAdvancedFilters && (
              <div className="pt-4 border-t border-border space-y-4">
                {/* 研究方法过滤 */}
                <div>
                  <label className="block text-sm font-medium mb-2">研究方法</label>
                  <div className="flex flex-wrap gap-2">
                    {allMethods.map((method) => (
                      <button
                        key={method}
                        onClick={() => {
                          setSelectedMethods((prev) =>
                            prev.includes(method)
                              ? prev.filter((m) => m !== method)
                              : [...prev, method]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          selectedMethods.includes(method)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background border border-border hover:bg-muted'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 引用数和影响因子过滤 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">最小引用数</label>
                    <input
                      type="number"
                      min="0"
                      value={minCitations}
                      onChange={(e) => setMinCitations(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">最小影响因子</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={minImpactFactor}
                      onChange={(e) => setMinImpactFactor(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 结果统计 */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              共找到 <span className="font-semibold text-foreground">{filteredArticles.length}</span> 篇相关文章
            </p>
          </div>

          {/* 文章列表 */}
          <div className="max-w-4xl mx-auto">
            {filteredArticles.length > 0 ? (
              <div className="space-y-0">
                {filteredArticles.map((article) => (
                  <MaterialArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => handleArticleClick(article)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-poppins font-semibold text-lg mb-2">没有找到相关文章</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? '尝试更改搜索关键词或调整过滤条件'
                    : '敬请期待更多内容'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-md transition-shadow"
                  >
                    清除过滤条件
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 加载更多 */}
          {filteredArticles.length > 0 && (
            <div className="flex justify-center mt-8 mb-8">
              <button className="accent-button">加载更多</button>
            </div>
          )}
        </div>
      </main>

      {/* 页脚 */}
      <Footer />

      {/* 文章详情模态框 */}
      <MaterialArticleModal
        isOpen={isModalOpen}
        article={selectedArticle || undefined}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
