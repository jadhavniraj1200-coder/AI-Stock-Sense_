/**
 * Swad Restaurant - UI Rendering, Charts, Modals, and Toasts
 */

// Format currency to Indian Rupees
function formatINR(amount) {
  if (isNaN(amount) || amount === null) return "₹0";
  return "₹" + Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  });
}

// Toast Notification
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === 'danger') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  } else if (type === 'warning') {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    <span style="color: inherit; display: flex; align-items: center;">${iconSvg}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 3800);
}

// -----------------------------------------------------------------------------
// Render Hero & Summary Statistics
// -----------------------------------------------------------------------------
function renderStats(stats) {
  // Hero stats
  const heroTotal = document.getElementById('heroStatTotal');
  const heroLow = document.getElementById('heroStatLow');
  const heroExpired = document.getElementById('heroStatExpired');
  const heroWaste = document.getElementById('heroStatWaste');

  if (heroTotal) heroTotal.textContent = stats.totalProducts;
  if (heroLow) heroLow.textContent = stats.lowStockCount;
  if (heroExpired) heroExpired.textContent = stats.expiredCount;
  if (heroWaste) heroWaste.textContent = formatINR(stats.totalWasteLoss);

  // Dashboard metric cards
  const dTotal = document.getElementById('dashTotalProducts');
  const dAvail = document.getElementById('dashAvailProducts');
  const dLow = document.getElementById('dashLowStock');
  const dExpired = document.getElementById('dashExpired');
  const dNear = document.getElementById('dashNearExpiry');
  const dWaste = document.getElementById('dashWasteLoss');

  if (dTotal) dTotal.textContent = stats.totalProducts;
  if (dAvail) dAvail.textContent = stats.availableCount;
  if (dLow) dLow.textContent = stats.lowStockCount;
  if (dExpired) dExpired.textContent = stats.expiredCount;
  if (dNear) dNear.textContent = stats.nearExpiryCount;
  if (dWaste) dWaste.textContent = formatINR(stats.totalWasteLoss);

  // Waste summary badges in Waste Section
  const wasteKgBadge = document.getElementById('wasteTotalKg');
  const wasteLossBadge = document.getElementById('wasteTotalLoss');
  if (wasteKgBadge) wasteKgBadge.textContent = `${stats.totalWasteKg} kg`;
  if (wasteLossBadge) wasteLossBadge.textContent = formatINR(stats.totalWasteLoss);

  // Expiry alert count
  const expiryBadge = document.getElementById('expiredAlertCount');
  if (expiryBadge) {
    expiryBadge.textContent = `${stats.expiredCount} Critical Expired`;
    expiryBadge.style.display = stats.expiredCount > 0 ? 'inline-flex' : 'none';
  }
}

// -----------------------------------------------------------------------------
// Render Inventory Table
// -----------------------------------------------------------------------------
function renderInventoryTable(items, filterCategory = 'all', filterStatus = 'all', searchQuery = '') {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  const filtered = items.filter(item => {
    // Category filter
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;

    // Status filter
    const statusObj = window.restaurantStore.calculateStockStatus(item);
    if (filterStatus === 'instock' && statusObj.status !== 'In Stock') return false;
    if (filterStatus === 'lowstock' && statusObj.status !== 'Low Stock') return false;
    if (filterStatus === 'nearexpiry' && statusObj.status !== 'Near Expiry') return false;
    if (filterStatus === 'expired' && statusObj.status !== 'Expired') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
          <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px;">No inventory items found</div>
          <div style="font-size: 0.85rem;">Try adjusting your filters or search keywords.</div>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(item => {
    const statusObj = window.restaurantStore.calculateStockStatus(item);
    const rowClass = statusObj.status === 'Expired' ? 'row-expired' : (statusObj.status === 'Low Stock' ? 'row-lowstock' : '');

    const tr = document.createElement('tr');
    tr.className = rowClass;
    tr.innerHTML = `
      <td>
        <div style="font-weight: 600; color: var(--gravy-900);">${item.name}</div>
        <div style="font-size: 0.775rem; color: var(--text-muted);">${item.notes || 'Kitchen staple'}</div>
      </td>
      <td>
        <span class="badge badge-category">${item.category}</span>
      </td>
      <td>
        <div class="qty-control">
          <button class="btn-qty-mini" onclick="window.handleStockAdjust('${item.id}', -1)" title="Decrease by 1 ${item.unit}">−</button>
          <span style="font-weight: 700; min-width: 48px; text-align: center;">${item.quantity} ${item.unit}</span>
          <button class="btn-qty-mini" onclick="window.handleStockAdjust('${item.id}', 1)" title="Increase by 1 ${item.unit}">+</button>
        </div>
      </td>
      <td>${item.unit}</td>
      <td style="color: var(--text-secondary); font-weight: 500;">${item.minStock} ${item.unit}</td>
      <td>
        <span style="white-space: nowrap; font-size: 0.85rem; color: ${statusObj.status === 'Expired' ? 'var(--status-expired)' : 'var(--text-secondary)'}; font-weight: ${statusObj.status === 'Expired' ? '700' : '500'};">
          ${item.expiryDate}
        </span>
      </td>
      <td>
        <span class="badge ${statusObj.class}">
          ${statusObj.status}
          ${statusObj.days < 0 ? `(${Math.abs(statusObj.days)}d ago)` : (statusObj.days <= 3 ? `(in ${statusObj.days}d)` : '')}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon-action" onclick="window.handleOpenEditModal('${item.id}')" title="Edit Product">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon-action danger" onclick="window.handleOpenDeleteModal('${item.id}', '${item.name.replace(/'/g, "\\'")}')" title="Delete Product">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// -----------------------------------------------------------------------------
// Render Restaurant Menu Cards
// -----------------------------------------------------------------------------
function renderMenuCards(dishes, selectedCategory = 'all', searchQuery = '') {
  const container = document.getElementById('menuCardsGrid');
  if (!container) return;

  container.innerHTML = '';

  const filtered = dishes.filter(dish => {
    if (selectedCategory !== 'all' && dish.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);
      const matchCat = dish.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--bg-cream-border); color: var(--text-muted);">
        <p style="font-size: 1.1rem; font-weight: 600;">No dishes match your selection</p>
        <p style="font-size: 0.85rem;">Try choosing another category or clearing search.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(dish => {
    const card = document.createElement('div');
    card.className = 'menu-card reveal';

    const availBadge = dish.isAvailable
      ? `<span class="badge badge-instock">Available</span>`
      : `<span class="badge badge-expired">Out of Stock</span>`;

    const toggleBtnClass = dish.isAvailable ? 'make-unavailable' : 'make-available';
    const toggleBtnText = dish.isAvailable ? 'Mark Unavailable' : 'Mark Available';

    card.innerHTML = `
      <div class="menu-card-img-wrap">
        <img src="${dish.image}" onerror="this.onerror=null; this.src='${dish.fallbackImage || dish.image}'" alt="${dish.name}" class="menu-card-img" loading="lazy" />
        <span class="menu-card-badge">${availBadge}</span>
        <span class="menu-card-category">${dish.category}</span>
      </div>
      <div class="menu-card-body">
        <div class="menu-card-header">
          <h4 class="menu-dish-name">${dish.name}</h4>
          <span class="menu-dish-price">${formatINR(dish.price)}</span>
        </div>
        <p class="menu-dish-desc">${dish.description}</p>
        <div class="menu-ingredients-tag">
          <strong>Key Ingredients:</strong> ${dish.ingredients.join(', ')}
        </div>
        <div class="menu-card-footer">
          <span style="font-size: 0.775rem; color: var(--text-muted);">Kitchen status control:</span>
          <button class="btn-toggle-availability ${toggleBtnClass}" onclick="window.handleToggleMenuAvailability('${dish.id}')">
            ${toggleBtnText}
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// -----------------------------------------------------------------------------
// Render Waste Products Section
// -----------------------------------------------------------------------------
function renderWasteTable(wasteList, filterReason = 'all') {
  const tbody = document.getElementById('wasteTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  const filtered = wasteList.filter(item => {
    if (filterReason !== 'all' && item.reason !== filterReason) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 48px; color: var(--text-muted);">
          <div style="font-size: 1.1rem; font-weight: 600;">No waste records logged for this filter</div>
          <div style="font-size: 0.85rem;">Great work minimizing waste!</div>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(record => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight: 600; color: var(--gravy-900);">${record.productName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${record.notes || record.category}</div>
      </td>
      <td><strong>${record.quantity} ${record.unit}</strong></td>
      <td>
        <span class="badge" style="background: var(--bg-cream-tint); color: var(--gravy-800); border: 1px solid var(--bg-cream-border);">
          ${record.reason}
        </span>
      </td>
      <td>${record.date}</td>
      <td style="color: var(--status-expired); font-weight: 700;">
        ${formatINR(record.estimatedLoss)}
      </td>
      <td>
        <button class="btn-icon-action danger" onclick="window.handleDeleteWaste('${record.id}')" title="Delete Log">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// -----------------------------------------------------------------------------
// Render Expired Products Section
// -----------------------------------------------------------------------------
function renderExpiredSection(inventory, filterTab = 'all') {
  const container = document.getElementById('expiredProductsList');
  if (!container) return;

  container.innerHTML = '';

  const list = inventory.filter(item => {
    const statusObj = window.restaurantStore.calculateStockStatus(item);
    if (filterTab === 'expired' && statusObj.status !== 'Expired') return false;
    if (filterTab === 'expiring_soon' && statusObj.status !== 'Near Expiry') return false;
    if (filterTab === 'all' && statusObj.status !== 'Expired' && statusObj.status !== 'Near Expiry') return false;
    return true;
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px; background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--bg-cream-border);">
        <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: var(--status-instock-bg); color: var(--status-instock); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--gravy-900); margin-bottom: 4px;">Zero Expired Ingredients!</h4>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">All current restaurant stock items are fresh and within safe cooking dates.</p>
      </div>
    `;
    return;
  }

  const tableWrap = document.createElement('div');
  tableWrap.className = 'table-responsive';
  tableWrap.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Category</th>
          <th>Quantity Remaining</th>
          <th>Expiry Date</th>
          <th>Days Status</th>
          <th>Estimated Loss</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="expiredTableBody"></tbody>
    </table>
  `;

  container.appendChild(tableWrap);
  const tbody = tableWrap.querySelector('#expiredTableBody');

  list.forEach(item => {
    const statusObj = window.restaurantStore.calculateStockStatus(item);
    const estimatedLoss = item.quantity * item.costPerUnit;
    const isExpired = statusObj.status === 'Expired';

    const tr = document.createElement('tr');
    tr.className = isExpired ? 'row-expired' : 'row-lowstock';
    tr.innerHTML = `
      <td>
        <strong style="color: var(--gravy-900);">${item.name}</strong>
        <div style="font-size: 0.775rem; color: var(--text-muted);">${item.notes || ''}</div>
      </td>
      <td><span class="badge badge-category">${item.category}</span></td>
      <td><strong>${item.quantity} ${item.unit}</strong></td>
      <td style="color: ${isExpired ? 'var(--status-expired)' : 'var(--status-nearexpiry)'}; font-weight: 700;">${item.expiryDate}</td>
      <td>
        <span class="badge ${statusObj.class}">
          ${isExpired ? `Expired (${Math.abs(statusObj.days)} days ago)` : `Expiring in ${statusObj.days} days`}
        </span>
      </td>
      <td style="font-weight: 700; color: var(--status-expired);">${formatINR(estimatedLoss)}</td>
      <td>
        <button class="btn-toggle-availability make-unavailable" onclick="window.handleDiscardStock('${item.id}', '${item.name.replace(/'/g, "\\'")}', ${item.quantity}, '${item.unit}', ${estimatedLoss})" title="Discard and log to waste">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Mark Discarded
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// -----------------------------------------------------------------------------
// Render Smart Recommendations
// -----------------------------------------------------------------------------
function renderRecommendations(recommendations) {
  const container = document.getElementById('recommendationsGrid');
  if (!container) return;

  container.innerHTML = '';

  if (recommendations.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--bg-cream-border);">
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--gravy-900);">Inventory is in optimal equilibrium!</p>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">No immediate restock or waste risks detected.</p>
      </div>
    `;
    return;
  }

  recommendations.forEach(rec => {
    const card = document.createElement('div');
    card.className = `recommendation-card priority-${rec.priority} reveal`;

    let priorityBadge = '';
    if (rec.priority === 'high') {
      priorityBadge = `<span class="rec-badge" style="background: var(--status-expired-bg); color: var(--status-expired);">Action Needed</span>`;
    } else if (rec.priority === 'medium') {
      priorityBadge = `<span class="rec-badge" style="background: var(--status-lowstock-bg); color: var(--status-lowstock);">Restock Soon</span>`;
    } else {
      priorityBadge = `<span class="rec-badge" style="background: var(--gravy-50); color: var(--gravy-700);">Inventory Tip</span>`;
    }

    card.innerHTML = `
      <div class="rec-header">
        <h4 class="rec-title">${rec.title}</h4>
        ${priorityBadge}
      </div>
      <p class="rec-body">${rec.explanation}</p>
      <div class="rec-metrics">
        <div class="rec-metric-item">
          <span class="rec-metric-label">Current Stock</span>
          <span class="rec-metric-val">${rec.currentQty}</span>
        </div>
        <div class="rec-metric-item">
          <span class="rec-metric-label">Suggested Order</span>
          <span class="rec-metric-val" style="color: var(--gravy-600);">${rec.suggestedQty}</span>
        </div>
        ${rec.estimatedCost > 0 ? `
        <div class="rec-metric-item">
          <span class="rec-metric-label">Est. Value</span>
          <span class="rec-metric-val">${formatINR(rec.estimatedCost)}</span>
        </div>
        ` : ''}
      </div>
      <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.725rem; color: var(--text-muted);">Simulated consumption forecast</span>
        <button class="btn-qty-mini" style="width: auto; padding: 4px 10px; font-size: 0.75rem;" onclick="showToast('Procurement order alert queued for ${rec.item}!', 'success')">
          Acknowledge
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// -----------------------------------------------------------------------------
// Render High Quality SVG Analytics Charts
// -----------------------------------------------------------------------------
function renderAnalytics(state) {
  // Chart 1: Inventory by Category
  const catMap = {};
  state.inventory.forEach(i => {
    catMap[i.category] = (catMap[i.category] || 0) + (i.quantity * i.costPerUnit);
  });

  const catContainer = document.getElementById('chartCategoryDist');
  if (catContainer) {
    const totalVal = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
    const catColors = ['#85411d', '#c26932', '#d97706', '#15803d', '#9a5323'];

    let barsHtml = Object.keys(catMap).map((cat, idx) => {
      const val = catMap[cat];
      const pct = Math.round((val / totalVal) * 100);
      const color = catColors[idx % catColors.length];
      return `
        <div style="margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px; font-weight: 500;">
            <span>${cat}</span>
            <span style="font-weight: 700; color: var(--gravy-900);">${formatINR(val)} (${pct}%)</span>
          </div>
          <div style="width: 100%; height: 10px; background: var(--bg-cream-tint); border-radius: var(--radius-full); overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: ${color}; border-radius: var(--radius-full); transition: width 0.8s ease;"></div>
          </div>
        </div>
      `;
    }).join('');

    catContainer.innerHTML = `<div style="width: 100%; padding: 12px 6px;">${barsHtml}</div>`;
  }

  // Chart 2: Waste by Reason
  const reasonMap = {};
  state.waste.forEach(w => {
    reasonMap[w.reason] = (reasonMap[w.reason] || 0) + (parseFloat(w.estimatedLoss) || 0);
  });

  const wasteContainer = document.getElementById('chartWasteReason');
  if (wasteContainer) {
    const totalWasteLoss = Object.values(reasonMap).reduce((a, b) => a + b, 0) || 1;
    const reasonColors = ['#dc2626', '#ea580c', '#d97706', '#78350f', '#9a5323'];

    let reasonHtml = Object.keys(reasonMap).map((reason, idx) => {
      const loss = reasonMap[reason];
      const pct = Math.round((loss / totalWasteLoss) * 100);
      const color = reasonColors[idx % reasonColors.length];
      return `
        <div style="margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px; font-weight: 500;">
            <span style="color: var(--gravy-900);">${reason}</span>
            <span style="font-weight: 700; color: var(--status-expired);">${formatINR(loss)} (${pct}%)</span>
          </div>
          <div style="width: 100%; height: 10px; background: var(--bg-cream-tint); border-radius: var(--radius-full); overflow: hidden;">
            <div style="width: ${pct}%; height: 100%; background: ${color}; border-radius: var(--radius-full); transition: width 0.8s ease;"></div>
          </div>
        </div>
      `;
    }).join('');

    wasteContainer.innerHTML = `<div style="width: 100%; padding: 12px 6px;">${reasonHtml}</div>`;
  }

  // Estimated Potential Cost Savings
  const savingsBox = document.getElementById('estimatedSavingsVal');
  if (savingsBox) {
    // Projected savings: 65% of recorded waste reduction through early expiry usage and smart restock
    const projectedSavings = Math.round(state.stats.totalWasteLoss * 0.68) + 2450;
    savingsBox.textContent = formatINR(projectedSavings);
  }
}

// -----------------------------------------------------------------------------
// CSV Export Functionality
// -----------------------------------------------------------------------------
function exportInventoryCSV() {
  const items = window.restaurantStore.inventory;
  const headers = ['Product ID', 'Name', 'Category', 'Current Quantity', 'Unit', 'Min Stock', 'Cost Per Unit (INR)', 'Expiry Date', 'Status'];

  const rows = items.map(item => {
    const { status } = window.restaurantStore.calculateStockStatus(item);
    return [
      `"${item.id}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.quantity,
      `"${item.unit}"`,
      item.minStock,
      item.costPerUnit,
      item.expiryDate,
      `"${status}"`
    ].join(',');
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `swad_inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Inventory report exported successfully as CSV!', 'success');
}

// -----------------------------------------------------------------------------
// AI Chatbot UI Renderer & Message Handlers
// -----------------------------------------------------------------------------
function formatMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n•\s/g, '<br>• ')
    .replace(/\n/g, '<br>');
  return html;
}

function renderChatMessages() {
  const container = document.getElementById('chatMessagesContainer');
  if (!container || !window.swadAIChatbot) return;

  const messages = window.swadAIChatbot.messages;
  container.innerHTML = '';

  messages.forEach(msg => {
    const isBot = msg.sender === 'ai';
    const row = document.createElement('div');
    row.className = `chat-row ${isBot ? 'bot' : 'user'}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-row-avatar';
    avatar.innerHTML = isBot
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 22v-4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-4"/><path d="m19.07 4.93-2.83 2.83"/></svg>`
      : `👤`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = `<div>${formatMarkdown(msg.text)}</div>`;

    // Render interactive action buttons inside message
    if (msg.actions && msg.actions.length > 0) {
      const actionsWrap = document.createElement('div');
      actionsWrap.className = 'chat-actions-container';

      msg.actions.forEach((act, actIdx) => {
        const btn = document.createElement('button');
        btn.className = `chat-action-btn ${act.type === 'log_waste' ? 'danger-action' : ''}`;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ${act.label}
        `;
        btn.onclick = () => window.handleExecuteChatAction(act);
        actionsWrap.appendChild(btn);
      });

      bubble.appendChild(actionsWrap);
    }

    row.appendChild(avatar);
    row.appendChild(bubble);
    container.appendChild(row);
  });

  // Scroll to latest message
  container.scrollTop = container.scrollHeight;
}

window.handleSendChatMessage = (customText) => {
  const input = document.getElementById('chatInput');
  const text = (customText || (input ? input.value : "")).trim();
  if (!text) return;

  if (input) input.value = '';

  const bot = window.swadAIChatbot;
  if (!bot) return;

  // Add user message
  bot.messages.push({
    sender: 'user',
    text: text,
    actions: []
  });
  renderChatMessages();

  // Show typing indicator
  const container = document.getElementById('chatMessagesContainer');
  const typingRow = document.createElement('div');
  typingRow.id = 'chatTypingIndicator';
  typingRow.className = 'chat-row bot';
  typingRow.innerHTML = `
    <div class="chat-row-avatar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
    </div>
    <div class="chat-bubble" style="padding: 10px 14px;">
      <div class="typing-dots">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  if (container) {
    container.appendChild(typingRow);
    container.scrollTop = container.scrollHeight;
  }

  // Simulate AI calculation speed
  setTimeout(() => {
    const indicator = document.getElementById('chatTypingIndicator');
    if (indicator) indicator.remove();

    const result = bot.processUserMessage(text);
    bot.messages.push({
      sender: 'ai',
      text: result.text,
      actions: result.actions || []
    });

    renderChatMessages();
  }, 480);
};

window.handleExecuteChatAction = (action) => {
  if (action.type === 'log_waste') {
    const record = window.restaurantStore.addWasteRecord(action.payload);
    showToast(`Logged ₹${action.payload.estimatedLoss} loss for ${action.payload.productName} into Waste Log!`, 'warning');
    // Follow up in chat
    window.swadAIChatbot.messages.push({
      sender: 'ai',
      text: `✅ **Successfully Recorded!**\nAdded ${action.payload.quantity} ${action.payload.unit} of **${action.payload.productName}** into the waste register. Total waste analytics and charts have been refreshed.`,
      actions: [{ label: 'View Waste Products Table', type: 'navigate', payload: '#waste' }]
    });
    renderChatMessages();
  } else if (action.type === 'navigate') {
    const el = document.querySelector(action.payload);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

window.handleClearChat = () => {
  if (window.swadAIChatbot) {
    window.swadAIChatbot.initWelcomeMessage();
    renderChatMessages();
    showToast('Chat history cleared.', 'info');
  }
};

