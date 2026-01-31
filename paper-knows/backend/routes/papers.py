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
def get_papers(show_deleted: bool = False, db: Session = Depends(get_db)):
    """
    获取所有文献列表

    Args:
        show_deleted: 是否显示已删除的文献（回收站）
    """
    if show_deleted:
        # 只返回回收站中的文献
        papers = db.query(Paper).filter(Paper.is_deleted == True).all()
    else:
        # 只返回未删除的文献
        papers = db.query(Paper).filter(Paper.is_deleted == False).all()

    # 统计信息（只统计未删除的文献）
    active_papers = db.query(Paper).filter(Paper.is_deleted == False).all()
    total_papers = len(active_papers)
    read_papers = len([p for p in active_papers if p.read])
    ai_analyzed = len([p for p in active_papers if p.ai_analyzed])
    experiment_plans = len([p for p in active_papers if p.has_experiment_plan])

    # 回收站统计
    deleted_papers = db.query(Paper).filter(Paper.is_deleted == True).all()
    trash_count = len(deleted_papers)

    return {
        "stats": {
            "total": total_papers,
            "read": read_papers,
            "ai_analyzed": ai_analyzed,
            "experiment_plans": experiment_plans,
            "trash": trash_count
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

@router.post("/papers/{paper_id}/refresh-analysis")
def refresh_analysis_endpoint(
    paper_id: int,
    db: Session = Depends(get_db)
):
    """
    刷新分析显示快照

    不重新调用 AI API，而是基于已有的分析结果重建显示快照。
    用于更新显示格式、版本号等，而不消耗 API 额度。

    Args:
        paper_id: 文献 ID
    """
    from services.ai_service import refresh_analysis_snapshot

    result = refresh_analysis_snapshot(db, paper_id)

    if result is None:
        raise HTTPException(status_code=404, detail="文献不存在或尚未分析")

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

@router.delete("/papers/{paper_id}")
def delete_paper(paper_id: int, permanent: bool = False, db: Session = Depends(get_db)):
    """
    删除文献（软删除到回收站，或永久删除）

    Args:
        paper_id: 文献 ID
        permanent: 是否永久删除（默认False，移到回收站）
    """
    import os
    from datetime import datetime

    paper = db.query(Paper).filter(Paper.id == paper_id).first()

    if not paper:
        raise HTTPException(status_code=404, detail="文献不存在")

    if permanent:
        # 永久删除：删除 PDF 文件和数据库记录
        if paper.file_path:
            backend_dir = Path(__file__).parent.parent
            project_root = backend_dir.parent
            pdf_path = project_root / paper.file_path

            if pdf_path.exists():
                try:
                    os.remove(str(pdf_path))
                except Exception as e:
                    print(f"删除 PDF 文件失败: {str(e)}")

        # 删除数据库记录
        db.delete(paper)
        db.commit()
        message = f"文献 {paper_id} 已永久删除"
    else:
        # 软删除：标记为已删除
        paper.is_deleted = True
        paper.deleted_at = datetime.utcnow()
        db.commit()
        db.refresh(paper)
        message = f"文献 {paper_id} 已移至回收站"

    # 返回最新的文献列表和统计（只包含未删除的）
    active_papers = db.query(Paper).filter(Paper.is_deleted == False).all()
    total_papers = len(active_papers)
    read_papers = len([p for p in active_papers if p.read])
    ai_analyzed = len([p for p in active_papers if p.ai_analyzed])
    experiment_plans = len([p for p in active_papers if p.has_experiment_plan])

    # 回收站统计
    deleted_papers = db.query(Paper).filter(Paper.is_deleted == True).all()
    trash_count = len(deleted_papers)

    return {
        "success": True,
        "message": message,
        "stats": {
            "total": total_papers,
            "read": read_papers,
            "ai_analyzed": ai_analyzed,
            "experiment_plans": experiment_plans,
            "trash": trash_count
        },
        "papers": [paper.to_dict() for paper in active_papers]
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

    # 返回 PDF 文件（在浏览器中直接打开）
    return FileResponse(
        path=str(pdf_path),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename=\"{paper.source_filename or f'paper_{paper_id}.pdf'}\""
        }
    )

@router.post("/papers/{paper_id}/restore")
def restore_paper(paper_id: int, db: Session = Depends(get_db)):
    """
    从回收站恢复文献

    Args:
        paper_id: 文献 ID
    """
    paper = db.query(Paper).filter(Paper.id == paper_id).first()

    if not paper:
        raise HTTPException(status_code=404, detail="文献不存在")

    if not paper.is_deleted:
        raise HTTPException(status_code=400, detail="该文献不在回收站中")

    # 恢复文献
    paper.is_deleted = False
    paper.deleted_at = None
    db.commit()
    db.refresh(paper)

    # 返回最新的统计
    active_papers = db.query(Paper).filter(Paper.is_deleted == False).all()
    total_papers = len(active_papers)
    read_papers = len([p for p in active_papers if p.read])
    ai_analyzed = len([p for p in active_papers if p.ai_analyzed])
    experiment_plans = len([p for p in active_papers if p.has_experiment_plan])

    # 回收站统计
    deleted_papers = db.query(Paper).filter(Paper.is_deleted == True).all()
    trash_count = len(deleted_papers)

    return {
        "success": True,
        "message": f"文献 {paper_id} 已恢复",
        "stats": {
            "total": total_papers,
            "read": read_papers,
            "ai_analyzed": ai_analyzed,
            "experiment_plans": experiment_plans,
            "trash": trash_count
        },
        "paper": paper.to_dict()
    }

@router.post("/papers/trash/empty")
def empty_trash(db: Session = Depends(get_db)):
    """
    清空回收站（永久删除所有回收站中的文献）
    """
    import os

    # 获取所有回收站中的文献
    deleted_papers = db.query(Paper).filter(Paper.is_deleted == True).all()

    if not deleted_papers:
        return {
            "success": True,
            "message": "回收站已经是空的",
            "deleted_count": 0
        }

    # 删除所有 PDF 文件和数据库记录
    deleted_count = 0
    for paper in deleted_papers:
        # 删除 PDF 文件
        if paper.file_path:
            backend_dir = Path(__file__).parent.parent
            project_root = backend_dir.parent
            pdf_path = project_root / paper.file_path

            if pdf_path.exists():
                try:
                    os.remove(str(pdf_path))
                except Exception as e:
                    print(f"删除 PDF 文件失败: {str(e)}")

        # 删除数据库记录
        db.delete(paper)
        deleted_count += 1

    db.commit()

    # 返回最新的统计
    active_papers = db.query(Paper).filter(Paper.is_deleted == False).all()
    total_papers = len(active_papers)
    read_papers = len([p for p in active_papers if p.read])
    ai_analyzed = len([p for p in active_papers if p.ai_analyzed])
    experiment_plans = len([p for p in active_papers if p.has_experiment_plan])

    return {
        "success": True,
        "message": f"已永久删除 {deleted_count} 篇文献",
        "deleted_count": deleted_count,
        "stats": {
            "total": total_papers,
            "read": read_papers,
            "ai_analyzed": ai_analyzed,
            "experiment_plans": experiment_plans,
            "trash": 0
        }
    }
