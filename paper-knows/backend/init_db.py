"""
数据库初始化脚本
创建表并插入 mock 数据
"""
import os
from datetime import datetime
from database import engine, SessionLocal, Base
from models.paper import Paper

def init_database():
    """初始化数据库"""
    # 确保 data 目录存在
    os.makedirs("data", exist_ok=True)

    # 创建所有表
    Base.metadata.create_all(bind=engine)
    print("✓ 数据库表创建成功")

    # 创建会话
    db = SessionLocal()

    try:
        # 检查是否已有数据
        existing_papers = db.query(Paper).count()
        if existing_papers > 0:
            print(f"✓ 数据库已有 {existing_papers} 条文献数据")
            return

        # 插入 mock 数据
        mock_papers = [
            Paper(
                title="SiC/SiC 陶瓷基复合材料界面层研究进展",
                authors="张三, 李四, 王五",
                year=2023,
                category="陶瓷基复合材料",
                imported_at=datetime(2024, 1, 15, 10, 30),
                read_status="read",
                read=True,
                ai_analyzed=True,
                has_experiment_plan=True
            ),
            Paper(
                title="木材泊松比测试方法与影响因素分析",
                authors="赵六, 钱七",
                year=2022,
                category="木材及木质复合材料",
                imported_at=datetime(2024, 1, 20, 14, 20),
                read_status="unread",
                read=False,
                ai_analyzed=False,
                has_experiment_plan=False
            ),
            Paper(
                title="高温陶瓷基复合材料热物理性能研究",
                authors="孙八, 周九, 吴十",
                year=2023,
                category="陶瓷基复合材料",
                imported_at=datetime(2024, 1, 25, 9, 15),
                read_status="unread",
                read=False,
                ai_analyzed=False,
                has_experiment_plan=False
            ),
        ]

        db.add_all(mock_papers)
        db.commit()
        print(f"✓ 成功插入 {len(mock_papers)} 条 mock 文献数据")

    except Exception as e:
        print(f"✗ 数据库初始化失败: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("开始初始化数据库...")
    init_database()
    print("数据库初始化完成！")
