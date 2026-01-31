/**
 * 材料科学研究平台 - 英雄区域
 * 设计理念：专业学术平台，展示五大材料领域，分类卡片可点击
 */

interface MaterialsHeroSectionProps {
  onCategoryClick?: (categoryId: string) => void;
  activeCategory?: string;
}

export default function MaterialsHeroSection({ onCategoryClick, activeCategory = 'all' }: MaterialsHeroSectionProps) {
  const categories = [
    { id: 'metal', icon: '⚙️', name: '金属材料', count: 32 },
    { id: 'polymer', icon: '🧬', name: '高分子材料', count: 28 },
    { id: 'ceramic', icon: '🏺', name: '陶瓷材料', count: 24 },
    { id: 'composite', icon: '🔗', name: '复合材料', count: 26 },
    { id: 'semiconductor', icon: '💾', name: '半导体材料', count: 30 },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 md:py-16">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
      </div>

      {/* 内容 */}
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* 主标题 */}
          <h1 className="font-poppins font-bold text-3xl md:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            材料科学研究推送平台
          </h1>

          {/* 副标题 */}
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            汇聚全球材料科学领域的最新研究进展、学术论文和技术突破。
            为研究人员和学生提供精准的学术信息推送服务。
          </p>

          {/* 五大材料领域 - 可点击的分类卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick?.(category.id)}
                className={`p-3 rounded-lg shadow-sm border transition-all text-left ${
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                    : 'bg-white border-border hover:shadow-md hover:scale-105'
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className={`font-medium text-sm ${
                  activeCategory === category.id ? 'text-primary-foreground' : 'text-foreground'
                }`}>
                  {category.name}
                </div>
                <div className={`text-xs ${
                  activeCategory === category.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {category.count} 篇
                </div>
              </button>
            ))}
          </div>

          {/* 特性列表 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-600">
                  📊
                </div>
              </div>
              <div>
                <h3 className="font-medium text-foreground">学术指标</h3>
                <p className="text-sm text-muted-foreground">显示引用数、影响因子等关键指标</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-100 text-purple-600">
                  🏷️
                </div>
              </div>
              <div>
                <h3 className="font-medium text-foreground">标签系统</h3>
                <p className="text-sm text-muted-foreground">按研究方法和关键词精准分类</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-green-100 text-green-600">
                  🔍
                </div>
              </div>
              <div>
                <h3 className="font-medium text-foreground">高级搜索</h3>
                <p className="text-sm text-muted-foreground">多维度过滤和搜索功能</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
