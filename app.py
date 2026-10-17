"""
CartSpark - High-Velocity AI E-Commerce Studio powered by Google Gemma 2
FastAPI Production Server
"""

import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from gemma_engine import GemmaEngine

app = FastAPI(
    title="CartSpark - Gemma 2 E-Commerce Studio",
    description="High-velocity listing writer, pricing optimizer, and customer copilot for marketplace sellers.",
    version="1.0.0"
)

# Enable CORS for local development and Render hosting
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = GemmaEngine()

# Pydantic Schemas
class ListingRequest(BaseModel):
    product_name: str = Field(..., example="Obsidian Ceramic Pour-Over Dripper")
    category: str = Field(..., example="Kitchen & Barware")
    materials: str = Field("", example="Matte stoneware clay, food-safe glaze")
    features: List[str] = Field(default_factory=list, example=["Double-wall heat retention", "Ergonomic thumb grip"])
    tone: str = Field("Artisan & Conversational", example="Artisan & Conversational")
    platform: str = Field("Etsy", example="Etsy")
    target_audience: str = Field("Specialty Coffee Lovers", example="Specialty Coffee Lovers")
    dimensions: str = Field("", example="11cm x 11cm x 9cm, 280g")

class PricingRequest(BaseModel):
    cost_price: float = Field(..., gt=0, example=12.50)
    shipping_cost: float = Field(0.0, ge=0, example=4.50)
    platform_fee_pct: float = Field(9.5, ge=0, example=9.5)
    target_margin_pct: float = Field(45.0, ge=0, example=45.0)
    category: str = Field("Handmade Craft", example="Handmade Craft")
    platform: str = Field("Etsy", example="Etsy")

class ReviewReplyRequest(BaseModel):
    review_text: str = Field(..., example="The mug arrived 2 days late and the handle felt slightly rough.")
    rating: int = Field(..., ge=1, le=5, example=2)
    customer_name: str = Field("Alex", example="Alex")
    product_name: str = Field("Ceramic Pour-Over Dripper", example="Ceramic Pour-Over Dripper")
    tone: str = Field("Empathetic & Professional", example="Empathetic & Professional")

# API Endpoints
@app.get("/health")
def health_check():
    """Endpoint for Render health checks and uptime monitors."""
    return {"status": "healthy", "service": "CartSpark", "version": "1.0.0"}

@app.get("/api/status")
def get_engine_status():
    """Checks whether local Ollama Gemma is connected or fallback engine is active."""
    ollama_status = engine.check_ollama_status()
    return {
        "engine_active": "Google Gemma 2",
        "ollama_connected": ollama_status["online"],
        "has_gemma": ollama_status["has_gemma"],
        "active_model": ollama_status["active_model"],
        "available_models": ollama_status["models"],
        "render_ready": True
    }

@app.post("/api/generate-listing")
def api_generate_listing(req: ListingRequest):
    if not req.product_name.strip():
        raise HTTPException(status_code=400, detail="Product name is required.")
    
    result = engine.generate_listing(
        product_name=req.product_name,
        category=req.category,
        materials=req.materials,
        features=req.features,
        tone=req.tone,
        platform=req.platform,
        target_audience=req.target_audience,
        dimensions=req.dimensions
    )
    return result

@app.post("/api/calculate-pricing")
def api_calculate_pricing(req: PricingRequest):
    result = engine.calculate_pricing(
        cost_price=req.cost_price,
        shipping_cost=req.shipping_cost,
        platform_fee_pct=req.platform_fee_pct,
        target_margin_pct=req.target_margin_pct,
        category=req.category,
        platform=req.platform
    )
    return result

@app.post("/api/generate-review-reply")
def api_generate_review_reply(req: ReviewReplyRequest):
    result = engine.generate_review_response(
        review_text=req.review_text,
        rating=req.rating,
        customer_name=req.customer_name,
        product_name=req.product_name,
        tone=req.tone
    )
    return result

# Mount static web UI
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
