"""
Paper 数据模型
"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from database import Base

class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    authors = Column(String, nullable=True)
    journal = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    category = Column(String, nullable=False, default="未分类")
    file_path = Column(String, unique=True, nullable=True)
    read = Column(Boolean, default=False)
    ai_analyzed = Column(Boolean, default=False)
    has_experiment_plan = Column(Boolean, default=False)
    imported_at = Column(DateTime, default=datetime.utcnow)
    read_status = Column(String, default="unread")  # unread, reading, read

    # PDF 解析相关字段
    source_filename = Column(String, nullable=True)  # 原始文件名
    parse_method = Column(String, default="filename")  # filename / pdf / ai
    parse_confidence = Column(String, default="low")  # low / medium / high

    # AI 分析相关字段
    ai_analysis_json = Column(String, nullable=True)  # AI 分析结果（JSON 字符串）
    ai_analysis_time = Column(DateTime, nullable=True)  # AI 分析时间

    def to_dict(self):
        """转换为字典格式"""
        import json

        # 解析 AI 分析 JSON
        ai_analysis = None
        if self.ai_analysis_json:
            try:
                ai_analysis = json.loads(self.ai_analysis_json)
            except:
                ai_analysis = None

        return {
            "id": self.id,
            "title": self.title,
            "authors": self.authors,
            "journal": self.journal,
            "year": self.year,
            "category": self.category,
            "file_path": self.file_path,
            "read": self.read,
            "ai_analyzed": self.ai_analyzed,
            "has_experiment_plan": self.has_experiment_plan,
            "imported_at": self.imported_at.isoformat() if self.imported_at else None,
            "read_status": self.read_status,
            "source_filename": self.source_filename,
            "parse_method": self.parse_method,
            "parse_confidence": self.parse_confidence,
            "ai_analysis": ai_analysis,
            "ai_analysis_time": self.ai_analysis_time.isoformat() if self.ai_analysis_time else None
        }
