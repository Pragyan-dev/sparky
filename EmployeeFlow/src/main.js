import './style.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // Auto update or prompt
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

// Sample inventory data
const inventoryItems = [
  { id: 2, sku: 'BV-002', name: 'Coca-Cola', category: 'Beverages', stock: 36, price: 2.49, aisle: 'A4', lastRestocked: '2023-10-25', expiryDate: '2024-06-15', status: 'In Stock' },
  { id: 3, sku: 'SN-001', name: 'Lay\'s Chips', category: 'Snacks', stock: 18, price: 3.99, aisle: 'B2', lastRestocked: '2023-10-20', expiryDate: '2024-03-10', status: 'Low Stock' },
  { id: 4, sku: 'CN-003', name: 'Snickers Bar', category: 'Candy', stock: 42, price: 1.49, aisle: 'C1', lastRestocked: '2023-10-22', expiryDate: '2024-09-20', status: 'In Stock' },
  { id: 5, sku: 'BV-003', name: 'Red Bull', category: 'Beverages', stock: 15, price: 3.49, aisle: 'A5', lastRestocked: '2023-10-26', expiryDate: '2025-01-15', status: 'Low Stock' },
  { id: 6, sku: 'SN-002', name: 'Doritos', category: 'Snacks', stock: 12, price: 4.29, aisle: 'B2', lastRestocked: '2023-10-18', expiryDate: '2024-02-28', status: 'Critical' },
  { id: 7, sku: 'HH-001', name: 'Paper Towels', category: 'Household', stock: 50, price: 12.99, aisle: 'D3', lastRestocked: '2023-10-27', expiryDate: 'N/A', status: 'In Stock' },
  { id: 8, sku: 'PC-004', name: 'Shampoo', category: 'Personal Care', stock: 8, price: 6.99, aisle: 'E1', lastRestocked: '2023-10-15', expiryDate: '2025-05-01', status: 'Critical' },
]

document.querySelector('#app').innerHTML = `
  <nav class="navbar">
    <div class="navbar-brand">
      <span class="logo">ZipE</span>
      <span class="subtitle">Employee Portal</span>
    </div>
  </nav>

  <div class="main-container">
    <div class="header">
      <h1>Inventory Management</h1>
      <button id="addNewBtn" class="add-new-btn">+ Add New Listing</button>
    </div>

    <div class="table-container">
      <table class="inventory-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock Level</th>
            <th>Aisle</th>
            <th>Last Restocked</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="inventoryGrid">
          <!-- Table rows will be injected here -->
        </tbody>
      </table>
    </div>
  </div>

  <div id="videoContainer" class="video-container">
    <nav class="navbar video-navbar">
      <div class="video-navbar-message">Click an item</div>
    </nav>
    <video id="videoPlayer" playsinline preload="auto">
      <source src="/footage_fixed.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <button id="backBtn" class="back-btn">← Back</button>
  </div>

  <div id="clickNotification" class="click-notification">
    Item Scanned
  </div>

  <div id="stockModal" class="modal">
    <div class="modal-content loading-modal">
      <div class="loading-spinner"></div>
      <h2>Processing</h2>
      <p class="loading-text">Analyzing product...</p>
    </div>
  </div>

  <div id="confirmationScreen" class="confirmation-screen">
    <div class="confirmation-content product-detection">
      <div class="product-header">
        <img src="/tea_img.svg" alt="Arizona Green Tea" class="product-image" />
        <h2>Product Detected</h2>
        <p class="product-name">Arizona Green Tea with Ginseng and Honey</p>
      </div>

      <div class="product-info-section">
        <div class="info-group">
          <label>Ingredients (Detected)</label>
          <div class="ingredients-list">
            <span class="ingredient-tag">Premium brewed green tea using filtered water</span>
            <span class="ingredient-tag">High fructose corn syrup (glucose-fructose syrup)</span>
            <span class="ingredient-tag">Honey</span>
            <span class="ingredient-tag">Citric acid</span>
            <span class="ingredient-tag">Natural flavors</span>
            <span class="ingredient-tag">Ascorbic acid (vitamin C)</span>
            <span class="ingredient-tag">Panax ginseng root extract (or ginseng extract)</span>
          </div>
        </div>

        <div class="info-group">
          <label>Dietary Classifications (Detected)</label>
          <div class="dietary-grid">
            <div class="dietary-item">
              <span class="dietary-label">Vegetarian</span>
              <span class="dietary-value yes">Yes</span>
            </div>
            <div class="dietary-item">
              <span class="dietary-label">Non-Vegetarian</span>
              <span class="dietary-value no">No</span>
            </div>
            <div class="dietary-item">
              <span class="dietary-label">Vegan</span>
              <span class="dietary-value yes">Yes</span>
            </div>
            <div class="dietary-item">
              <span class="dietary-label">Halal</span>
              <span class="dietary-value yes">Yes</span>
            </div>
            <div class="dietary-item">
              <span class="dietary-label">Kosher</span>
              <span class="dietary-value no">No</span>
            </div>
            <div class="dietary-item">
              <span class="dietary-label">Common Allergies</span>
              <span class="dietary-value no">No</span>
            </div>
          </div>
        </div>

        <div class="info-group">
          <label for="productPrice">Price per Unit</label>
          <input type="number" id="productPrice" class="stock-quantity-input" min="0" step="0.01" value="2.99" placeholder="Enter price" />
        </div>

        <div class="info-group">
          <label for="stockQuantity">Stock Quantity to List</label>
          <input type="number" id="stockQuantity" class="stock-quantity-input" min="1" value="24" placeholder="Enter quantity" />
        </div>
      </div>

      <div class="modal-actions">
        <button id="cancelDetectionBtn" class="btn-secondary">Cancel</button>
        <button id="confirmDetectionBtn" class="btn-primary">Confirm & List on ZipE</button>
      </div>
    </div>
  </div>

  <div id="successScreen" class="confirmation-screen">
    <div class="confirmation-content">
      <div class="confirmation-icon">✓</div>
      <h2>Successfully Listed!</h2>
      <p>Arizona Green Tea has been listed on ZipE for customers.</p>
      <button id="successOkBtn" class="btn-primary">Done</button>
    </div>
  </div>
`

const addNewBtn = document.getElementById('addNewBtn')
const inventoryGrid = document.getElementById('inventoryGrid')
const videoContainer = document.getElementById('videoContainer')
const videoPlayer = document.getElementById('videoPlayer')
const stockModal = document.getElementById('stockModal')
const clickNotification = document.getElementById('clickNotification')
const confirmationScreen = document.getElementById('confirmationScreen')
const successScreen = document.getElementById('successScreen')
const cancelDetectionBtn = document.getElementById('cancelDetectionBtn')
const confirmDetectionBtn = document.getElementById('confirmDetectionBtn')
const successOkBtn = document.getElementById('successOkBtn')
const productPrice = document.getElementById('productPrice')
const stockQuantity = document.getElementById('stockQuantity')

// Ensure video is loaded and set playback speed
videoPlayer.load()
videoPlayer.playbackRate = 0.8

// Track which events have been triggered
let triggeredEvents = {
  clickDetected: false,
  modalShown: false,
  confirmationShown: false
}

// Time-based video triggers
videoPlayer.addEventListener('timeupdate', () => {
  const currentTime = videoPlayer.currentTime

  // 3.1 seconds - Show "Click Detected" notification
  if (currentTime >= 3.1 && !triggeredEvents.clickDetected) {
    triggeredEvents.clickDetected = true
    clickNotification.classList.add('active')

    // Auto-hide after 1 second
    setTimeout(() => {
      clickNotification.classList.remove('active')
    }, 1000)
  }

  // 4 seconds - Show update stock modal (video continues playing)
  if (currentTime >= 4.0 && !triggeredEvents.modalShown) {
    triggeredEvents.modalShown = true
    stockModal.classList.add('active')
  }
})

// Reset triggered events when video is reset
function resetVideoTriggers() {
  triggeredEvents = {
    clickDetected: false,
    modalShown: false,
    confirmationShown: false
  }
}

// Render inventory items as table rows
function renderInventory() {
  inventoryGrid.innerHTML = inventoryItems.map(item => {
    // Determine status badge class
    let statusClass = 'status-ok'
    if (item.stock < 10) statusClass = 'status-critical'
    else if (item.stock < 20) statusClass = 'status-warning'

    return `
    <tr>
      <td class="font-mono text-sm">${item.sku}</td>
      <td class="font-medium">${item.name}</td>
      <td>${item.category}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <div class="stock-badge ${statusClass}">
          <span class="stock-dot"></span>
          ${item.stock} Units
        </div>
      </td>
      <td>${item.aisle}</td>
      <td class="text-secondary">${item.lastRestocked}</td>
      <td class="text-secondary">${item.expiryDate}</td>
      <td>
        <button class="edit-btn" data-id="${item.id}">Edit</button>
      </td>
    </tr>
  `}).join('')

  // Add click handlers to edit buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const itemId = parseInt(btn.dataset.id)
      openStockModal(itemId)
    })
  })
}

// Add new listing - play video after delay
addNewBtn.addEventListener('click', () => {
  // Add clicked state
  addNewBtn.classList.add('clicked')

  // Wait 1 second before loading video
  setTimeout(() => {
    addNewBtn.classList.remove('clicked')
    playVideoForItem()
  }, 1000)
})

// Play video for item
async function playVideoForItem() {
  videoContainer.classList.add('active')

  try {
    if (videoPlayer.readyState < 3) {
      console.log('Waiting for video to load...')
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Video load timeout')), 10000)
        videoPlayer.addEventListener('canplay', () => {
          clearTimeout(timeout)
          resolve()
        }, { once: true })
        videoPlayer.load()
      })
    }

    console.log('Playing video...')
    // Slow down video playback by 20% (play at 80% speed)
    videoPlayer.playbackRate = 0.8
    await videoPlayer.play()
  } catch (e) {
    console.error("Error playing video:", e)
    alert(`Error playing video: ${e.message}`)
    videoContainer.classList.remove('active')
  }
}

// Back button handler
document.getElementById('backBtn').addEventListener('click', () => {
  videoContainer.classList.remove('active')
  videoPlayer.currentTime = 0
  videoPlayer.pause()
  videoPlayer.playbackRate = 0.8
  resetVideoTriggers()
})

// Cancel detection - go back to main page
cancelDetectionBtn.addEventListener('click', () => {
  confirmationScreen.classList.remove('active')
  videoContainer.classList.remove('active')
  videoPlayer.currentTime = 0
  videoPlayer.pause()
  videoPlayer.playbackRate = 0.8
  resetVideoTriggers()
})

// Confirm detection - add to inventory and show success screen
confirmDetectionBtn.addEventListener('click', () => {
  const quantity = parseInt(stockQuantity.value)
  const price = parseFloat(productPrice.value)

  // Create new item for Arizona Green Tea
  const newItem = {
    id: Date.now(), // Generate unique ID
    sku: 'BV-001',
    name: 'Arizona Green Tea with Ginseng and Honey',
    category: 'Beverages',
    stock: quantity,
    price: price,
    aisle: 'A4',
    lastRestocked: new Date().toISOString().split('T')[0],
    expiryDate: '2025-06-01',
    status: quantity >= 20 ? 'In Stock' : quantity >= 10 ? 'Low Stock' : 'Critical'
  }

  // Add to beginning of array
  inventoryItems.unshift(newItem)

  // Re-render inventory table
  renderInventory()

  // Show success screen
  confirmationScreen.classList.remove('active')
  successScreen.classList.add('active')
})

// Success screen OK button - go back to main page
successOkBtn.addEventListener('click', () => {
  successScreen.classList.remove('active')
  videoContainer.classList.remove('active')
  videoPlayer.currentTime = 0
  videoPlayer.pause()
  videoPlayer.playbackRate = 0.8
  resetVideoTriggers()
})

// Video ended event - show confirmation screen
videoPlayer.addEventListener('ended', () => {
  // Don't hide video, keep it paused on last frame
  videoPlayer.pause()

  // Close modal if it's open and show confirmation screen
  if (!triggeredEvents.confirmationShown) {
    triggeredEvents.confirmationShown = true
    stockModal.classList.remove('active')
    confirmationScreen.classList.add('active')
  }
})

// Open stock modal (for table edit buttons)
function openStockModal(itemId) {
  const item = inventoryItems.find(i => i.id === itemId)
  if (item) {
    // For now, just log - this is for the table edit buttons
    console.log('Edit item:', item)
    alert(`Edit functionality for ${item.name} - Stock: ${item.stock}`)
  }
}

// Initial render
renderInventory()
