"""
PDF 元数据解析服务
采用三层解析策略：文件名 → PDF 文本 → AI 兜底
"""
import re
from pathlib import Path
import fitz  # PyMuPDF


def parse_pdf_metadata(pdf_path: str):
    """
    解析 PDF 文件的标题和作者信息

    Args:
        pdf_path: PDF 文件的完整路径

    Returns:
        dict: {
            "title": str,
            "authors": str,
            "source_filename": str,
            "parse_method": str,  # filename / pdf / ai
            "parse_confidence": str  # low / medium / high
        }
    """
    pdf_file = Path(pdf_path)
    filename = pdf_file.stem  # 不含扩展名的文件名

    result = {
        "title": "",
        "authors": "Unknown",
        "source_filename": pdf_file.name,
        "parse_method": "filename",
        "parse_confidence": "low"
    }

    # Step 1: 从文件名解析标题
    title_from_filename = parse_title_from_filename(filename)
    if title_from_filename:
        result["title"] = title_from_filename
        result["parse_method"] = "filename"
        result["parse_confidence"] = "low"

    # Step 2: 从 PDF 首页解析
    try:
        pdf_metadata = parse_pdf_first_page(pdf_path)
        if pdf_metadata["title"]:
            result["title"] = pdf_metadata["title"]
            result["parse_method"] = "pdf"
            result["parse_confidence"] = "high"

        if pdf_metadata["authors"] and pdf_metadata["authors"] != "Unknown":
            result["authors"] = pdf_metadata["authors"]
            result["parse_confidence"] = "high"
    except Exception as e:
        print(f"PDF 解析失败: {str(e)}")
        # 保持文件名解析的结果

    # 如果标题仍然为空，使用文件名
    if not result["title"]:
        result["title"] = filename
        result["parse_confidence"] = "low"

    return result


def parse_title_from_filename(filename: str) -> str:
    """
    从文件名解析标题

    Args:
        filename: 文件名（不含扩展名）

    Returns:
        str: 解析出的标题，如果不符合条件则返回空字符串
    """
    # 规范化：替换下划线和多余空格
    title = filename.replace('_', ' ')
    title = re.sub(r'\s+', ' ', title).strip()

    # 移除常见的无用后缀
    title = re.sub(r'\s*\(.*?\)\s*$', '', title)  # 移除括号内容
    title = re.sub(r'\s*\[.*?\]\s*$', '', title)  # 移除方括号内容

    # 如果长度 >= 10，认为是有效标题
    if len(title) >= 10:
        return title

    return ""


def parse_pdf_first_page(pdf_path: str) -> dict:
    """
    解析 PDF 首页文本，提取标题和作者

    Args:
        pdf_path: PDF 文件路径

    Returns:
        dict: {"title": str, "authors": str}
    """
    result = {"title": "", "authors": "Unknown"}

    try:
        # 打开 PDF 文件
        doc = fitz.open(pdf_path)

        if len(doc) == 0:
            return result

        # 读取第一页
        first_page = doc[0]

        # 提取文本块（包含位置和字体信息）
        blocks = first_page.get_text("dict")["blocks"]

        # 过滤出文本块
        text_blocks = []
        for block in blocks:
            if block.get("type") == 0:  # 文本块
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        text = span.get("text", "").strip()
                        size = span.get("size", 0)
                        if text:
                            text_blocks.append({
                                "text": text,
                                "size": size,
                                "y": span.get("bbox", [0, 0, 0, 0])[1]  # y 坐标
                            })

        # 按 y 坐标排序（从上到下）
        text_blocks.sort(key=lambda x: x["y"])

        # 提取标题：通常是第一个较大的文本块
        if text_blocks:
            # 找到最大字号
            max_size = max(block["size"] for block in text_blocks[:10])

            # 标题通常是最大字号的文本
            title_candidates = [
                block["text"] for block in text_blocks[:10]
                if block["size"] >= max_size * 0.9  # 允许 10% 误差
            ]

            if title_candidates:
                # 合并多行标题
                result["title"] = " ".join(title_candidates[:3])

                # 清理标题
                result["title"] = re.sub(r'\s+', ' ', result["title"]).strip()

                # 限制标题长度
                if len(result["title"]) > 200:
                    result["title"] = result["title"][:200] + "..."

        # 提取作者：标题后的 1-3 行，通常字号较小
        if text_blocks and len(text_blocks) > 3:
            # 跳过标题行，查找作者
            author_candidates = []
            for i, block in enumerate(text_blocks[1:6]):  # 检查标题后的 5 行
                text = block["text"]
                # 作者行通常包含人名特征
                if any(keyword in text.lower() for keyword in ["by", "author", "et al", "and"]):
                    author_candidates.append(text)
                elif re.search(r'[A-Z][a-z]+\s+[A-Z][a-z]+', text):  # 匹配人名格式
                    author_candidates.append(text)

            if author_candidates:
                result["authors"] = ", ".join(author_candidates[:2])
                # 清理作者信息
                result["authors"] = re.sub(r'\s+', ' ', result["authors"]).strip()
                result["authors"] = result["authors"][:200]  # 限制长度

        doc.close()

    except Exception as e:
        print(f"PDF 首页解析错误: {str(e)}")

    return result
