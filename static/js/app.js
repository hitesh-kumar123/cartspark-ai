/**
 * CartSpark - Frontend Application Logic
 * Powered by Google Gemma 2
 * Strict Rule: No emojis anywhere in UI or messages.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    platform: "Etsy",
    features: [
      "Hand-thrown stoneware",
      "Internal flow spiral grooves"
    ],
    currentListing: null,
    currentPricing: null,
    currentReviewReply: null,
    activeTab: "listing",
    activeView: "formatted",
    catalog: JSON.parse(localStorage.getItem("cartspark_catalog") || "[]")
  };

  // Preset Configurations
  const presets = {
    ceramic: {
      name: "Obsidian Ceramic Pour-Over Dripper",
      category: "Kitchen & Specialty Coffee",
      materials: "Matte stoneware clay, lead-free food-safe glaze",
      tone: "Artisan & Conversational",
      audience: "Specialty coffee hobbyists & minimalists",
      dimensions: "11.5cm diameter x 9.2cm height, 310g",
      features: [
        "Hand-thrown stoneware clay",
        "Spiral flow extraction grooves",
        "Heat-retaining double wall construction",
        "Compatible with standard V60-02 filters"
      ]
    },
    leather: {
      name: "Tuscan Vachetta Minimalist Cardholder",
      category: "Bags & Small Leather Goods",
      materials: "Full-grain vegetable-tanned leather, waxed polycord thread",
      tone: "Luxury & Elevated",
      audience: "Modern professionals & everyday carry minimalists",
      dimensions: "10cm x 7.2cm x 0.4cm, 35g",
      features: [
        "Hand-stitched saddle stitch seam",
        "Beeswax burnished edges",
        "Holds 6-8 cards plus folded cash",
        "Ages into a rich golden patina over time"
      ]
    },
    candle: {
      name: "Smoked Amber & Hinoki Botanical Soy Candle",
      category: "Home Decor & Aromatherapy",
      materials: "100% organic golden soy wax, crackling wooden wick, essential oils",
      tone: "Eco-Friendly & Mindful",
      audience: "Self-care enthusiasts & eco-conscious homeowners",
      dimensions: "8.5cm diameter x 10cm height, 260g wax weight",
      features: [
        "Clean 55-hour burn time with zero paraffin",
        "Reusable amber apothecary glass tumbler",
        "Hand-poured in small artisanal micro-batches",
        "Phthalate-free and cruelty-free certified"
      ]
    }
  };

  // DOM Elements
  const el = {
    engineStatusPill: document.getElementById("engineStatusPill"),
    engineStatusText: document.getElementById("engineStatusText"),
    catalogCount: document.getElementById("catalogCount"),
    btnOpenCatalog: document.getElementById("btnOpenCatalog"),
    btnCloseCatalog: document.getElementById("btnCloseCatalog"),
    catalogDrawerBackdrop: document.getElementById("catalogDrawerBackdrop"),
    catalogList: document.getElementById("catalogList"),
    btnExportCatalogCsv: document.getElementById("btnExportCatalogCsv"),
    btnClearCatalog: document.getElementById("btnClearCatalog"),
    
    // Mode Navigation
    navTabs: document.querySelectorAll(".nav-tab"),
    sectionListing: document.getElementById("sectionListing"),
    sectionPricing: document.getElementById("sectionPricing"),
    sectionReview: document.getElementById("sectionReview"),
    
    // Listing Form Inputs
    platformBtns: document.querySelectorAll(".platform-btn"),
    inputProductName: document.getElementById("inputProductName"),
    inputCategory: document.getElementById("inputCategory"),
    inputMaterials: document.getElementById("inputMaterials"),
    selectTone: document.getElementById("selectTone"),
    inputAudience: document.getElementById("inputAudience"),
    inputDimensions: document.getElementById("inputDimensions"),
    featuresContainer: document.getElementById("featuresContainer"),
    inputFeatureTag: document.getElementById("inputFeatureTag"),
    btnGenerateListing: document.getElementById("btnGenerateListing"),
    btnGenerateText: document.getElementById("btnGenerateText"),
    
    // Pricing Form Inputs
    inputCostPrice: document.getElementById("inputCostPrice"),
    inputShippingCost: document.getElementById("inputShippingCost"),
    inputPlatformFee: document.getElementById("inputPlatformFee"),
    inputTargetMargin: document.getElementById("inputTargetMargin"),
    btnCalculatePricing: document.getElementById("btnCalculatePricing"),
    
    // Review Form Inputs
    starBtns: document.querySelectorAll(".star-btn"),
    starRatingLabel: document.getElementById("starRatingLabel"),
    inputCustomerName: document.getElementById("inputCustomerName"),
    inputReviewProduct: document.getElementById("inputReviewProduct"),
    inputReviewText: document.getElementById("inputReviewText"),
    btnGenerateReviewReply: document.getElementById("btnGenerateReviewReply"),
    
    // Output Desk
    valLatency: document.getElementById("valLatency"),
    valModel: document.getElementById("valModel"),
    valSavings: document.getElementById("valSavings"),
    btnViewFormatted: document.getElementById("btnViewFormatted"),
    btnViewMarkdown: document.getElementById("btnViewMarkdown"),
    formattedViewContainer: document.getElementById("formattedViewContainer"),
    markdownViewContainer: document.getElementById("markdownViewContainer"),
    pricingOutputContainer: document.getElementById("pricingOutputContainer"),
    reviewOutputContainer: document.getElementById("reviewOutputContainer"),
    
    displayTitle: document.getElementById("displayTitle"),
    titleCharCount: document.getElementById("titleCharCount"),
    displayTagsMatrix: document.getElementById("displayTagsMatrix"),
    displayBulletsList: document.getElementById("displayBulletsList"),
    displayDescription: document.getElementById("displayDescription"),
    displayRawMarkdown: document.getElementById("displayRawMarkdown"),
    
    // Pricing Output
    kpiCharmPrice: document.getElementById("kpiCharmPrice"),
    kpiNetProfit: document.getElementById("kpiNetProfit"),
    kpiNetMargin: document.getElementById("kpiNetMargin"),
    kpiBaseCost: document.getElementById("kpiBaseCost"),
    barCostWidth: document.getElementById("barCostWidth"),
    barFeeWidth: document.getElementById("barFeeWidth"),
    barProfitWidth: document.getElementById("barProfitWidth"),
    legBaseCost: document.getElementById("legBaseCost"),
    legFees: document.getElementById("legFees"),
    legProfit: document.getElementById("legProfit"),
    displayPricingInsight: document.getElementById("displayPricingInsight"),
    
    // Review Output
    reviewSentimentBadge: document.getElementById("reviewSentimentBadge"),
    displayReviewSnippet: document.getElementById("displayReviewSnippet"),
    displayReviewReply: document.getElementById("displayReviewReply"),
    btnCopyReviewResponse: document.getElementById("btnCopyReviewResponse"),
    
    // Action Buttons
    btnCopyAll: document.getElementById("btnCopyAll"),
    btnSaveCatalog: document.getElementById("btnSaveCatalog"),
    btnDownloadMd: document.getElementById("btnDownloadMd"),
    btnCopyTags: document.getElementById("btnCopyTags"),
    btnCopyBullets: document.getElementById("btnCopyBullets"),
    btnCopyDesc: document.getElementById("btnCopyDesc"),
    
    toastContainer: document.getElementById("toastContainer")
  };

  // Toast Notification System
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 200ms ease";
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  // Check Engine Health Status
  async function checkEngineStatus() {
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const data = await res.json();
        if (data.ollama_connected && data.has_gemma) {
          el.engineStatusText.textContent = "Gemma 2 (2B) • Local Ollama Live";
          el.valModel.textContent = "Gemma 2 via Ollama";
        } else {
          el.engineStatusText.textContent = "Gemma 2 (2B) • Edge Engine Active";
          el.valModel.textContent = "Google Gemma 2 Core";
        }
      }
    } catch {
      el.engineStatusText.textContent = "Gemma 2 • Ready";
    }
  }

  // Feature Tags Rendering
  function renderFeatures() {
    el.featuresContainer.querySelectorAll(".tag-badge").forEach(badge => badge.remove());
    
    state.features.forEach(feat => {
      const badge = document.createElement("span");
      badge.className = "tag-badge";
      badge.innerHTML = `
        <span>${feat}</span>
        <button type="button" class="remove-tag" data-tag="${feat}" aria-label="Remove feature">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;
      el.featuresContainer.insertBefore(badge, el.inputFeatureTag);
    });

    el.featuresContainer.querySelectorAll(".remove-tag").forEach(btn => {
      btn.addEventListener("click", () => {
        const tag = btn.dataset.tag;
        state.features = state.features.filter(f => f !== tag);
        renderFeatures();
      });
    });
  }

  el.inputFeatureTag.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && el.inputFeatureTag.value.trim()) {
      e.preventDefault();
      const val = el.inputFeatureTag.value.trim();
      if (!state.features.includes(val)) {
        state.features.push(val);
        renderFeatures();
      }
      el.inputFeatureTag.value = "";
    }
  });

  // Platform Selector Event
  el.platformBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      el.platformBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.platform = btn.dataset.platform;
      showToast(`Marketplace tuned for ${state.platform}`);
    });
  });

  // Preset Switcher
  document.querySelectorAll(".preset-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.preset;
      const data = presets[key];
      if (data) {
        el.inputProductName.value = data.name;
        el.inputCategory.value = data.category;
        el.inputMaterials.value = data.materials;
        el.selectTone.value = data.tone;
        el.inputAudience.value = data.audience;
        el.inputDimensions.value = data.dimensions;
        state.features = [...data.features];
        renderFeatures();
        showToast(`Loaded ${data.name} preset`);
      }
    });
  });

  // Navigation Tabs Switching
  el.navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      el.navTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      state.activeTab = target;

      el.sectionListing.style.display = target === "listing" ? "block" : "none";
      el.sectionPricing.style.display = target === "pricing" ? "block" : "none";
      el.sectionReview.style.display = target === "review" ? "block" : "none";

      // Toggle output views
      if (target === "listing") {
        el.formattedViewContainer.style.display = state.activeView === "formatted" ? "flex" : "none";
        el.markdownViewContainer.style.display = state.activeView === "markdown" ? "block" : "none";
        el.pricingOutputContainer.style.display = "none";
        el.reviewOutputContainer.style.display = "none";
      } else if (target === "pricing") {
        el.formattedViewContainer.style.display = "none";
        el.markdownViewContainer.style.display = "none";
        el.pricingOutputContainer.style.display = "flex";
        el.reviewOutputContainer.style.display = "none";
      } else if (target === "review") {
        el.formattedViewContainer.style.display = "none";
        el.markdownViewContainer.style.display = "none";
        el.pricingOutputContainer.style.display = "none";
        el.reviewOutputContainer.style.display = "flex";
      }
    });
  });

  // Output Views Toggle (Formatted vs Markdown)
  el.btnViewFormatted.addEventListener("click", () => {
    state.activeView = "formatted";
    el.btnViewFormatted.classList.add("active");
    el.btnViewMarkdown.classList.remove("active");
    if (state.activeTab === "listing") {
      el.formattedViewContainer.style.display = "flex";
      el.markdownViewContainer.style.display = "none";
    }
  });

  el.btnViewMarkdown.addEventListener("click", () => {
    state.activeView = "markdown";
    el.btnViewMarkdown.classList.add("active");
    el.btnViewFormatted.classList.remove("active");
    if (state.activeTab === "listing") {
      el.formattedViewContainer.style.display = "none";
      el.markdownViewContainer.style.display = "block";
    }
  });

  // Generate Listing Action
  el.btnGenerateListing.addEventListener("click", async () => {
    const name = el.inputProductName.value.trim();
    if (!name) {
      showToast("Please enter a product name first");
      el.inputProductName.focus();
      return;
    }

    el.btnGenerateListing.classList.add("loading");
    el.btnGenerateText.textContent = "Gemma 2 Synthesizing Copy...";

    const payload = {
      product_name: name,
      category: el.inputCategory.value.trim() || "Artisan Craft",
      materials: el.inputMaterials.value.trim() || "Natural materials",
      features: state.features,
      tone: el.selectTone.value,
      platform: state.platform,
      target_audience: el.inputAudience.value.trim() || "Modern shoppers",
      dimensions: el.inputDimensions.value.trim() || ""
    };

    try {
      const res = await fetch("/api/generate-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      state.currentListing = data;

      // Update UI elements
      el.valLatency.textContent = `${data.inference_time_sec}s`;
      el.valModel.textContent = data.model || "Gemma 2";
      el.displayTitle.textContent = data.title;
      el.titleCharCount.textContent = `${data.char_count_title} Chars (${state.platform} Limit: ${state.platform === "Etsy" ? "140" : "200"})`;

      // Render Tags Matrix
      el.displayTagsMatrix.innerHTML = "";
      data.tags.forEach((tag, idx) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "matrix-chip";
        chip.innerHTML = `
          <span>#${tag}</span>
          <svg class="copy-mini-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        `;
        chip.addEventListener("click", () => {
          navigator.clipboard.writeText(tag);
          showToast(`Copied tag: #${tag}`);
        });
        el.displayTagsMatrix.appendChild(chip);
      });

      // Render Bullets
      el.displayBulletsList.innerHTML = "";
      data.bullets.forEach(bullet => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span class="bullet-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          <span>${bullet}</span>
        `;
        el.displayBulletsList.appendChild(li);
      });

      // Render Description
      el.displayDescription.innerHTML = data.description
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.*?)\n/g, '<h4 style="margin: 0.8rem 0 0.4rem; color: #f8fafc;">$1</h4>');

      // Render Raw Markdown
      const rawMd = `# ${data.title}\n\n**Hook:** ${data.hook}\n\n### Key Features\n${data.bullets.map(b => `- ${b}`).join("\n")}\n\n### Description\n${data.description}\n\n### Search Tags (13)\n${data.tags.join(", ")}`;
      el.displayRawMarkdown.textContent = rawMd;

      showToast(`Listing generated with Gemma 2 in ${data.inference_time_sec}s`);

    } catch (err) {
      console.error(err);
      showToast("Error generating listing. Check connection.");
    } finally {
      el.btnGenerateListing.classList.remove("loading");
      el.btnGenerateText.textContent = "Generate Listing with Gemma 2";
    }
  });

  // Calculate Pricing Action
  el.btnCalculatePricing.addEventListener("click", async () => {
    const cost = parseFloat(el.inputCostPrice.value) || 10;
    const shipping = parseFloat(el.inputShippingCost.value) || 0;
    const feePct = parseFloat(el.inputPlatformFee.value) || 9.5;
    const marginPct = parseFloat(el.inputTargetMargin.value) || 45;

    try {
      const res = await fetch("/api/calculate-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cost_price: cost,
          shipping_cost: shipping,
          platform_fee_pct: feePct,
          target_margin_pct: marginPct,
          category: el.inputCategory.value || "Handmade Product",
          platform: state.platform
        })
      });

      if (!res.ok) throw new Error("Calculation failed");
      const data = await res.json();
      state.currentPricing = data;

      // Update KPI cards
      el.kpiCharmPrice.textContent = `$${data.charm_price.toFixed(2)}`;
      el.kpiNetProfit.textContent = `+$${data.net_profit.toFixed(2)}`;
      el.kpiNetMargin.textContent = `${data.margin_pct}% Net Profit Margin`;
      el.kpiBaseCost.textContent = `Base Cost: $${data.total_base_cost.toFixed(2)}`;

      // Update Progress Bar
      const total = data.charm_price;
      const costPct = Math.min(100, (data.total_base_cost / total) * 100);
      const feePercent = Math.min(100, (data.platform_fee_est / total) * 100);
      const profitPct = Math.max(0, 100 - costPct - feePercent);

      el.barCostWidth.style.width = `${costPct}%`;
      el.barFeeWidth.style.width = `${feePercent}%`;
      el.barProfitWidth.style.width = `${profitPct}%`;

      el.legBaseCost.textContent = `$${data.total_base_cost.toFixed(2)}`;
      el.legFees.textContent = `$${data.platform_fee_est.toFixed(2)}`;
      el.legProfit.textContent = `$${data.net_profit.toFixed(2)}`;

      el.displayPricingInsight.textContent = data.pricing_insight;

      showToast(`Optimal retail price: $${data.charm_price.toFixed(2)}`);

    } catch (err) {
      console.error(err);
      showToast("Error optimizing pricing.");
    }
  });

  // Review Star Rating Selection
  let selectedRating = 2;
  el.starBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedRating = parseInt(btn.dataset.rating, 10);
      el.starBtns.forEach(b => {
        const r = parseInt(b.dataset.rating, 10);
        b.classList.toggle("active", r <= selectedRating);
      });
      const labels = {
        1: "1 Star (Urgent de-escalation & refund)",
        2: "2 Stars (Needs de-escalation)",
        3: "3 Stars (Neutral / Constructive resolution)",
        4: "4 Stars (Positive / Soft upselling)",
        5: "5 Stars (Brand advocacy & gratitude)"
      };
      el.starRatingLabel.textContent = labels[selectedRating] || `${selectedRating} Stars`;
    });
  });

  // Generate Review Response Action
  el.btnGenerateReviewReply.addEventListener("click", async () => {
    const text = el.inputReviewText.value.trim();
    if (!text) {
      showToast("Please paste a review first");
      return;
    }

    try {
      const res = await fetch("/api/generate-review-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review_text: text,
          rating: selectedRating,
          customer_name: el.inputCustomerName.value.trim() || "Customer",
          product_name: el.inputReviewProduct.value.trim() || "Item",
          tone: "Empathetic & Professional"
        })
      });

      if (!res.ok) throw new Error("Reply generation failed");
      const data = await res.json();
      state.currentReviewReply = data;

      el.reviewSentimentBadge.textContent = data.sentiment;
      el.displayReviewSnippet.textContent = `"${data.review_snippet}"`;
      el.displayReviewReply.textContent = data.generated_response;

      showToast("Resolution reply generated with Gemma 2");

    } catch (err) {
      console.error(err);
      showToast("Error generating review response.");
    }
  });

  // Copy Helpers
  el.btnCopyAll.addEventListener("click", () => {
    const raw = el.displayRawMarkdown.textContent;
    if (raw) {
      navigator.clipboard.writeText(raw);
      showToast("Entire listing copied to clipboard");
    } else {
      showToast("No listing generated yet");
    }
  });

  el.btnCopyTags.addEventListener("click", () => {
    if (state.currentListing && state.currentListing.tags) {
      const tagStr = state.currentListing.tags.join(", ");
      navigator.clipboard.writeText(tagStr);
      showToast("Copied all 13 tags as comma-separated list");
    }
  });

  el.btnCopyBullets.addEventListener("click", () => {
    if (state.currentListing && state.currentListing.bullets) {
      const bulletsStr = state.currentListing.bullets.map(b => `• ${b}`).join("\n");
      navigator.clipboard.writeText(bulletsStr);
      showToast("Copied 5 bullet points to clipboard");
    }
  });

  el.btnCopyDesc.addEventListener("click", () => {
    if (state.currentListing && state.currentListing.description) {
      navigator.clipboard.writeText(state.currentListing.description);
      showToast("Copied product story description");
    }
  });

  el.btnCopyReviewResponse.addEventListener("click", () => {
    const text = el.displayReviewReply.textContent;
    if (text) {
      navigator.clipboard.writeText(text);
      showToast("Review response copied to clipboard");
    }
  });

  // Export Markdown File
  el.btnDownloadMd.addEventListener("click", () => {
    const raw = el.displayRawMarkdown.textContent;
    if (!raw) {
      showToast("No listing to export");
      return;
    }
    const blob = new Blob([raw], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = (state.currentListing ? state.currentListing.title.slice(0, 25) : "listing")
      .toLowerCase().replace(/[^a-z0-9]/g, "-") + ".md";
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename}`);
  });

  // Save to Local Catalog
  el.btnSaveCatalog.addEventListener("click", () => {
    if (!state.currentListing) {
      showToast("Generate a listing first before saving");
      return;
    }

    const item = {
      id: "item_" + Date.now(),
      title: state.currentListing.title,
      platform: state.platform,
      tags: state.currentListing.tags,
      bullets: state.currentListing.bullets,
      description: state.currentListing.description,
      createdAt: new Date().toLocaleDateString()
    };

    state.catalog.unshift(item);
    localStorage.setItem("cartspark_catalog", JSON.stringify(state.catalog));
    updateCatalogCount();
    showToast("Listing saved to local catalog");
  });

  function updateCatalogCount() {
    el.catalogCount.textContent = state.catalog.length;
  }

  function renderCatalogList() {
    el.catalogList.innerHTML = "";
    if (state.catalog.length === 0) {
      el.catalogList.innerHTML = `
        <div style="text-align: center; color: var(--text-dim); padding: 2.5rem 1rem;">
          <p>No saved listings yet.</p>
          <p style="font-size: 0.75rem; margin-top: 4px;">Click 'Save to Catalog' to archive listings locally.</p>
        </div>
      `;
      return;
    }

    state.catalog.forEach(item => {
      const card = document.createElement("div");
      card.className = "catalog-item-card";
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <strong style="font-size: 0.85rem; color: #fff; line-height: 1.3;">${item.title.slice(0, 60)}...</strong>
          <span style="font-size: 0.7rem; color: var(--accent-amber); font-family: var(--font-mono);">${item.platform}</span>
        </div>
        <div style="font-size: 0.72rem; color: var(--text-dim);">Saved on ${item.createdAt} &bull; ${item.tags.length} tags</div>
      `;
      card.addEventListener("click", () => {
        el.displayTitle.textContent = item.title;
        el.displayRawMarkdown.textContent = `# ${item.title}\n\n${item.description}`;
        el.catalogDrawerBackdrop.classList.remove("active");
        showToast(`Loaded ${item.title.slice(0, 30)}...`);
      });
      el.catalogList.appendChild(card);
    });
  }

  // Catalog Drawer Modal Events
  el.btnOpenCatalog.addEventListener("click", () => {
    renderCatalogList();
    el.catalogDrawerBackdrop.classList.add("active");
  });

  el.btnCloseCatalog.addEventListener("click", () => {
    el.catalogDrawerBackdrop.classList.remove("active");
  });

  el.catalogDrawerBackdrop.addEventListener("click", (e) => {
    if (e.target === el.catalogDrawerBackdrop) {
      el.catalogDrawerBackdrop.classList.remove("active");
    }
  });

  el.btnClearCatalog.addEventListener("click", () => {
    if (confirm("Clear all saved catalog listings from your local storage?")) {
      state.catalog = [];
      localStorage.removeItem("cartspark_catalog");
      updateCatalogCount();
      renderCatalogList();
      showToast("Local catalog cleared");
    }
  });

  // Export Catalog as CSV
  el.btnExportCatalogCsv.addEventListener("click", () => {
    if (state.catalog.length === 0) {
      showToast("Catalog is empty");
      return;
    }

    let csv = "ID,Platform,Title,Tags,Date\n";
    state.catalog.forEach(c => {
      const safeTitle = `"${c.title.replace(/"/g, '""')}"`;
      const safeTags = `"${c.tags.join("; ")}"`;
      csv += `${c.id},${c.platform},${safeTitle},${safeTags},${c.createdAt}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cartspark_catalog_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Catalog exported as CSV");
  });

  // Initialize
  renderFeatures();
  updateCatalogCount();
  checkEngineStatus();
  
  // Trigger initial preview with the default preset so screen is never blank!
  el.btnGenerateListing.click();
});
