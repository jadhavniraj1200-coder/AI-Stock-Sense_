/**
 * Swad Restaurant - State Management & Storage
 */

const STORAGE_KEYS = {
  INVENTORY: 'swad_inventory_store_v1',
  MENU: 'swad_menu_store_v1',
  WASTE: 'swad_waste_store_v1'
};

class RestaurantStore {
  constructor() {
    this.subscribers = [];
    this.init();
  }

  init() {
    // Load from localStorage or populate initial data
    try {
      const storedInv = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      const storedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
      const storedWaste = localStorage.getItem(STORAGE_KEYS.WASTE);

      this.inventory = storedInv ? JSON.parse(storedInv) : [...INITIAL_INVENTORY];
      this.menu = storedMenu ? JSON.parse(storedMenu) : [...INITIAL_MENU];
      this.waste = storedWaste ? JSON.parse(storedWaste) : [...INITIAL_WASTE];
    } catch (e) {
      console.warn("LocalStorage access error, falling back to in-memory store:", e);
      this.inventory = [...INITIAL_INVENTORY];
      this.menu = [...INITIAL_MENU];
      this.waste = [...INITIAL_WASTE];
    }

    this.save();
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(this.inventory));
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(this.menu));
      localStorage.setItem(STORAGE_KEYS.WASTE, JSON.stringify(this.waste));
    } catch (e) {
      console.warn("Failed to persist to localStorage:", e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.getState()));
  }

  resetToDefault() {
    this.inventory = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
    this.menu = JSON.parse(JSON.stringify(INITIAL_MENU));
    this.waste = JSON.parse(JSON.stringify(INITIAL_WASTE));
    this.save();
  }

  // --- Date and Status Helpers ---
  getDaysUntilExpiry(expiryDateStr) {
    if (!expiryDateStr) return 999;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const exp = new Date(expiryDateStr);
    exp.setHours(0, 0, 0, 0);
    const diffTime = exp.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateStockStatus(item) {
    const days = this.getDaysUntilExpiry(item.expiryDate);
    if (days < 0) {
      return { status: "Expired", class: "badge-expired", days };
    }
    if (days <= 3) {
      return { status: "Near Expiry", class: "badge-nearexpiry", days };
    }
    if (item.quantity <= item.minStock) {
      return { status: "Low Stock", class: "badge-lowstock", days };
    }
    return { status: "In Stock", class: "badge-instock", days };
  }

  // --- Inventory CRUD ---
  addProduct(productData) {
    const newProduct = {
      id: "inv-" + Date.now(),
      name: productData.name.trim(),
      category: productData.category,
      quantity: Math.max(0, parseFloat(productData.quantity) || 0),
      unit: productData.unit,
      minStock: Math.max(0, parseFloat(productData.minStock) || 0),
      costPerUnit: Math.max(0, parseFloat(productData.costPerUnit) || 0),
      expiryDate: productData.expiryDate,
      notes: productData.notes || ""
    };
    this.inventory.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id, updatedData) {
    const index = this.inventory.findIndex(item => item.id === id);
    if (index !== -1) {
      this.inventory[index] = {
        ...this.inventory[index],
        name: updatedData.name.trim(),
        category: updatedData.category,
        quantity: Math.max(0, parseFloat(updatedData.quantity) || 0),
        unit: updatedData.unit,
        minStock: Math.max(0, parseFloat(updatedData.minStock) || 0),
        costPerUnit: Math.max(0, parseFloat(updatedData.costPerUnit) || 0),
        expiryDate: updatedData.expiryDate,
        notes: updatedData.notes || ""
      };
      this.save();
      return this.inventory[index];
    }
    return null;
  }

  deleteProduct(id) {
    this.inventory = this.inventory.filter(item => item.id !== id);
    this.save();
  }

  adjustStock(id, delta) {
    const item = this.inventory.find(i => i.id === id);
    if (item) {
      const newQty = Math.max(0, Math.round((item.quantity + delta) * 10) / 10);
      item.quantity = newQty;
      this.save();
    }
  }

  // --- Waste Operations ---
  addWasteRecord(wasteData) {
    const record = {
      id: "w-" + Date.now(),
      productName: wasteData.productName.trim(),
      category: wasteData.category || "General",
      quantity: Math.max(0, parseFloat(wasteData.quantity) || 0),
      unit: wasteData.unit || "kg",
      reason: wasteData.reason,
      date: wasteData.date || new Date().toISOString().split('T')[0],
      estimatedLoss: Math.max(0, parseFloat(wasteData.estimatedLoss) || 0),
      notes: wasteData.notes || ""
    };
    this.waste.unshift(record);
    this.save();
    return record;
  }

  deleteWasteRecord(id) {
    this.waste = this.waste.filter(w => w.id !== id);
    this.save();
  }

  // Discard expired or bad stock directly from Expiry or Inventory section
  discardExpiredItem(productId, reason = "Spoilage") {
    const item = this.inventory.find(i => i.id === productId);
    if (!item) return false;

    if (item.quantity > 0) {
      const estimatedLoss = item.quantity * item.costPerUnit;
      this.addWasteRecord({
        productName: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        reason: reason,
        date: new Date().toISOString().split('T')[0],
        estimatedLoss: estimatedLoss,
        notes: `Discarded from stock due to expiry (Expir. date: ${item.expiryDate})`
      });
      // Deduct stock to 0
      item.quantity = 0;
      this.save();
      return true;
    }
    return false;
  }

  // --- Menu Operations ---
  toggleMenuAvailability(menuId) {
    const item = this.menu.find(m => m.id === menuId);
    if (item) {
      item.isAvailable = !item.isAvailable;
      this.save();
    }
  }

  // --- Summary & Intelligence Engine ---
  getDashboardStats() {
    let totalProducts = this.inventory.length;
    let availableCount = 0;
    let lowStockCount = 0;
    let expiredCount = 0;
    let nearExpiryCount = 0;
    let inventoryValuation = 0;

    this.inventory.forEach(item => {
      const { status } = this.calculateStockStatus(item);
      inventoryValuation += (item.quantity * item.costPerUnit);

      if (status === "Expired") {
        expiredCount++;
      } else if (status === "Near Expiry") {
        nearExpiryCount++;
        availableCount++;
      } else if (status === "Low Stock") {
        lowStockCount++;
        if (item.quantity > 0) availableCount++;
      } else {
        availableCount++;
      }
    });

    const totalWasteKg = this.waste.reduce((sum, w) => sum + (parseFloat(w.quantity) || 0), 0);
    const totalWasteLoss = this.waste.reduce((sum, w) => sum + (parseFloat(w.estimatedLoss) || 0), 0);

    return {
      totalProducts,
      availableCount,
      lowStockCount,
      expiredCount,
      nearExpiryCount,
      inventoryValuation,
      totalWasteKg: Math.round(totalWasteKg * 10) / 10,
      totalWasteLoss: Math.round(totalWasteLoss)
    };
  }

  getSmartRecommendations() {
    const recs = [];

    // 1. Critical Restock recommendations
    this.inventory.forEach(item => {
      const { status } = this.calculateStockStatus(item);
      if (status === "Low Stock" || item.quantity <= item.minStock) {
        // Suggested purchase: enough to reach 2x minStock
        const suggestedOrder = Math.max(1, Math.round(((item.minStock * 2) - item.quantity) * 10) / 10);
        recs.push({
          id: `rec-restock-${item.id}`,
          type: "restock",
          priority: "high",
          title: `Restock Alert: ${item.name}`,
          item: item.name,
          currentQty: `${item.quantity} ${item.unit}`,
          minThreshold: `${item.minStock} ${item.unit}`,
          suggestedQty: `${suggestedOrder} ${item.unit}`,
          estimatedCost: Math.round(suggestedOrder * item.costPerUnit),
          explanation: `Stock is at or below safe kitchen threshold (${item.minStock} ${item.unit}). Restock immediately to prevent dish outages.`
        });
      }
    });

    // 2. Near Expiry Chef Action recommendations
    this.inventory.forEach(item => {
      const days = this.getDaysUntilExpiry(item.expiryDate);
      if (days >= 0 && days <= 3 && item.quantity > 0) {
        recs.push({
          id: `rec-expiry-${item.id}`,
          type: "expiry_urgent",
          priority: "high",
          title: `Imminent Expiry: ${item.name}`,
          item: item.name,
          currentQty: `${item.quantity} ${item.unit}`,
          daysLeft: `${days} ${days === 1 ? 'day' : 'days'} left`,
          suggestedQty: `Prepare Specials`,
          estimatedCost: Math.round(item.quantity * item.costPerUnit),
          explanation: `Approaching expiry on ${item.expiryDate}. Recommend featuring dishes using ${item.name} as Chef's Special today to avoid ₹${Math.round(item.quantity * item.costPerUnit)} loss.`
        });
      }
    });

    // 3. Excess Stock Warning (risk of overstocking)
    this.inventory.forEach(item => {
      const days = this.getDaysUntilExpiry(item.expiryDate);
      if (item.quantity > (item.minStock * 2.5) && days > 7) {
        recs.push({
          id: `rec-excess-${item.id}`,
          type: "excess",
          priority: "tip",
          title: `High Stock Notice: ${item.name}`,
          item: item.name,
          currentQty: `${item.quantity} ${item.unit}`,
          minThreshold: `${item.minStock} ${item.unit}`,
          suggestedQty: `Pause Procurement`,
          estimatedCost: 0,
          explanation: `Inventory is ${Math.round(item.quantity / item.minStock * 10) / 10}x higher than standard minimum. Pause procurement orders to prevent shelf ageing and cash lockup.`
        });
      }
    });

    return recs;
  }

  getState() {
    return {
      inventory: this.inventory,
      menu: this.menu,
      waste: this.waste,
      stats: this.getDashboardStats(),
      recommendations: this.getSmartRecommendations()
    };
  }
}

// Global Store Instance
window.restaurantStore = new RestaurantStore();
