import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

/**
 * 分类导航组件 - 微信公众号风格
 * 设计理念：左侧导航栏，响应式设计，移动端可折叠
 * 特性：分类列表、活跃状态指示、计数显示
 */
export default function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 侧边栏 */}
      <aside
        className={`
          fixed lg:static lg:translate-x-0 lg:w-64 lg:h-screen lg:bg-sidebar lg:border-r lg:border-sidebar-border
          bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 ease-in-out
          z-30 top-16 left-0 bottom-0 w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          overflow-y-auto
        `}
      >
        <nav className="p-4 space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 rounded-lg text-left font-medium transition-all
                flex items-center justify-between group
                ${
                  activeCategory === category.id
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }
              `}
            >
              <span className="flex items-center gap-2">
                {category.icon && <span className="text-lg">{category.icon}</span>}
                {category.name}
              </span>
              {category.count !== undefined && (
                <span
                  className={`
                    text-xs px-2 py-1 rounded-full
                    ${
                      activeCategory === category.id
                        ? 'bg-sidebar-primary-foreground/20'
                        : 'bg-sidebar-accent text-sidebar-accent-foreground'
                    }
                  `}
                >
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-20 top-16"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
