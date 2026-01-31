import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { CategoryInfo } from '@/types/materials';

interface MaterialCategoryNavProps {
  categories: CategoryInfo[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

/**
 * 材料科学研究分类导航组件
 * 设计理念：展示材料领域分类，支持响应式设计
 * 特性：分类图标、文章计数、颜色编码
 */
export default function MaterialCategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
}: MaterialCategoryNavProps) {
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
          fixed lg:static lg:translate-x-0 lg:w-72 lg:h-screen lg:bg-sidebar lg:border-r lg:border-sidebar-border
          bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 ease-in-out
          z-30 top-16 left-0 bottom-0 w-72
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          overflow-y-auto
        `}
      >
        <nav className="p-4 space-y-2">
          {/* 全部分类 */}
          <button
            onClick={() => {
              onCategoryChange('all');
              setIsOpen(false);
            }}
            className={`
              w-full px-4 py-3 rounded-lg text-left font-medium transition-all
              flex items-center justify-between group
              ${
                activeCategory === 'all'
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              全部领域
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </span>
          </button>

          {/* 分割线 */}
          <div className="border-t border-sidebar-border my-2" />

          {/* 材料领域分类 */}
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
              <span className="flex items-center gap-3">
                <span className="text-lg">{category.icon}</span>
                <div>
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-xs opacity-75">{category.description}</div>
                </div>
              </span>
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
