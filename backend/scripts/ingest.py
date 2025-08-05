import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.core.vector_store import create_vector_store

if __name__ == "__main__":
    create_vector_store()
    print("✅ Vector store created and saved.")
