/**
 * PREDICT.JS - 材料预测页面逻辑
 * 职责：预测配置、结果展示
 */

// 全局变量存储预测数据
let allPredictions = [];
let currentFilter = {
  materialSystem: '',
  targetProperty: ''
};

// 渲染统计卡片
function renderStats(stats) {
  const statCards = document.querySelectorAll('.stat-card-value');
  if (statCards.length >= 3) {
    statCards[0].textContent = stats.totalMaterials || 0;
    statCards[1].textContent = stats.highPotential || 0;
    statCards[2].textContent = stats.experimentalDirections || 0;
  }
}

// 渲染预测结果表格
function renderPredictionTable(predictions) {
  const tbody = document.querySelector('.content-table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!predictions || predictions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-muted" style="text-align: center; padding: 2rem;">暂无预测结果</td></tr>';
    return;
  }

  predictions.forEach(pred => {
    const row = document.createElement('tr');

    // 根据置信度设置徽章样式
    let badgeClass = 'badge-info';
    if (pred.confidence >= 90) badgeClass = 'badge-success';
    else if (pred.confidence < 80) badgeClass = 'badge-warning';

    row.innerHTML = `
      <td>
        <div class="material-name">
          <strong>${pred.materialName}</strong>
          <div class="material-desc">${pred.materialDesc}</div>
        </div>
      </td>
      <td>
        <div>${pred.predictedProperties.primary}</div>
        <div class="text-muted">${pred.predictedProperties.secondary}</div>
      </td>
      <td>
        <div class="confidence-wrapper">
          <span class="badge ${badgeClass}">${pred.confidence}%</span>
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${pred.confidence}%"></div>
          </div>
        </div>
      </td>
      <td>
        <div>${pred.experimentalDirections[0]}</div>
        <div class="text-muted">${pred.experimentalDirections[1] || ''}</div>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-primary" onclick="viewPredictionDetail('${pred.id}')">查看详情</button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// 查看预测详情（占位）
function viewPredictionDetail(predId) {
  console.log('查看预测详情:', predId);
  alert(`预测详情功能开发中\n预测ID: ${predId}`);
}

// 筛选预测结果
function filterPredictions() {
  let filtered = allPredictions;

  if (currentFilter.materialSystem) {
    filtered = filtered.filter(p => p.materialSystem === currentFilter.materialSystem);
  }

  if (currentFilter.targetProperty) {
    filtered = filtered.filter(p => p.targetProperty === currentFilter.targetProperty);
  }

  renderPredictionTable(filtered);
}

// 从 API 加载预测结果
async function loadPredictions() {
  try {
    const response = await fetch('api/predict/results.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.stats) {
      renderStats(data.stats);
    }

    if (data.predictions) {
      allPredictions = data.predictions;
      renderPredictionTable(data.predictions);
      console.log('预测结果已加载:', data.predictions.length, '条');
    }

  } catch (error) {
    console.error('加载预测结果失败:', error);
  }
}

// 启动预测
function initPredictButton() {
  const btn = document.getElementById('start-predict');
  if (!btn) return;

  btn.addEventListener('click', function() {
    // 获取配置参数
    const materialSystem = document.getElementById('material-system')?.value;
    const targetProperty = document.getElementById('target-property')?.value;
    const referenceScope = document.getElementById('reference-scope')?.value;
    const predictMode = document.getElementById('predict-mode')?.value;

    // 验证必填项
    if (!materialSystem || !targetProperty) {
      alert('请选择材料体系和目标性能指标');
      return;
    }

    console.log('启动预测，配置:', {
      materialSystem,
      targetProperty,
      referenceScope,
      predictMode
    });

    // 更新筛选条件
    currentFilter.materialSystem = materialSystem;
    currentFilter.targetProperty = targetProperty;

    // 模拟预测过程
    const originalHTML = this.innerHTML;
    this.innerHTML = '<span>🔮</span><span>预测中...</span>';
    this.disabled = true;

    setTimeout(() => {
      this.innerHTML = originalHTML;
      this.disabled = false;

      // 应用筛选
      filterPredictions();

      console.log('预测完成');
    }, 1500);
  });
}

// 初始化筛选器
function initFilters() {
  const materialSystemSelect = document.getElementById('material-system');
  const targetPropertySelect = document.getElementById('target-property');

  if (materialSystemSelect) {
    materialSystemSelect.addEventListener('change', function() {
      currentFilter.materialSystem = this.value;
      if (allPredictions.length > 0) {
        filterPredictions();
      }
    });
  }

  if (targetPropertySelect) {
    targetPropertySelect.addEventListener('change', function() {
      currentFilter.targetProperty = this.value;
      if (allPredictions.length > 0) {
        filterPredictions();
      }
    });
  }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
  loadPredictions();
  initPredictButton();
  initFilters();

  console.log('材料预测页面已初始化');
});
