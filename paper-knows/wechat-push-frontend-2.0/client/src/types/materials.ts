/**
 * 材料科学研究推送平台 - 数据类型定义
 */

export type MaterialCategory = 'metal' | 'polymer' | 'ceramic' | 'composite' | 'semiconductor';

export type ResearchMethod = 
  | '实验研究' 
  | '理论计算' 
  | '计算模拟' 
  | '综述分析' 
  | '表征分析'
  | '性能评估'
  | '工艺开发';

export interface MaterialArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: MaterialCategory;
  categoryLabel: string;
  author: string;
  affiliation?: string; // 作者单位
  date: string;
  thumbnail?: string;
  
  // 学术指标
  citations: number; // 引用数
  impactFactor?: number; // 影响因子
  journal?: string; // 期刊名称
  volume?: string; // 卷号
  issue?: string; // 期号
  doi?: string; // DOI
  
  // 标签系统
  tags: ResearchMethod[]; // 研究方法标签
  keywords: string[]; // 关键词
  
  // 交互数据
  likes: number;
  comments: number;
  views: number; // 浏览数
}

export interface CategoryInfo {
  id: MaterialCategory;
  name: string;
  label: string;
  icon: string;
  color: string; // Tailwind 颜色类
  description: string;
  count: number;
}

export interface ResearchMethodTag {
  id: string;
  label: ResearchMethod;
  icon?: string;
  color: string;
}
