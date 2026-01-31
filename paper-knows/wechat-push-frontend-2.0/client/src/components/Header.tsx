import { Search, Bell } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

/**
 * 头部导航组件 - 微信公众号风格
 * 设计理念：极简现代，强调搜索功能和通知
 * 特性：搜索框、通知按钮、品牌标识
 */
export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-20 bg-card text-card-foreground border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* 品牌标识 */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
            <span className="text-white font-poppins font-bold text-lg">W</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-poppins font-bold text-lg">推送栏目</h1>
            <p className="text-xs text-muted-foreground">精选内容推送</p>
          </div>
        </div>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* 右侧操作 */}
        <div className="flex items-center gap-4">
          {/* 通知按钮 */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell size={20} />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
            )}
          </button>

          {/* 用户菜单 */}
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-poppins font-bold text-sm hover:shadow-md transition-shadow">
            用
          </button>
        </div>
      </div>

      {/* 移动端搜索框 */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search size={18} />
          </button>
        </form>
      </div>
    </header>
  );
}
