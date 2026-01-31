"""
分析快照刷新服务
用于重建分析结果的显示快照，而不重新调用 AI API
"""
import json
import hashlib
from datetime import datetime


def generate_version_hash(analysis_data: dict) -> str:
    """生成分析数据的版本哈希"""
    # 将分析数据转换为稳定的字符串表示
    data_str = json.dumps(analysis_data, sort_keys=True, ensure_ascii=False)
    # 生成 SHA256 哈希
    return hashlib.sha256(data_str.encode('utf-8')).hexdigest()[:16]


def build_analysis_sections(analysis_data: dict) -> list:
    """
    将原始分析数据重构为 UI 友好的分段格式

    Args:
        analysis_data: 原始的 AI 分析 JSON 数据

    Returns:
        结构化的分析章节列表
    """
    sections = []

    # 1. 基本信息
    if "basic_info" in analysis_data:
        basic_info = analysis_data["basic_info"]
        sections.append({
            "section_id": "basic_info",
            "section_title": "基本信息",
            "section_type": "metadata",
            "content": {
                "title": basic_info.get("title", ""),
                "authors": basic_info.get("authors", ""),
                "journal": basic_info.get("journal", ""),
                "publisher": basic_info.get("publisher", ""),
                "publish_date": basic_info.get("publish_date", ""),
                "doi": basic_info.get("doi", ""),
                "category": basic_info.get("category", ""),
                "keywords": basic_info.get("keywords", [])
            }
        })

    # 2. 研究背景与问题
    if "background_and_problem" in analysis_data:
        bg = analysis_data["background_and_problem"]
        sections.append({
            "section_id": "background",
            "section_title": "研究背景与问题",
            "section_type": "text_block",
            "content": {
                "research_background": bg.get("research_background", ""),
                "field_pain_points": bg.get("field_pain_points", ""),
                "existing_methods_limitations": bg.get("existing_methods_limitations", "")
            }
        })

    # 3. 研究目标
    if "research_objectives" in analysis_data:
        obj = analysis_data["research_objectives"]
        sections.append({
            "section_id": "objectives",
            "section_title": "研究目标",
            "section_type": "text_block",
            "content": {
                "core_research_question": obj.get("core_research_question", ""),
                "scope_description": obj.get("scope_description", "")
            }
        })

    # 4. 研究方法
    if "methodology" in analysis_data:
        method = analysis_data["methodology"]
        sections.append({
            "section_id": "methodology",
            "section_title": "研究方法",
            "section_type": "structured",
            "content": {
                "overall_workflow": method.get("overall_workflow", ""),
                "experimental_design_logic": method.get("experimental_design_logic", ""),
                "key_techniques": method.get("key_techniques", []),
                "characterization_methods": method.get("characterization_methods", [])
            }
        })

    # 5. 关键结果
    if "key_results" in analysis_data:
        results = analysis_data["key_results"]
        sections.append({
            "section_id": "results",
            "section_title": "关键结果",
            "section_type": "text_block",
            "content": {
                "main_findings": results.get("main_findings", ""),
                "data_trends": results.get("data_trends", ""),
                "supporting_evidence": results.get("supporting_evidence", "")
            }
        })

    # 6. 创新点分析
    if "innovation_analysis" in analysis_data:
        innovation = analysis_data["innovation_analysis"]
        sections.append({
            "section_id": "innovation",
            "section_title": "创新点分析",
            "section_type": "structured",
            "content": {
                "method_innovation": innovation.get("method_innovation", ""),
                "mechanism_innovation": innovation.get("mechanism_innovation", ""),
                "application_innovation": innovation.get("application_innovation", ""),
                "difference_from_prior_work": innovation.get("difference_from_prior_work", "")
            }
        })

    # 7. 局限性
    if "limitations" in analysis_data:
        limits = analysis_data["limitations"]
        sections.append({
            "section_id": "limitations",
            "section_title": "研究局限性",
            "section_type": "text_block",
            "content": {
                "author_acknowledged": limits.get("author_acknowledged", ""),
                "ai_inferred_risks": limits.get("ai_inferred_risks", "")
            }
        })

    # 8. 实验复现指南
    if "experiment_replication" in analysis_data:
        replication = analysis_data["experiment_replication"]
        sections.append({
            "section_id": "replication",
            "section_title": "实验复现指南",
            "section_type": "guide",
            "content": {
                "materials_preparation": replication.get("materials_preparation", ""),
                "process_parameters": replication.get("process_parameters", ""),
                "characterization_methods": replication.get("characterization_methods", ""),
                "evaluation_metrics": replication.get("evaluation_metrics", ""),
                "step_by_step_guide": replication.get("step_by_step_guide", [])
            }
        })

    # 9. 实验扩展建议
    if "experiment_extension" in analysis_data:
        extension = analysis_data["experiment_extension"]
        sections.append({
            "section_id": "extension",
            "section_title": "实验扩展建议",
            "section_type": "text_block",
            "content": {
                "parameter_optimization": extension.get("parameter_optimization", ""),
                "material_system_transfer": extension.get("material_system_transfer", ""),
                "alternative_routes": extension.get("alternative_routes", "")
            }
        })

    # 10. 对比分析
    if "comparative_analysis" in analysis_data:
        comparison = analysis_data["comparative_analysis"]
        sections.append({
            "section_id": "comparison",
            "section_title": "对比分析",
            "section_type": "text_block",
            "content": {
                "similar_works_comparison": comparison.get("similar_works_comparison", ""),
                "performance_cost_comparison": comparison.get("performance_cost_comparison", ""),
                "application_scenarios": comparison.get("application_scenarios", "")
            }
        })

    # 11. 风险与注意事项
    if "risks_and_warnings" in analysis_data:
        risks = analysis_data["risks_and_warnings"]
        sections.append({
            "section_id": "risks",
            "section_title": "风险与注意事项",
            "section_type": "list",
            "content": {
                "failure_prone_steps": risks.get("failure_prone_steps", []),
                "experimental_precautions": risks.get("experimental_precautions", []),
                "beginner_warnings": risks.get("beginner_warnings", [])
            }
        })

    return sections


def refresh_analysis_snapshot(db, paper_id: int) -> dict:
    """
    刷新分析显示快照

    不重新调用 AI API，而是基于已有的分析结果重建显示快照。
    用于更新显示格式、版本号等，而不消耗 API 额度。

    Args:
        db: 数据库会话
        paper_id: 文献 ID

    Returns:
        刷新后的分析快照，如果文献不存在或未分析则返回 None
    """
    from models.paper import Paper

    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        return None

    # 检查是否已有分析结果
    if not paper.ai_analyzed or not paper.ai_analysis_json:
        return None

    # 加载现有的分析数据
    try:
        analysis_data = json.loads(paper.ai_analysis_json)
    except json.JSONDecodeError:
        return None

    # 生成版本哈希
    version_hash = generate_version_hash(analysis_data)

    # 重建分析章节
    analysis_sections = build_analysis_sections(analysis_data)

    # 获取 AI 元数据
    ai_meta = analysis_data.get("ai_meta", {})

    # 构建刷新后的快照
    refreshed_snapshot = {
        "paper_id": paper.id,
        "title": paper.title,
        "analysis_version": f"v1.0-{version_hash}",
        "analysis_generated_at": datetime.utcnow().isoformat(),
        "original_analysis_time": ai_meta.get("analysis_time", ""),
        "analysis_model": ai_meta.get("analysis_model", "Claude Sonnet 4.5"),
        "analysis_sections": analysis_sections,
        "metadata": {
            "total_sections": len(analysis_sections),
            "has_experiment_plan": paper.has_experiment_plan,
            "refresh_type": "snapshot_rebuild",
            "source": "cached_analysis"
        }
    }

    return refreshed_snapshot
