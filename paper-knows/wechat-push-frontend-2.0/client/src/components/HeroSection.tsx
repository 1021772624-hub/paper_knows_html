/**
 * 英雄区域组件 - 微信公众号推送栏目
 * 设计理念：现代极简主义，使用生成的高质量背景图
 * 特性：渐变背景、品牌信息、号召性按钮
 */

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 md:py-24">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* 内容 */}
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* 主标题 */}
          <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            精选内容推送平台
          </h1>

          {/* 副标题 */}
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            汇聚技术、设计、生活、商业等多个领域的优质内容。
            订阅感兴趣的分类，每天获取精选推送。
          </p>

          {/* 特性列表 */}
          <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
            <div className="p-3 bg-white rounded-lg shadow-sm border border-border">
              <div className="text-2xl mb-1">📰</div>
              <div className="font-medium text-foreground">128+ 文章</div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm border border-border">
              <div className="text-2xl mb-1">🏷️</div>
              <div className="font-medium text-foreground">5 分类</div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm border border-border">
              <div className="text-2xl mb-1">⚡</div>
              <div className="font-medium text-foreground">实时更新</div>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-shadow">
              开始浏览
            </button>
            <button className="px-8 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
              订阅更新
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
