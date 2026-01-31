/**
 * 页脚组件 - 微信公众号推送栏目
 * 设计理念：极简现代，提供必要的链接和信息
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border mt-16">
      <div className="container py-12">
        {/* 主内容 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 品牌信息 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-sm">W</span>
              </div>
              <span className="font-poppins font-bold">推送栏目</span>
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              精选内容推送平台，汇聚优质内容。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  分类
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  订阅
                </a>
              </li>
            </ul>
          </div>

          {/* 分类 */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">热门分类</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  技术
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  设计
                </a>
              </li>
              <li>
                <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">
                  生活
                </a>
              </li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h4 className="font-poppins font-semibold mb-4">关注我们</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-sidebar-accent hover:bg-primary text-sidebar-accent-foreground hover:text-primary-foreground flex items-center justify-center transition-colors"
                title="微信"
              >
                微
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-sidebar-accent hover:bg-primary text-sidebar-accent-foreground hover:text-primary-foreground flex items-center justify-center transition-colors"
                title="微博"
              >
                博
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-sidebar-accent hover:bg-primary text-sidebar-accent-foreground hover:text-primary-foreground flex items-center justify-center transition-colors"
                title="抖音"
              >
                抖
              </a>
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-sidebar-border my-8" />

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-sidebar-foreground/60">
          <p>&copy; {currentYear} 推送栏目. 保留所有权利。</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">
              隐私政策
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              服务条款
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
