/**
 * Swad Restaurant - App Controller & Event Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize State & Subscriptions ---
  const store = window.restaurantStore;

  // Active filter state
  let currentInvCategory = 'all';
  let currentInvStatus = 'all';
  let currentInvSearch = '';

  let currentMenuCategory = 'all';
  let currentMenuSearch = '';

  let currentWasteReason = 'all';
  let currentExpiredTab = 'all';

  let currentDeletingProductId = null;

  // Render everything on store updates
  function refreshAll() {
    const state = store.getState();
    renderStats(state.stats);
    renderInventoryTable(state.inventory, currentInvCategory, currentInvStatus, currentInvSearch);
    renderMenuCards(state.menu, currentMenuCategory, currentMenuSearch);
    renderWasteTable(state.waste, currentWasteReason);
    renderExpiredSection(state.inventory, currentExpiredTab);
    renderRecommendations(state.recommendations);
    renderAnalytics(state);
    if (typeof renderChatMessages === 'function') {
      renderChatMessages();
    }
    setupScrollAnimations();
  }

  store.subscribe(() => {
    refreshAll();
  });

  // Initial draw
  refreshAll();

  // ---------------------------------------------------------------------------
  // Blur-to-Clear Intersection Observer
  // ---------------------------------------------------------------------------
  function setupScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
      observer.observe(el);
    });
  }

  setupScrollAnimations();

  // ---------------------------------------------------------------------------
  // Navbar Scroll & Spy
  // ---------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for active link
    const sections = ['home', 'about', 'menu', 'dashboard', 'inventory', 'waste', 'expired', 'recommendations', 'ai-bot', 'analytics'];
    let currentActive = 'home';

    sections.forEach(secId => {
      const el = document.getElementById(secId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          currentActive = secId;
        }
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentActive}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinksContainer = document.querySelector('.nav-links');
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navLinksContainer.style.display === 'flex';
      navLinksContainer.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinksContainer.style.flexDirection = 'column';
        navLinksContainer.style.position = 'absolute';
        navLinksContainer.style.top = '74px';
        navLinksContainer.style.left = '0';
        navLinksContainer.style.right = '0';
        navLinksContainer.style.backgroundColor = '#ffffff';
        navLinksContainer.style.padding = '20px';
        navLinksContainer.style.boxShadow = 'var(--shadow-lg)';
        navLinksContainer.style.borderBottom = '1px solid var(--bg-cream-border)';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Search & Filter Event Handlers
  // ---------------------------------------------------------------------------
  // Inventory Filters
  const invSearchInput = document.getElementById('invSearch');
  if (invSearchInput) {
    invSearchInput.addEventListener('input', (e) => {
      currentInvSearch = e.target.value;
      renderInventoryTable(store.inventory, currentInvCategory, currentInvStatus, currentInvSearch);
    });
  }

  const invCatSelect = document.getElementById('invCategoryFilter');
  if (invCatSelect) {
    invCatSelect.addEventListener('change', (e) => {
      currentInvCategory = e.target.value;
      renderInventoryTable(store.inventory, currentInvCategory, currentInvStatus, currentInvSearch);
    });
  }

  const invStatusSelect = document.getElementById('invStatusFilter');
  if (invStatusSelect) {
    invStatusSelect.addEventListener('change', (e) => {
      currentInvStatus = e.target.value;
      renderInventoryTable(store.inventory, currentInvCategory, currentInvStatus, currentInvSearch);
    });
  }

  // Menu Category Filter Tabs
  document.querySelectorAll('#menuTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#menuTabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMenuCategory = btn.dataset.category;
      renderMenuCards(store.menu, currentMenuCategory, currentMenuSearch);
      setupScrollAnimations();
    });
  });

  const menuSearchInput = document.getElementById('menuSearch');
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      currentMenuSearch = e.target.value;
      renderMenuCards(store.menu, currentMenuCategory, currentMenuSearch);
      setupScrollAnimations();
    });
  }

  // Waste Filters
  const wasteReasonSelect = document.getElementById('wasteReasonFilter');
  if (wasteReasonSelect) {
    wasteReasonSelect.addEventListener('change', (e) => {
      currentWasteReason = e.target.value;
      renderWasteTable(store.waste, currentWasteReason);
    });
  }

  // Expired Section Tabs
  document.querySelectorAll('#expiredTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#expiredTabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentExpiredTab = btn.dataset.tab;
      renderExpiredSection(store.inventory, currentExpiredTab);
    });
  });

  // ---------------------------------------------------------------------------
  // Global Actions exposed on window for table rows & cards
  // ---------------------------------------------------------------------------
  window.handleStockAdjust = (id, delta) => {
    store.adjustStock(id, delta);
    const item = store.inventory.find(i => i.id === id);
    if (item) {
      showToast(`Stock updated: ${item.name} is now ${item.quantity} ${item.unit}`, 'info');
    }
  };

  window.handleToggleMenuAvailability = (id) => {
    store.toggleMenuAvailability(id);
    const dish = store.menu.find(d => d.id === id);
    if (dish) {
      showToast(`${dish.name} marked as ${dish.isAvailable ? 'Available' : 'Unavailable'}`, dish.isAvailable ? 'success' : 'warning');
    }
  };

  window.handleDeleteWaste = (id) => {
    store.deleteWasteRecord(id);
    showToast('Waste record removed.', 'info');
  };

  window.handleDiscardStock = (productId, productName, qty, unit, loss) => {
    if (confirm(`Confirm discard: Are you sure you want to discard ${qty} ${unit} of "${productName}" and record ₹${loss.toFixed(0)} financial loss?`)) {
      const ok = store.discardExpiredItem(productId, "Spoilage/Expired");
      if (ok) {
        showToast(`Discarded ${qty} ${unit} of ${productName} and logged ₹${loss.toFixed(0)} loss into Waste section.`, 'warning');
      } else {
        showToast('Item already has 0 stock.', 'info');
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Modal Management
  // ---------------------------------------------------------------------------
  const productModal = document.getElementById('productModal');
  const productForm = document.getElementById('productForm');
  const modalTitle = document.getElementById('productModalTitle');
  const productIdInput = document.getElementById('prodId');

  window.handleOpenAddModal = () => {
    modalTitle.textContent = "Add New Kitchen Ingredient";
    productForm.reset();
    productIdInput.value = "";
    document.getElementById('prodExpiry').value = "";
    productModal.classList.add('open');
  };

  window.handleOpenEditModal = (id) => {
    const item = store.inventory.find(i => i.id === id);
    if (!item) return;

    modalTitle.textContent = "Edit Product Details";
    productIdInput.value = item.id;
    document.getElementById('prodName').value = item.name;
    document.getElementById('prodCategory').value = item.category;
    document.getElementById('prodQuantity').value = item.quantity;
    document.getElementById('prodUnit').value = item.unit;
    document.getElementById('prodMinStock').value = item.minStock;
    document.getElementById('prodCost').value = item.costPerUnit;
    document.getElementById('prodExpiry').value = item.expiryDate;
    document.getElementById('prodNotes').value = item.notes || '';

    productModal.classList.add('open');
  };

  window.closeProductModal = () => {
    productModal.classList.remove('open');
  };

  // Product Form Submit
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('prodName').value.trim();
      const category = document.getElementById('prodCategory').value;
      const quantity = parseFloat(document.getElementById('prodQuantity').value);
      const unit = document.getElementById('prodUnit').value;
      const minStock = parseFloat(document.getElementById('prodMinStock').value);
      const costPerUnit = parseFloat(document.getElementById('prodCost').value);
      const expiryDate = document.getElementById('prodExpiry').value;
      const notes = document.getElementById('prodNotes').value.trim();

      // Validations
      if (!name) {
        showToast('Please enter a product name.', 'danger');
        return;
      }
      if (isNaN(quantity) || quantity < 0) {
        showToast('Quantity cannot be negative.', 'danger');
        return;
      }
      if (isNaN(minStock) || minStock < 0) {
        showToast('Minimum stock level cannot be negative.', 'danger');
        return;
      }
      if (isNaN(costPerUnit) || costPerUnit < 0) {
        showToast('Cost per unit must be a valid number.', 'danger');
        return;
      }
      if (!expiryDate) {
        showToast('Please specify an expiry date.', 'danger');
        return;
      }

      const id = productIdInput.value;
      if (id) {
        store.updateProduct(id, { name, category, quantity, unit, minStock, costPerUnit, expiryDate, notes });
        showToast(`Updated "${name}" successfully!`, 'success');
      } else {
        store.addProduct({ name, category, quantity, unit, minStock, costPerUnit, expiryDate, notes });
        showToast(`Added "${name}" to restaurant inventory!`, 'success');
      }

      window.closeProductModal();
    });
  }

  // Delete Modal
  const deleteModal = document.getElementById('deleteConfirmModal');
  const deleteItemNameSpan = document.getElementById('deleteItemName');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  window.handleOpenDeleteModal = (id, name) => {
    currentDeletingProductId = id;
    if (deleteItemNameSpan) deleteItemNameSpan.textContent = name;
    deleteModal.classList.add('open');
  };

  window.closeDeleteModal = () => {
    currentDeletingProductId = null;
    deleteModal.classList.remove('open');
  };

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (currentDeletingProductId) {
        store.deleteProduct(currentDeletingProductId);
        showToast('Product removed from inventory.', 'info');
        window.closeDeleteModal();
      }
    });
  }

  // Record Waste Modal
  const wasteModal = document.getElementById('wasteModal');
  const wasteForm = document.getElementById('wasteForm');

  window.handleOpenWasteModal = () => {
    wasteForm.reset();
    document.getElementById('wasteDate').value = new Date().toISOString().split('T')[0];
    wasteModal.classList.add('open');
  };

  window.closeWasteModal = () => {
    wasteModal.classList.remove('open');
  };

  if (wasteForm) {
    wasteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const productName = document.getElementById('wasteProdName').value.trim();
      const category = document.getElementById('wasteCategory').value;
      const quantity = parseFloat(document.getElementById('wasteQuantity').value);
      const unit = document.getElementById('wasteUnit').value;
      const reason = document.getElementById('wasteReasonSelect').value;
      const date = document.getElementById('wasteDate').value;
      const estimatedLoss = parseFloat(document.getElementById('wasteLossInput').value);
      const notes = document.getElementById('wasteNotes').value.trim();

      if (!productName) {
        showToast('Please specify the wasted item.', 'danger');
        return;
      }
      if (isNaN(quantity) || quantity <= 0) {
        showToast('Wasted quantity must be greater than zero.', 'danger');
        return;
      }
      if (isNaN(estimatedLoss) || estimatedLoss < 0) {
        showToast('Estimated financial loss must be a valid amount.', 'danger');
        return;
      }

      store.addWasteRecord({ productName, category, quantity, unit, reason, date, estimatedLoss, notes });
      showToast(`Food waste logged: ₹${estimatedLoss.toFixed(0)} loss recorded.`, 'warning');
      window.closeWasteModal();
    });
  }

  // Reset Demo Data
  window.handleResetData = () => {
    if (confirm("Reset prototype to clean sample restaurant data? All your custom added products and waste entries will be restored to realistic default values.")) {
      store.resetToDefault();
      showToast('Swad Restaurant sample dataset has been reset!', 'success');
    }
  };

  // Close modals on clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });

  // Export CSV button
  const exportBtn = document.getElementById('btnExportCSV');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportInventoryCSV);
  }

  // ---------------------------------------------------------------------------
  // AI Chatbot Form & Suggestion Chips Handlers
  // ---------------------------------------------------------------------------
  const chatForm = document.getElementById('chatForm');
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.handleSendChatMessage();
    });
  }

  // Quick suggestion chips
  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt') || chip.textContent.trim();
      window.handleSendChatMessage(promptText);
    });
  });
});

