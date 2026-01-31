"""
PDF 导入服务
"""
import os
from pathlib import Path
from sqlalchemy.orm import Session
from models.paper import Paper
from fastapi import UploadFile
from services.pdf_parser import parse_pdf_metadata

def import_pdfs_from_folder(db: Session, folder_path: str = "data_paper_1"):
    """
    从指定文件夹导入所有 PDF 文件

    Args:
        db: 数据库会话
        folder_path: PDF 文件夹路径（相对于项目根目录）

    Returns:
        dict: {"imported": int, "skipped": int}
    """
    # 获取项目根目录（backend 的父目录）
    backend_dir = Path(__file__).parent.parent
    project_root = backend_dir.parent
    pdf_folder = project_root / folder_path

    imported = 0
    skipped = 0

    # 检查文件夹是否存在
    if not pdf_folder.exists():
        return {"imported": 0, "skipped": 0}

    # 扫描所有 PDF 文件
    for file_path in pdf_folder.glob("*.pdf"):
        # 获取相对路径（用于存储）
        relative_path = str(file_path.relative_to(project_root))

        # 检查是否已存在
        existing = db.query(Paper).filter(Paper.file_path == relative_path).first()

        if existing:
            skipped += 1
            continue

        # 创建新记录
        # 使用文件名（不含扩展名）作为标题
        title = file_path.stem

        new_paper = Paper(
            title=title,
            authors="Unknown",
            year=2024,
            category="未分类",
            file_path=relative_path,
            read=False,
            ai_analyzed=False,
            has_experiment_plan=False
        )

        db.add(new_paper)
        imported += 1

    # 提交事务
    db.commit()

    return {"imported": imported, "skipped": skipped}

async def upload_pdf(db: Session, file: UploadFile):
    """
    上传单个 PDF 文件并导入

    Args:
        db: 数据库会话
        file: 上传的文件

    Returns:
        dict: {"success": bool, "message": str, "paper_id": int}
    """
    # 验证文件类型
    if not file.filename.endswith('.pdf'):
        return {"success": False, "message": "只支持 PDF 文件"}

    # 获取项目根目录
    backend_dir = Path(__file__).parent.parent
    project_root = backend_dir.parent
    upload_folder = project_root / "data_paper_1"

    # 确保上传目录存在
    upload_folder.mkdir(exist_ok=True)

    # 保存文件
    file_path = upload_folder / file.filename
    relative_path = str(file_path.relative_to(project_root))

    # 检查是否已存在
    existing = db.query(Paper).filter(Paper.file_path == relative_path).first()
    if existing:
        return {"success": False, "message": "该文件已存在"}

    # 保存文件到磁盘
    try:
        contents = await file.read()
        with open(file_path, 'wb') as f:
            f.write(contents)
    except Exception as e:
        return {"success": False, "message": f"文件保存失败: {str(e)}"}

    # 解析 PDF 元数据
    try:
        metadata = parse_pdf_metadata(str(file_path))
        new_paper = Paper(
            title=metadata["title"],
            authors=metadata["authors"],
            year=2024,
            category="未分类",
            file_path=relative_path,
            source_filename=metadata["source_filename"],
            parse_method=metadata["parse_method"],
            parse_confidence=metadata["parse_confidence"],
            read=False,
            ai_analyzed=False,
            has_experiment_plan=False
        )
    except Exception as e:
        # 解析失败时使用文件名
        print(f"PDF 解析失败: {str(e)}")
        title = file.filename.replace('.pdf', '')
        new_paper = Paper(
            title=title,
            authors="Unknown",
            year=2024,
            category="未分类",
            file_path=relative_path,
            source_filename=file.filename,
            parse_method="filename",
            parse_confidence="low",
            read=False,
            ai_analyzed=False,
            has_experiment_plan=False
        )

    db.add(new_paper)
    db.commit()
    db.refresh(new_paper)

    return {"success": True, "message": "导入成功", "paper_id": new_paper.id}
