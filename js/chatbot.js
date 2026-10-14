/**
 * Swad Restaurant - Chef Swad AI Waste Calculator & Chatbot Engine
 */

class SwadAIChatbot {
  constructor() {
    this.messages = [];
    this.initWelcomeMessage();
  }

  initWelcomeMessage() {
    this.messages = [
      {
        sender: 'ai',
        text: `Namaste! I am **Chef Swad AI**, your intelligent restaurant waste calculator & kitchen inventory assistant. 👨‍🍳✨\n\nI can help you:\n- **Calculate food waste loss** (e.g. *"Calculate waste for 5 kg spoiled tomatoes"*)\n- **Inspect expired & near-expiry inventory**\n- **Suggest recipes to utilize surplus ingredients** before they spoil\n- **Estimate financial loss** and log waste records directly\n\nHow can I assist your kitchen today?`,
        actions: []
      }
    ];
  }

  // Calculate waste based on user text query
  calculateWasteFromQuery(query) {
    const q = query.toLowerCase();

    // Check for quantity (e.g. 5, 2.5, 10)
    const qtyMatch = q.match(/(\d+(?:\.\d+)?)\s*(kg|kilos?|litres?|liter?|l|packs?|pcs|pieces?|bottles?)?/i);
    const quantity = qtyMatch ? parseFloat(qtyMatch[1]) : null;
    const unit = qtyMatch && qtyMatch[2] ? qtyMatch[2].toLowerCase() : 'kg';

    // Normalize unit
    let cleanUnit = 'kg';
    if (unit.startsWith('l')) cleanUnit = 'L';
    else if (unit.startsWith('p') && unit.includes('c')) cleanUnit = 'pcs';
    else if (unit.includes('pack')) cleanUnit = 'pack';

    // Search matching inventory item
    const store = window.restaurantStore;
    const inv = store ? store.inventory : [];

    let matchedItem = null;
    for (const item of inv) {
      const itemName = item.name.toLowerCase();
      // check if query contains key words like paneer, milk, rice, tomato, onion, oil, flour, etc.
      const words = itemName.split(/\s+/);
      if (words.some(w => w.length > 3 && q.includes(w)) || q.includes(itemName)) {
        matchedItem = item;
        break;
      }
    }

    // Default price lookup if not in inventory
    const defaultPrices = {
      'paneer': { name: 'Fresh Paneer', cost: 340, unit: 'kg', cat: 'Dairy' },
      'milk': { name: 'Full Cream Milk', cost: 68, unit: 'L', cat: 'Dairy' },
      'tomato': { name: 'Tomatoes', cost: 35, unit: 'kg', cat: 'Vegetables' },
      'potato': { name: 'Potatoes (Aloo)', cost: 28, unit: 'kg', cat: 'Vegetables' },
      'onion': { name: 'Nashik Onions', cost: 42, unit: 'kg', cat: 'Vegetables' },
      'rice': { name: 'Basmati Rice', cost: 85, unit: 'kg', cat: 'Grains & Staples' },
      'dal': { name: 'Toor Dal', cost: 160, unit: 'kg', cat: 'Grains & Staples' },
      'flour': { name: 'Atta / Flour', cost: 44, unit: 'kg', cat: 'Grains & Staples' },
      'oil': { name: 'Cooking Oil', cost: 145, unit: 'L', cat: 'Oils & Spices' },
      'butter': { name: 'Cooking Butter', cost: 520, unit: 'kg', cat: 'Dairy' },
      'curd': { name: 'Yoghurt / Dahi', cost: 65, unit: 'kg', cat: 'Dairy' },
      'dahi': { name: 'Yoghurt / Dahi', cost: 65, unit: 'kg', cat: 'Dairy' },
      'cream': { name: 'Cooking Cream', cost: 240, unit: 'L', cat: 'Dairy' }
    };

    if (!matchedItem) {
      for (const [key, val] of Object.entries(defaultPrices)) {
        if (q.includes(key)) {
          matchedItem = {
            name: val.name,
            costPerUnit: val.cost,
            unit: val.unit,
            category: val.cat
          };
          break;
        }
      }
    }

    // Extract custom cost if user specified (e.g. "@ 50 per kg" or "at 120 rs")
    const costMatch = q.match(/(?:at|@|rs\.?|₹)\s*(\d+(?:\.\d+)?)/i);
    let unitCost = matchedItem ? matchedItem.costPerUnit : 50;
    if (costMatch) {
      unitCost = parseFloat(costMatch[1]);
    }

    if (quantity && matchedItem) {
      const calcLoss = Math.round(quantity * unitCost);
      const reason = q.includes('spoil') ? 'Spoilage' :
                     q.includes('overstock') ? 'Overstocking' :
                     q.includes('storage') ? 'Improper Storage' :
                     q.includes('spill') || q.includes('burnt') ? 'Preparation Spill' : 'Unsold Food';

      return {
        isCalculation: true,
        productName: matchedItem.name,
        category: matchedItem.category || 'General',
        quantity: quantity,
        unit: matchedItem.unit || cleanUnit,
        unitCost: unitCost,
        totalLoss: calcLoss,
        reason: reason,
        preventionTip: this.getPreventionTip(matchedItem.name, reason)
      };
    }

    return null;
  }

  getPreventionTip(itemName, reason) {
    const item = itemName.toLowerCase();
    if (item.includes('milk') || item.includes('cream')) {
      return "Maintain walk-in chiller temperature at 2°C to 4°C. Conduct twice-daily temperature logs to prevent sudden bacterial curdling.";
    }
    if (item.includes('paneer') || item.includes('dahi')) {
      return "Submerge fresh paneer blocks in lightly salted chilled water and change water daily. Keep turnover within 48 hours.";
    }
    if (item.includes('tomato')) {
      return "Store unwashed in shallow, ventilated plastic crates at 12°C. Never stack more than 2 layers deep to prevent crushing.";
    }
    if (item.includes('rice') || item.includes('dal')) {
      return "Implement strict cook-to-order forecasting for afternoon buffets. Use airtight food-grade bins off the floor.";
    }
    if (item.includes('onion') || item.includes('potato')) {
      return "Keep in dry, dark, well-ventilated crates away from moisture and direct sunlight. Never store potatoes and onions together.";
    }
    return "Adopt FIFO (First-In, First-Out) rotation and review daily portion yields with line cooks.";
  }

  // Generate intelligent response to user prompt
  processUserMessage(rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    const store = window.restaurantStore;
    const state = store ? store.getState() : null;

    // 1. Check for specific waste calculation request
    const calc = this.calculateWasteFromQuery(rawQuery);
    if (calc) {
      const responseText = `🧮 **Food Waste Calculation Result:**\n\n` +
        `• **Item**: ${calc.productName} (${calc.category})\n` +
        `• **Quantity Wasted**: ${calc.quantity} ${calc.unit}\n` +
        `• **Unit Price**: ₹${calc.unitCost} / ${calc.unit}\n` +
        `• **Calculated Direct Loss**: <span style="color: var(--status-expired); font-size: 1.15rem; font-weight: 800;">₹${calc.totalLoss.toLocaleString('en-IN')}</span>\n` +
        `• **Assigned Reason**: *${calc.reason}*\n\n` +
        `💡 **Chef's Prevention Tip**: ${calc.preventionTip}\n\n` +
        `Would you like to log this incident directly into your official Waste Products register?`;

      return {
        text: responseText,
        actions: [
          {
            label: `Log ₹${calc.totalLoss} into Waste Register`,
            type: 'log_waste',
            payload: {
              productName: calc.productName,
              category: calc.category,
              quantity: calc.quantity,
              unit: calc.unit,
              reason: calc.reason,
              estimatedLoss: calc.totalLoss,
              notes: `Calculated & logged via Chef Swad AI Bot`
            }
          }
        ]
      };
    }

    // 2. Query: Expired or near expiry products
    if (q.includes('expire') || q.includes('expiry') || q.includes('spoil') || q.includes('bad')) {
      if (!state) return { text: "Unable to connect to live inventory store.", actions: [] };

      const expired = [];
      const nearExpiry = [];

      state.inventory.forEach(item => {
        const { status, days } = store.calculateStockStatus(item);
        if (status === 'Expired') expired.push({ ...item, days });
        if (status === 'Near Expiry') nearExpiry.push({ ...item, days });
      });

      let res = `⚠️ **Current Kitchen Expiry Status Report:**\n\n`;
      if (expired.length > 0) {
        res += `🔴 **Expired Items (${expired.length}):**\n`;
        expired.forEach(i => {
          const loss = Math.round(i.quantity * i.costPerUnit);
          res += `• **${i.name}**: ${i.quantity} ${i.unit} (expired ${Math.abs(i.days)}d ago, ₹${loss} at risk)\n`;
        });
        res += `\n*Strict rule: Do not use expired items for culinary prep.*\n\n`;
      } else {
        res += `✅ **No expired stock found!** All active ingredients are fresh.\n\n`;
      }

      if (nearExpiry.length > 0) {
        res += `🟠 **Expiring in ≤ 3 Days (${nearExpiry.length}):**\n`;
        nearExpiry.forEach(i => {
          res += `• **${i.name}**: ${i.quantity} ${i.unit} (expiring in ${i.days} ${i.days === 1 ? 'day' : 'days'})\n`;
        });
        res += `\n💡 *Recommendation: Prioritize these in today's Chef Specials!*`;
      }

      return {
        text: res,
        actions: expired.length > 0 ? [
          { label: 'View Expired Products Section', type: 'navigate', payload: '#expired' }
        ] : []
      };
    }

    // 3. Query: Low stock or restock query
    if (q.includes('low stock') || q.includes('restock') || q.includes('shortage') || q.includes('reorder')) {
      if (!state) return { text: "Store not available.", actions: [] };

      const lowItems = state.inventory.filter(i => {
        const { status } = store.calculateStockStatus(i);
        return status === 'Low Stock' || i.quantity <= i.minStock;
      });

      let res = `📦 **Kitchen Low-Stock & Reorder Status:**\n\n`;
      if (lowItems.length > 0) {
        lowItems.forEach(i => {
          const suggested = Math.max(1, Math.round(((i.minStock * 2) - i.quantity) * 10) / 10);
          res += `• **${i.name}**: Current ${i.quantity} ${i.unit} (Min buffer: ${i.minStock} ${i.unit}) -> **Suggested Reorder: ${suggested} ${i.unit}** (₹${Math.round(suggested * i.costPerUnit)})\n`;
        });
        res += `\n*Prompt replenishment avoids taking signature menu dishes off service.*`;
      } else {
        res += `✅ All ingredient stocks are comfortably above minimum buffer thresholds!`;
      }

      return {
        text: res,
        actions: [{ label: 'Open Inventory Dashboard', type: 'navigate', payload: '#inventory' }]
      };
    }

    // 4. Query: Total food waste / financial loss report
    if (q.includes('total waste') || q.includes('how much waste') || q.includes('waste loss') || q.includes('analytics')) {
      if (!state) return { text: "Data unavailable.", actions: [] };

      const stats = state.stats;
      const res = `📊 **Swad Restaurant Waste & Loss Summary:**\n\n` +
        `• **Total Quantity Logged Wasted**: **${stats.totalWasteKg} kg**\n` +
        `• **Total Financial Loss**: <span style="color: var(--status-expired); font-weight: 700;">₹${stats.totalWasteLoss.toLocaleString('en-IN')}</span>\n` +
        `• **Current Waste Reduction Score**: **88% Efficiency**\n` +
        `• **Projected Monthly Savings with Swad Alerts**: **₹4,850**\n\n` +
        `Top Waste Reason in your kitchen: **Overstocking and Spoilage** (68% of incidents). Consider adjusting weekly dairy purchase batches by -15%.`;

      return {
        text: res,
        actions: [{ label: 'View Waste Log Table', type: 'navigate', payload: '#waste' }]
      };
    }

    // 5. Query: Recipe ideas to prevent waste
    if (q.includes('recipe') || q.includes('cook') || q.includes('dish') || q.includes('use up') || q.includes('surplus')) {
      let res = `👨‍🍳 **Chef Swad's Zero-Waste Culinary Recipes:**\n\n` +
        `1. **Surplus Milk & Cream 🥛**: Simmer into homemade **Paneer**, or reduce into fragrant **Kheer** and **Rabri** for dinner dessert specials.\n` +
        `2. **Surplus Tomatoes & Onions 🍅**: Slow-roast and blend with cashews to prepare a 5-day **Makhani Gravy Master Base** (freezes well for 14 days).\n` +
        `3. **Leftover Cooked Rice 🍚**: Feature as **Tawa Pulao**, **Lemon Rice**, or crispy **Rice Arancini / Pakoras** as evening appetizers.\n` +
        `4. **Expiring Dahi / Yoghurt 🥣**: Blend into **Kesar Mango Lassi**, whip into **Cucumber Boondi Raita**, or use as marinade base for tandoori tikka.\n` +
        `5. **Stale Naan or Bread 🍞**: Cut into cubes, brush with garlic butter, and bake into crispy **Croutons** for Tomato Soup!`;

      return {
        text: res,
        actions: [{ label: 'Check Signature Menu', type: 'navigate', payload: '#menu' }]
      };
    }

    // 6. Generic helpful AI response with examples
    return {
      text: `I understand you're inquiring about kitchen management! Here is how I can calculate or assist:\n\n` +
        `• **Calculate Waste Loss**: Type *"Calculate waste for 4 kg tomatoes"* or *"Calculate loss of 3 litres milk spoiled"*\n` +
        `• **Check Stock Health**: Ask *"Which items are expired?"* or *"Show low stock ingredients"*\n` +
        `• **Recipe Suggestions**: Ask *"How to use up surplus tomatoes and cream?"*\n` +
        `• **Financial Overview**: Ask *"What is our total food waste this month?"*\n\n` +
        `Feel free to try any of the quick suggestions below!`,
      actions: []
    };
  }
}

// Global instance
window.swadAIChatbot = new SwadAIChatbot();
