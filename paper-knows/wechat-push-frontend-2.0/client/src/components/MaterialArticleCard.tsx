import { Heart, Share2, Eye, BookOpen, Zap } from 'lucide-react';
import { useState } from 'react';
import type { MaterialArticle } from '@/types/materials';

interface MaterialArticleCardProps {
  article: MaterialArticle;
  onClick?: () => void;
}

/**
 * 材料科学研究文章卡片组件
 * 设计理念：展示学术指标、标签系统、研究方法
 * 特性：引用数、影响因子、研究方法标签、期刊信息
 */
export default function MaterialArticleCard({
  article,
  onClick,
}: MaterialArticleCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    }
  };

  return (
    <div
      className="article-card p-4 mb-4 cursor-pointer group hover:shadow-lg transition-all"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* 缩略图 */}
        {article.thumbnail && (
          <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-muted">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* 主要内容 */}
        <div className="flex-1 min-w-0">
          {/* 分类和期刊 */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="category-badge text-xs">{article.categoryLabel}</span>
            {article.journal && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {article.journal}
              </span>
            )}
          </div>

          {/* 标题 */}
          <h3 className="font-poppins font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {/* 摘要 */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {article.excerpt}
          </p>

          {/* 研究方法标签 */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {article.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                +{article.tags.length - 3}
              </span>
            )}
          </div>

          {/* 元数据行 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-3">
              <span>{article.author}</span>
              {article.affiliation && (
                <>
                  <span>•</span>
                  <span className="truncate">{article.affiliation}</span>
                </>
              )}
            </div>
            <span>{article.date}</span>
          </div>

          {/* 学术指标 */}
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            {/* 引用数 */}
            <div className="flex items-center gap-1 text-xs">
              <BookOpen size={14} className="text-blue-600" />
              <span className="font-medium text-foreground">{article.citations}</span>
              <span className="text-muted-foreground">引用</span>
            </div>

            {/* 影响因子 */}
            {article.impactFactor && (
              <div className="flex items-center gap-1 text-xs">
                <Zap size={14} className="text-amber-600" />
                <span className="font-medium text-foreground">{article.impactFactor}</span>
                <span className="text-muted-foreground">IF</span>
              </div>
            )}

            {/* 浏览数 */}
            <div className="flex items-center gap-1 text-xs">
              <Eye size={14} className="text-green-600" />
              <span className="font-medium text-foreground">{article.views}</span>
              <span className="text-muted-foreground">浏览</span>
            </div>

            {/* 右侧操作 */}
            <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleLike}
                className="p-1.5 hover:bg-accent/10 rounded-lg transition-colors"
                title="点赞"
              >
                <Heart
                  size={16}
                  className={isLiked ? 'fill-accent text-accent' : 'text-muted-foreground'}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
                title="分享"
              >
                <Share2 size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
