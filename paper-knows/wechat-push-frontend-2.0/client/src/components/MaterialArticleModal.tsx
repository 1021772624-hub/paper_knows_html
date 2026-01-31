import { X, Heart, Share2, Eye, BookOpen, Zap, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { MaterialArticle } from '@/types/materials';

interface MaterialArticleModalProps {
  isOpen: boolean;
  article?: MaterialArticle;
  onClose: () => void;
}

/**
 * 材料科学研究文章详情模态框
 * 设计理念：展示完整的学术信息、标签系统、引用指标
 * 特性：DOI 链接、期刊信息、研究方法标签、关键词
 */
export default function MaterialArticleModal({
  isOpen,
  article,
  onClose,
}: MaterialArticleModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const handleCopyDOI = () => {
    if (article.doi) {
      navigator.clipboard.writeText(article.doi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <div className="relative bg-card text-card-foreground rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
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
          {/* 分类和期刊 */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="category-badge">{article.categoryLabel}</span>
            {article.journal && (
              <span className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {article.journal}
              </span>
            )}
          </div>

          {/* 标题 */}
          <h2 className="font-poppins font-bold text-3xl mb-4">{article.title}</h2>

          {/* 作者信息 */}
          <div className="flex items-start gap-3 pb-4 border-b border-border mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {article.author.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{article.author}</div>
              {article.affiliation && (
                <div className="text-sm text-muted-foreground">{article.affiliation}</div>
              )}
              <div className="text-sm text-muted-foreground">{article.date}</div>
            </div>
          </div>

          {/* 学术指标卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BookOpen size={16} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{article.citations}</div>
              <div className="text-xs text-muted-foreground">引用次数</div>
            </div>
            {article.impactFactor && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap size={16} className="text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-foreground">{article.impactFactor}</div>
                <div className="text-xs text-muted-foreground">影响因子</div>
              </div>
            )}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye size={16} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-foreground">{article.views}</div>
              <div className="text-xs text-muted-foreground">浏览次数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{article.comments}</div>
              <div className="text-xs text-muted-foreground">讨论</div>
            </div>
          </div>

          {/* 期刊信息 */}
          {(article.volume || article.issue || article.doi) && (
            <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-3 text-foreground">期刊信息</h4>
              <div className="space-y-2 text-sm">
                {article.journal && (
                  <div>
                    <span className="text-muted-foreground">期刊：</span>
                    <span className="font-medium">{article.journal}</span>
                  </div>
                )}
                {article.volume && (
                  <div>
                    <span className="text-muted-foreground">卷号：</span>
                    <span className="font-medium">{article.volume}</span>
                  </div>
                )}
                {article.issue && (
                  <div>
                    <span className="text-muted-foreground">期号：</span>
                    <span className="font-medium">{article.issue}</span>
                  </div>
                )}
                {article.doi && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-muted-foreground">DOI：</span>
                      <span className="font-medium font-mono text-xs break-all">{article.doi}</span>
                    </div>
                    <button
                      onClick={handleCopyDOI}
                      className="ml-2 p-1 hover:bg-muted rounded transition-colors"
                      title="复制 DOI"
                    >
                      <Copy size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 研究方法标签 */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-foreground">研究方法</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-sm px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 关键词 */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-foreground">关键词</h4>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="text-sm px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 摘要 */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-foreground">摘要</h4>
            <p className="text-base leading-relaxed text-foreground">
              {article.excerpt}
            </p>
          </div>

          {/* 完整内容 */}
          {article.content && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-foreground">内容</h4>
              <p className="text-base leading-relaxed text-foreground">
                {article.content}
              </p>
            </div>
          )}

          {/* 交互按钮 */}
          <div className="flex items-center gap-4 pt-6 border-t border-border flex-wrap">
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
              <Share2 size={20} className="text-muted-foreground" />
              <span className="text-sm font-medium">分享</span>
            </button>

            {article.doi && (
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors ml-auto">
                <ExternalLink size={20} className="text-muted-foreground" />
                <span className="text-sm font-medium">查看原文</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
