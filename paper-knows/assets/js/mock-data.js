/**
 * MOCK-DATA.JS - Mock 数据管理
 * 职责：集中管理所有页面的 mock 数据
 */

// 文献库数据
const mockPapers = [
  {
    id: 'paper_001',
    title: 'Effect of Heat Treatment on Microstructure and Mechanical Properties of Stoichiometric SiC/SiC Composites',
    authors: 'Takashi Nozawa 等',
    year: 2004,
    importDate: '2026-01-29',
    category: '材料科学',
    status: 'read',
    hasAIAnalysis: true,
    hasExperiment: true
  },
  {
    id: 'paper_002',
    title: 'A NEW APPROACH TO DETERMINE AND EVALUATE THE POISSON\'S RATIO OF WOOD',
    authors: 'Klara Winter 等',
    year: 2026,
    importDate: '2026-01-29',
    category: '材料科学',
    status: 'unread',
    hasAIAnalysis: true,
    hasExperiment: true
  }
];

// 推荐数据
const mockRecommendations = [
  {
    id: 'rec_001',
    type: 'paper',
    title: 'Advanced Characterization of SiC/SiC Composites for Nuclear Applications',
    matchScore: 95,
    authors: 'John Smith 等',
    year: 2025,
    tags: ['ceramic composites', 'nuclear materials'],
    reason: '与您近期阅读的 SiC/SiC 复合材料研究高度相关，该文献深入探讨了核能应用场景下的材料表征方法。'
  },
  {
    id: 'rec_002',
    type: 'direction',
    title: '木材复合材料的多尺度力学建模',
    matchScore: 88,
    relatedPapers: 23,
    reason: '基于您对木材泊松比测定的研究兴趣，该方向结合有限元分析与实验验证，具有较高的研究价值。'
  }
];

// 预测数据
const mockPredictions = [
  {
    id: 'pred_001',
    materialName: 'SiC/SiC-BN 复合界面层材料',
    description: '基于 CVI+PIP 混合工艺',
    properties: {
      strength: '450-520 MPa',
      oxidationTemp: '1400-1500 K'
    },
    confidence: 92,
    experiments: [
      '界面层厚度优化（50-150nm）',
      '热处理温度窗口研究（1773-1873K）'
    ]
  },
  {
    id: 'pred_002',
    materialName: '改性云杉木材复合材料',
    description: '泊松比优化设计',
    properties: {
      poissonRatio: '0.42-0.48',
      elasticModulus: '12-15 GPa'
    },
    confidence: 85,
    experiments: [
      '压缩试验方法验证',
      '多尺度力学建模'
    ]
  }
];

// 统计数据
const mockStats = {
  totalPapers: 6,
  readPapers: 1,
  aiAnalyzed: 6,
  experimentPlans: 6,
  recommendations: {
    papers: 12,
    directions: 5,
    experiments: 8
  },
  predictions: {
    materials: 18,
    highPotential: 5,
    experiments: 3
  }
};

// 导出数据（供页面使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mockPapers, mockRecommendations, mockPredictions, mockStats };
}
