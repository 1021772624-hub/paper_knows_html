"""
文献相关路由
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pathlib import Path
from database import get_db
from models.paper import Paper
from services.paper_service import import_pdfs_from_folder, upload_pdf
from services.ai_service import analyze_paper
from services.sync_service import sync_papers_with_filesystem

router = APIRouter(prefix="/api", tags=["papers"])

@router.get("/papers")
def get_papers(db: Session = Depends(get_db)):
    """
    获取所有文献列表
    """
    papers = db.query(Paper).all()

    # 统计信息
    total_papers = len(papers)
    read_papers = len([p for p in papers if p.read])
    ai_analyzed = len([p for p in papers if p.ai_analyzed])
    experiment_plans = len([p for p in papers if p.has_experiment_plan])

    return {
        "stats": {
            "total": total_papers,
            "read": read_papers,
            "ai_analyzed": ai_analyzed,
            "experiment_plans": experiment_plans
        },
        "papers": [paper.to_dict() for paper in papers]
    }

@router.post("/papers/import")
def import_papers(db: Session = Depends(get_db)):
    """
    从 data_paper_1 文件夹导入 PDF 文件
    """
    result = import_pdfs_from_folder(db)
    return result

@router.post("/papers/upload")
async def upload_paper(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    上传单个 PDF 文件
    """
    result = await upload_pdf(db, file)

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return result

@router.post("/papers/{paper_id}/analyze")
def analyze_paper_endpoint(
    paper_id: int,
    force_reanalyze: bool = False,
    db: Session = Depends(get_db)
):
    """
    AI 分析文献

    Args:
        paper_id: 文献 ID
        force_reanalyze: 是否强制重新分析（默认 False，会使用缓存）
    """
    result = analyze_paper(db, paper_id, force_reanalyze=force_reanalyze)

    if result is None:
        raise HTTPException(status_code=404, detail="文献不存在")

    return result

@router.post("/papers/sync")
def sync_papers(db: Session = Depends(get_db)):
    """
    同步文献数据与 PDF 文件夹
    删除所有无对应 PDF 文件的数据库记录
    """
    result = sync_papers_with_filesystem(db)

    # 同步完成后，返回最新的文献列表
    papers = db.query(Paper).all()

    # 重新计算统计信息
    total_papers = len(papers)
    read_papers = len([p for p in papers if p.read])
    ai_analyzed = len([p for p in papers if p.ai_analyzed])
    experiment_plans = len([p for p in papers if p.has_experiment_plan])

    return {
        "sync_result": result,
        "stats": {
            "total": total_papers,
            "read": read_papers,
            "ai_analyzed": ai_analyzed,
            "experiment_plans": experiment_plans
        },
        "papers": [paper.to_dict() for paper in papers]
    }

@router.patch("/papers/{paper_id}/read")
def toggle_read_status(paper_id: int, db: Session = Depends(get_db)):
    """
    切换文献的已读/未读状态
    """
    paper = db.query(Paper).filter(Paper.id == paper_id).first()

    if not paper:
        raise HTTPException(status_code=404, detail="文献不存在")

    # 切换已读状态
    paper.read = not paper.read
    db.commit()
    db.refresh(paper)

    # 返回更新后的文献信息和最新统计
    papers = db.query(Paper).all()
    total_papers = len(papers)
    read_papers = len([p for p in papers if p.read])
    ai_analyzed = len([p for p in papers if p.ai_analyzed])
    experiment_plans = len([p for p in papers if p.has_experiment_plan])

    return {
        "paper": paper.to_dict(),
        "stats": {
            "total": total_papers,
            "read": read_papers,
            "ai_analyzed": ai_analyzed,
            "experiment_plans": experiment_plans
        }
    }

@router.get("/papers/{paper_id}/pdf")
def get_paper_pdf(paper_id: int, db: Session = Depends(get_db)):
    """
    获取文献的 PDF 文件
    """
    paper = db.query(Paper).filter(Paper.id == paper_id).first()

    if not paper:
        raise HTTPException(status_code=404, detail="文献不存在")

    if not paper.file_path:
        raise HTTPException(status_code=404, detail="该文献没有关联的 PDF 文件")

    # 构建完整的文件路径
    backend_dir = Path(__file__).parent.parent
    project_root = backend_dir.parent
    pdf_path = project_root / paper.file_path

    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail=f"PDF 文件不存在: {paper.file_path}")

    # 返回 PDF 文件
    return FileResponse(
        path=str(pdf_path),
        media_type="application/pdf",
        filename=paper.source_filename or f"paper_{paper_id}.pdf"
    )

