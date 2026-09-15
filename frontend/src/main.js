const API_BASE = location.protocol === 'file:' ? 'http://127.0.0.1:8000/api/items' : '/api/items'

const form = document.getElementById('item-form')
const input = document.getElementById('item-text')
const list = document.getElementById('item-list')
const searchInput = document.getElementById('search-items')
const clearSearch = document.getElementById('clear-search')
const refreshButton = document.getElementById('refresh-items')
const collectionTitle = document.getElementById('collection-title')
const itemCount = document.getElementById('item-count')
const listState = document.getElementById('list-state')
const stateText = document.getElementById('state-text')
const feedback = document.getElementById('feedback')
const activity = document.getElementById('activity')

let loadController = null
let searchTimer = null
let mutationInProgress = false

function renderIcons() {
  lucide.createIcons({ attrs: { 'aria-hidden': 'true' } })
}

function showError(error) {
  feedback.textContent = error instanceof TypeError
    ? 'Unable to connect to the server.'
    : error.message
  feedback.hidden = false
}

async function request(path = '', options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options)
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(typeof body.detail === 'string' ? body.detail : 'The request could not be completed.')
  }
  return response.json()
}

function updateControls() {
  input.disabled = mutationInProgress
  form.querySelector('button').disabled = mutationInProgress
  refreshButton.disabled = mutationInProgress || Boolean(loadController)
  refreshButton.classList.toggle('is-loading', Boolean(loadController))
  list.querySelectorAll('button').forEach((button) => {
    button.disabled = mutationInProgress || Boolean(loadController)
  })
}

function createActionButton(iconName, label, action, handler) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `icon-button${action === 'delete' ? ' danger' : ''}`
  button.setAttribute('aria-label', label)
  button.dataset.tooltip = action === 'delete' ? 'Delete item' : 'Duplicate item'
  button.dataset.action = action
  const icon = document.createElement('i')
  icon.dataset.lucide = iconName
  button.append(icon)
  button.addEventListener('click', handler)
  return button
}

function renderItems(items) {
  list.replaceChildren()
  for (const item of items) {
    const row = document.createElement('li')
    row.className = 'item-row'
    row.dataset.itemId = item.id
    const marker = document.createElement('span')
    marker.className = 'item-marker'
    marker.setAttribute('aria-hidden', 'true')
    const icon = document.createElement('i')
    icon.dataset.lucide = 'file-text'
    marker.append(icon)
    const text = document.createElement('span')
    text.className = 'item-text'
    text.textContent = item.text
    const actions = document.createElement('div')
    actions.className = 'item-actions'
    actions.append(
      createActionButton('copy', `Duplicate ${item.text}`, 'duplicate', () =>
        mutate(`/${encodeURIComponent(item.id)}/duplicate`, { method: 'POST' }, 'Item duplicated.')),
      createActionButton('trash-2', `Delete ${item.text}`, 'delete', () =>
        mutate(`/${encodeURIComponent(item.id)}`, { method: 'DELETE' }, 'Item deleted.')),
    )
    row.append(marker, text, actions)
    list.append(row)
  }
  renderIcons()
}

async function loadItems() {
  loadController?.abort()
  const controller = new AbortController()
  loadController = controller
  const query = searchInput.value.trim()
  collectionTitle.textContent = query ? 'Search results' : 'All items'
  clearSearch.hidden = !searchInput.value
  itemCount.textContent = 'Loading...'
  list.setAttribute('aria-busy', 'true')
  if (!list.children.length) {
    list.hidden = true
    listState.hidden = false
    stateText.textContent = 'Loading items...'
  }
  updateControls()

  try {
    const path = query ? `/search?query=${encodeURIComponent(query)}` : ''
    const items = await request(path, { signal: controller.signal })
    if (controller.signal.aborted) return
    renderItems(items)
    const singularLabel = query ? 'match' : 'item'
    const pluralLabel = query ? 'matches' : 'items'
    const countLabel = items.length === 1 ? singularLabel : pluralLabel
    itemCount.textContent = `${items.length} ${countLabel}`
    list.hidden = items.length === 0
    listState.hidden = items.length > 0
    stateText.textContent = query ? 'No matching items' : 'No items yet'
  } catch (error) {
    if (controller.signal.aborted) return
    list.replaceChildren()
    list.hidden = true
    listState.hidden = false
    stateText.textContent = 'Items unavailable'
    itemCount.textContent = 'Unavailable'
    showError(error)
  } finally {
    if (loadController === controller) {
      loadController = null
      list.setAttribute('aria-busy', 'false')
      updateControls()
    }
  }
}

async function mutate(path, options, message, afterSuccess) {
  if (mutationInProgress) return false
  const focusedControl = document.activeElement
  const focusedItemId = focusedControl.closest('.item-row')?.dataset.itemId
  const focusedAction = focusedControl.dataset.action
  mutationInProgress = true
  feedback.hidden = true
  activity.textContent = ''
  updateControls()

  try {
    await request(path, options)
    afterSuccess?.()
    activity.textContent = message
    clearTimeout(searchTimer)
    await loadItems()
    return true
  } catch (error) {
    showError(error)
    return false
  } finally {
    mutationInProgress = false
    updateControls()
    if (focusedItemId && document.activeElement === document.body) {
      const row = Array.from(list.children).find((item) => item.dataset.itemId === focusedItemId)
      const button = row?.querySelector(`[data-action="${focusedAction}"]`)
      const focusTarget = button || input
      focusTarget.focus()
    }
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const text = input.value.trim()
  if (!text) {
    input.setCustomValidity('Enter an item name.')
    input.reportValidity()
    return
  }
  const added = await mutate('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }, 'Item added.', () => {
    input.value = ''
  })
  if (added && (document.activeElement === document.body || form.contains(document.activeElement))) input.focus()
})

input.addEventListener('input', () => input.setCustomValidity(''))

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer)
  loadController?.abort()
  clearSearch.hidden = !searchInput.value
  feedback.hidden = true
  activity.textContent = ''
  searchTimer = setTimeout(loadItems, 200)
})

clearSearch.addEventListener('click', () => {
  clearTimeout(searchTimer)
  searchInput.value = ''
  feedback.hidden = true
  searchInput.focus()
  loadItems()
})

refreshButton.addEventListener('click', () => {
  clearTimeout(searchTimer)
  feedback.hidden = true
  loadItems()
})

renderIcons()
loadItems()
