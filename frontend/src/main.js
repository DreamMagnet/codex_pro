const API_BASE = 'http://127.0.0.1:8000/api/items'

const form = document.getElementById('item-form')
const input = document.getElementById('item-text')
const list = document.getElementById('item-list')

async function loadItems() {
  const res = await fetch(API_BASE)
  const items = await res.json()
  list.innerHTML = ''
  for (const item of items) {
    const li = document.createElement('li')
    const span = document.createElement('span')
    span.textContent = item.text
    const del = document.createElement('button')
    del.textContent = 'Delete'
    del.onclick = () => deleteItem(item.id)
    li.append(span, del)
    list.append(li)
  }
}

async function deleteItem(id) {
  await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
  loadItems()
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (!text) return
  await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  input.value = ''
  loadItems()
})

loadItems()
