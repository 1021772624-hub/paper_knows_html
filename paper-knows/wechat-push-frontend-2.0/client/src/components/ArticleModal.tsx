import { X, Heart, Share2, MessageCircle, User, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ArticleModalProps {
  isOpen: boolean;
  article?: {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    category: string;
    author: string;
    date: string;
    thumbnail?: string;
    likes: number;
    comments: number;
  };
  onClose: () => void;
}

/**
 * 文章详情模态框 - 微信公众号风格
 * 设计理念：现代极简主义，流畅的打开/关闭动画
 * 特性：完整文章内容、交互按钮、响应式布局
 */
export default function ArticleModal({ isOpen, article, onClose }: ArticleModalProps) {
  const [isLiked, setIsLiked] = useState(false);

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div className="relative bg-card text-card-foreground rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X size={24} />
        </button>

        {/* 缩略图 */}
        {article.thumbnail && (
          <div className="w-full h-64 overflow-hidden">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 内容 */}
        <div className="p-6 md:p-8">
          {/* 分类和日期 */}
          <div className="flex items-center gap-3 mb-4">
            <span className="category-badge">{article.category}</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar size={16} />
              {article.date}
            </span>
          </div>

          {/* 标题 */}
          <h2 className="font-poppins font-bold text-3xl mb-4">{article.title}</h2>

          {/* 作者信息 */}
          <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm">
              {article.author.charAt(0)}
            </div>
            <div>
              <div className="font-medium">{article.author}</div>
              <div className="text-sm text-muted-foreground">{article.date}</div>
            </div>
          </div>

          {/* 摘要 */}
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          {/* 完整内容 */}
          <div className="prose prose-sm max-w-none mb-8">
            <p className="text-base leading-relaxed text-foreground">
              {article.content || article.excerpt}
            </p>
          </div>

          {/* 交互按钮 */}
          <div className="flex items-center gap-4 pt-6 border-t border-border">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Heart
                size={20}
                className={isLiked ? 'fill-accent text-accent' : 'text-muted-foreground'}
              />
              <span className="text-sm font-medium">{article.likes}</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
              <MessageCircle size={20} className="text-muted-foreground" />
              <span className="text-sm font-medium">{article.comments}</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors ml-auto">
              <Share2 size={20} className="text-muted-foreground" />
              <span className="text-sm font-medium">分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
