"""
测试同步功能
"""
from database import get_db
from services.sync_service import sync_papers_with_filesystem
from models.paper import Paper

def test_sync():
    db = next(get_db())

    print("=== 同步前 ===")
    papers_before = db.query(Paper).all()
    print(f"数据库中的文献数量: {len(papers_before)}")
    for paper in papers_before:
        print(f"  - {paper.title} ({paper.file_path})")

    print("\n=== 执行同步 ===")
    result = sync_papers_with_filesystem(db)
    print(f"同步结果: {result['message']}")
    print(f"  - 保留: {result['kept']} 篇")
    print(f"  - 新增: {result['added']} 篇")
    print(f"  - 删除: {result['deleted']} 篇")

    print("\n=== 同步后 ===")
    papers_after = db.query(Paper).all()
    print(f"数据库中的文献数量: {len(papers_after)}")
    for paper in papers_after:
        print(f"  - {paper.title} ({paper.file_path})")

    db.close()

if __name__ == "__main__":
    test_sync()
