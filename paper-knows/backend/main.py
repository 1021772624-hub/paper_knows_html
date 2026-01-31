"""
FastAPI 应用入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from routes import papers
from database import Base, engine, get_db
from models import paper
from services.sync_service import sync_papers_with_filesystem

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建 FastAPI 应用
app = FastAPI(
    title="Paper Knows API",
    description="材知道后端 API",
    version="0.2.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 开发阶段：全部允许
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 应用启动时自动同步文献
@app.on_event("startup")
def startup_sync():
    """应用启动时自动同步文献数据与文件系统"""
    db = next(get_db())
    try:
        result = sync_papers_with_filesystem(db)
        print(f"[启动同步] {result['message']}")
    except Exception as e:
        print(f"[启动同步失败] {str(e)}")
    finally:
        db.close()

# 注册路由
app.include_router(papers.router)

# 根路径
@app.get("/")
def root():
    return {
        "message": "Paper Knows API",
        "version": "0.2.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
