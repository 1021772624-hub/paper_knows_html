import { Search, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ResearchMethod } from '@/types/materials';

interface AdvancedSearchProps {
  onSearch: (query: string) => void;
  onFilterByMethod: (methods: ResearchMethod[]) => void;
  onFilterByCitations: (minCitations: number) => void;
  onFilterByImpactFactor: (minIF: number) => void;
  researchMethods: ResearchMethod[];
}

/**
 * 高级搜索和过滤组件
 * 设计理念：提供多维度的搜索和过滤功能
 * 特性：关键词搜索、研究方法过滤、学术指标过滤
 */
export default function AdvancedSearch({
  onSearch,
  onFilterByMethod,
  onFilterByCitations,
  onFilterByImpactFactor,
  researchMethods,
}: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<ResearchMethod[]>([]);
  const [minCitations, setMinCitations] = useState(0);
  const [minImpactFactor, setMinImpactFactor] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleMethodToggle = (method: ResearchMethod) => {
    const updated = selectedMethods.includes(method)
      ? selectedMethods.filter((m) => m !== method)
      : [...selectedMethods, method];
    setSelectedMethods(updated);
    onFilterByMethod(updated);
  };

  const handleCitationsChange = (value: number) => {
    setMinCitations(value);
    onFilterByCitations(value);
  };

  const handleImpactFactorChange = (value: number) => {
    setMinImpactFactor(value);
    onFilterByImpactFactor(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMethods([]);
    setMinCitations(0);
    setMinImpactFactor(0);
    onSearch('');
    onFilterByMethod([]);
    onFilterByCitations(0);
    onFilterByImpactFactor(0);
  };

  const hasActiveFilters = searchQuery || selectedMethods.length > 0 || minCitations > 0 || minImpactFactor > 0;

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm mb-6">
      {/* 搜索栏 */}
      <form onSubmit={handleSearch} className="p-4 border-b border-border">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="搜索论文标题、作者、关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-md transition-shadow"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {/* 高级过滤 */}
      <div className="p-4">
        {/* 展开/收起按钮 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronDown
            size={18}
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
          高级过滤
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
              {[selectedMethods.length > 0 ? 1 : 0, minCitations > 0 ? 1 : 0, minImpactFactor > 0 ? 1 : 0].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>

        {isExpanded && (
          <div className="space-y-4">
            {/* 研究方法过滤 */}
            <div>
              <h4 className="text-sm font-semibold mb-2 text-foreground">研究方法</h4>
              <div className="flex flex-wrap gap-2">
                {researchMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => handleMethodToggle(method)}
                    className={`
                      text-xs px-3 py-1.5 rounded-full transition-all
                      ${
                        selectedMethods.includes(method)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-secondary'
                      }
                    `}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* 引用数过滤 */}
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">
                最少引用数：{minCitations}
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="50"
                value={minCitations}
                onChange={(e) => handleCitationsChange(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>500+</span>
              </div>
            </div>

            {/* 影响因子过滤 */}
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">
                最少影响因子：{minImpactFactor.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minImpactFactor}
                onChange={(e) => handleImpactFactorChange(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>10+</span>
              </div>
            </div>

            {/* 清除过滤 */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-secondary transition-colors text-sm"
              >
                <X size={16} />
                清除所有过滤
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
