from langchain.chains import RetrievalQA
from langchain_ollama import ChatOllama

from app.core.retriever import get_retriever
from app.state import user_vectors

# def run_query(query: str, session_id: str):
#     if session_id not in user_vectors:
#         raise ValueError("Session ID not found or PDF not uploaded.")
    
#     retriever = get_retriever()
    
#     llm = ChatOllama(model="mistral")

#     qa_chain = RetrievalQA.from_chain_type(
#         llm=llm,
#         chain_type="stuff",
#         retriever=retriever,
#         return_source_documents=True
#     )

#     result = qa_chain.invoke({"query": query})
#     return result
def run_query(question, vectorstore):
    from langchain.chains import RetrievalQA
    from langchain_ollama import ChatOllama

    llm = ChatOllama(model="mistral")
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())

    result = qa_chain.invoke(question)
    return {"result": result['result']}