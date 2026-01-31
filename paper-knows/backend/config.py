"""
配置文件
"""

# 数据库配置
DATABASE_URL = "sqlite:///./data/papers.db"

# CORS 配置
CORS_ORIGINS = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "*"  # 开发阶段允许所有来源
]

# AI 配置
ANTHROPIC_API_KEY = "cr_1977cd35b4c8f0de5758dec6c24792c4155602d58018c8a380cd9d343fdbf651"
CLAUDE_MODEL = "claude-sonnet-4-5-20250929"  # Claude Sonnet 4.5
