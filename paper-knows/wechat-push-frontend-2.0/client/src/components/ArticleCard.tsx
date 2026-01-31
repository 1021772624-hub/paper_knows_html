import { Heart, Share2, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  thumbnail?: string;
  likes: number;
  comments: number;
  onClick?: () => void;
}

/**
 * 文章卡片组件 - 微信公众号风格
 * 设计理念：极简现代主义，强调内容优先，微妙的交互反馈
 * 特性：圆角卡片、细微阴影、悬停效果、分享和点赞功能
 */
export default function ArticleCard({
  id,
  title,
  excerpt,
  category,
  author,
  date,
  thumbnail,
  likes,
  comments,
  onClick,
}: ArticleCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: excerpt,
        url: window.location.href,
      });
    }
  };

  return (
    <div
      className="article-card p-4 mb-4 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* 缩略图 */}
        {thumbnail && (
          <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          {/* 分类标签 */}
          <div className="mb-2">
            <span className="category-badge text-xs">{category}</span>
          </div>

          {/* 标题 */}
          <h3 className="font-poppins font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* 摘要 */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {excerpt}
          </p>

          {/* 元数据 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{author}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleLike}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            title="点赞"
          >
            <Heart
              size={18}
              className={isLiked ? 'fill-accent text-accent' : 'text-muted-foreground'}
            />
          </button>
          <span className="text-xs text-muted-foreground">{likeCount}</span>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            title="分享"
          >
            <Share2 size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
