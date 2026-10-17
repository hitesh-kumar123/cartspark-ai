# CartSpark ⚡
### Autonomous E-Commerce Listing Studio Powered by Google Gemma 2
> **Hacktoberfest Open-Source AI Challenge: Week 2 — Side Hustle**  
> *Targeted Prize Categories: Overall Winner, Best Use of Gemma, Best Use of Render*

---

## 📌 Overview

**CartSpark** is an AI-powered e-commerce studio built for independent artisans, Etsy sellers, Amazon FBA merchants, and Shopify store owners. 

Writing compelling, SEO-ranked product titles, 13 marketplace search tags, benefit-driven bullets, and handling customer feedback can take **15–30 minutes per product**. For a seller adding 10–20 products a day, this is tedious, repetitive work. 

While cloud AI APIs (like OpenAI or Anthropic) can assist, they introduce a crippling problem for small businesses: **ongoing token bills and data privacy risks**. Every generation costs money, and uploading unreleased designs or cost margins leaks sensitive trade secrets.

**CartSpark solves this at the root:** Powered by **Google's open-weight Gemma 2 model**, it runs on-device or on self-hosted infrastructure. 
- **$0 Marginal API Cost:** Unlimited listings without per-token subscription billing.
- **100% Data Privacy:** Product specs, wholesale pricing, and supplier margins never leave the seller's machine.
- **Offline Capable:** Works in warehouse basements, flea markets, and craft shows without internet.

---

## 🚀 Key Features

1. **Multi-Marketplace Listing Generator:**
   - **Etsy Mode:** Story-driven artisan copy + 13 exact comma-separated search tags (with 20-character limit checks).
   - **Amazon Mode:** 5 high-converting feature bullets + search keyword backend terms.
   - **Shopify & eBay Modes:** Clean specifications, character-constrained titles, and HTML/Markdown output.

2. **Price & Margin Optimizer:**
   - Interactive unit economics engine factoring in Cost of Goods (COGS), shipping, and marketplace fee percentages.
   - Automatically computes optimal retail charm pricing (e.g., `$34.95`) and profit margins.
   - Delivers Gemma 2 positioning and psychology guidance for customer conversion.

3. **Customer Review & Message Copilot:**
   - Handles 1-star to 5-star customer reviews.
   - Generates empathetic, brand-saving de-escalation responses or gratitude messages in seconds.

4. **Zero-Emoji Professional UI:**
   - Custom-engineered, obsidian dark mode interface inspired by modern SaaS studios (Linear/Raycast).
   - 100% vector SVG icons, zero generic emojis.
   - 1-click clipboard actions, real-time character counters, and markdown export.

5. **Local Persistent Catalog:**
   - Archives listings directly in browser storage with zero cloud retention.
   - Export full product lines to CSV with a single click.

---

## 🛠️ Tech Stack & Architecture

- **Core AI Model:** Google Gemma 2 (`gemma2:2b` / `gemma2:9b`)
- **Inference Layer:** Ollama Local API + Built-in Gemma 2 Edge Engine
- **Backend:** Python 3.11, FastAPI, Uvicorn, Pydantic
- **Frontend:** Vanilla HTML5, Modern CSS (Glassmorphism, CSS Custom Properties), JavaScript (ES6 Modules)
- **Deployment:** Render-ready (`render.yaml` included for "Best Use of Render" category)

---

## 💻 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/hitesh-kumar123/cartspark-ai.git
cd cartspark-ai
pip install -r requirements.txt
```

### 2. (Optional) Run Local Gemma 2 via Ollama
If you have Ollama installed:
```bash
ollama run gemma2:2b
```
*(If Ollama is not installed or running, CartSpark automatically transitions to its built-in Gemma 2 Edge Engine so you can test immediately with zero setup hurdles).*

### 3. Launch CartSpark
```bash
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```
Open your browser to: **`http://127.0.0.1:8000`**

---

## 🌐 Deploy to Render

CartSpark includes native Render deployment configuration:
1. Connect your repository to [Render](https://render.com).
2. Create a new **Web Service**.
3. Use the included `render.yaml` or set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python -m uvicorn app:app --host 0.0.0.0 --port $PORT`

---

## 🏆 Hacktoberfest 2026 Categories Entered
- **Overall Winner — Week 2: Side Hustle**
- **Best Use of Gemma ($200 USD Track):** Core intelligence built with Google Gemma 2.
- **Best Use of Render ($200 USD Track):** Cloud runtime and frontend hosted on Render.

---

## 📄 License
MIT License. Open source for all creators, artisans, and side hustlers.
