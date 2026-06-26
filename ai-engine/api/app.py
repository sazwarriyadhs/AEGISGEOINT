from fastapi import FastAPI

app = FastAPI(title="AEGIS AI Engine")

@app.get("/")
def root():
    return {"status":"online","service":"aegis-ai-engine"}
