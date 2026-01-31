#!/bin/bash
# Script to create the complete material-prediction.html file

cat > material-prediction.html << 'ENDHTML'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第五范式材料发现平台 - AI4Science固态电解质</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', 'Noto Sans SC', sans-serif;
            background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%);
            min-height: 100vh;
        }

        /* 柔和阴影 */
        .soft-shadow {
            box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.02);
        }

        .hover-shadow {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-shadow:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            transform: translateY(-2px);
        }

        /* 渐变文字 */
        .gradient-text {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* 玻璃拟态卡片 */
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.6);
        }

        /* 动画 */
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }

        @keyframes pulse-soft {
            0%, 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.2); }
            50% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
        }
        .pulse-ring { animation: pulse-soft 2s infinite; }

        /* 流程线 */
        .flow-line {
            position: relative;
        }
        .flow-line::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -2rem;
            width: 2rem;
            height: 2px;
            background: linear-gradient(90deg, #cbd5e1 0%, #94a3b8 100%);
            transform: translateY(-50%);
        }
        @media (max-width: 768px) {
            .flow-line::after { display: none; }
        }

        /* 自定义滚动条 */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

        /* 标签样式 */
        .tag {
            @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
        }
    </style>
</head>
ENDHTML

echo "HTML file created successfully"
