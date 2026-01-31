"""
文献同步服务 - 确保数据库与文件系统一致
"""
from pathlib import Path
from sqlalchemy.orm import Session
from models.paper import Paper
from services.pdf_parser import parse_pdf_metadata


def sync_papers_with_filesystem(db: Session, folder_path: str = "data_paper_1"):
    """
    同步文献数据与 PDF 文件夹
    - 删除所有无对应 PDF 文件的数据库记录
    - 添加文件夹中存在但数据库中没有的 PDF 文件

    Args:
        db: 数据库会话
        folder_path: PDF 文件夹路径（相对于项目根目录）

    Returns:
        dict: {"deleted": int, "added": int, "kept": int, "message": str}
    """
    # 获取项目根目录
    backend_dir = Path(__file__).parent.parent
    project_root = backend_dir.parent
    pdf_folder = project_root / folder_path

    # 获取所有实际存在的 PDF 文件路径（相对路径）
    existing_pdf_paths = set()
    if pdf_folder.exists():
        for pdf_file in pdf_folder.glob("*.pdf"):
            relative_path = str(pdf_file.relative_to(project_root))
            # 标准化路径分隔符（Windows 使用反斜杠）
            relative_path = relative_path.replace("\\", "/")
            existing_pdf_paths.add(relative_path)

    # 获取数据库中所有文献记录
    all_papers = db.query(Paper).all()
    db_file_paths = set()

    deleted_count = 0
    kept_count = 0

    # 第一步：检查每条记录对应的 PDF 是否存在，删除无效记录
    for paper in all_papers:
        if paper.file_path:
            # 标准化数据库中的路径
            normalized_path = paper.file_path.replace("\\", "/")
            db_file_paths.add(normalized_path)

            # 检查文件是否实际存在
            if normalized_path not in existing_pdf_paths:
                # PDF 文件不存在，删除数据库记录
                db.delete(paper)
                deleted_count += 1
            else:
                kept_count += 1
        else:
            # 没有 file_path 的记录也删除（数据不完整）
            db.delete(paper)
            deleted_count += 1

    # 第二步：添加文件夹中存在但数据库中没有的 PDF
    added_count = 0
    for pdf_path in existing_pdf_paths:
        if pdf_path not in db_file_paths:
            # 解析 PDF 元数据
            full_pdf_path = project_root / pdf_path
            try:
                metadata = parse_pdf_metadata(str(full_pdf_path))

                # 创建新记录
                new_paper = Paper(
                    title=metadata["title"],
                    authors=metadata["authors"],
                    year=2024,
                    category="未分类",
                    file_path=pdf_path,
                    source_filename=metadata["source_filename"],
                    parse_method=metadata["parse_method"],
                    parse_confidence=metadata["parse_confidence"],
                    read=False,
                    ai_analyzed=False,
                    has_experiment_plan=False
                )
                db.add(new_paper)
                added_count += 1
                print(f"[PDF 解析] {metadata['source_filename']}: {metadata['title'][:50]}... (方法: {metadata['parse_method']}, 置信度: {metadata['parse_confidence']})")
            except Exception as e:
                print(f"[PDF 解析失败] {pdf_path}: {str(e)}")
                # 解析失败时使用文件名
                filename = Path(pdf_path).name
                new_paper = Paper(
                    title=filename.replace('.pdf', ''),
                    authors="Unknown",
                    year=2024,
                    category="未分类",
                    file_path=pdf_path,
                    source_filename=filename,
                    parse_method="filename",
                    parse_confidence="low",
                    read=False,
                    ai_analyzed=False,
                    has_experiment_plan=False
                )
                db.add(new_paper)
                added_count += 1

    # 提交所有更改
    db.commit()

    return {
        "deleted": deleted_count,
        "added": added_count,
        "kept": kept_count,
        "message": f"同步完成：保留 {kept_count} 篇，新增 {added_count} 篇，删除 {deleted_count} 条无效记录"
    }
