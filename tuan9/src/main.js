import './style.css'

const API_URL = 'https://jsonplaceholder.typicode.com/users'
const app = document.querySelector('#app')

const state = {
  users: [],
  search: '',
  editingUserId: null,
  loading: true,
  error: '',
  message: ''
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getFilteredUsers() {
  return state.users.filter((user) =>
    user.name.toLowerCase().includes(state.search.toLowerCase())
  )
}

function getFormValues() {
  const form = document.querySelector('#user-form')
  const formData = new FormData(form)

  return {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim()
  }
}

function setFormValues(user = { name: '', email: '', phone: '' }) {
  document.querySelector('#name').value = user.name
  document.querySelector('#email').value = user.email
  document.querySelector('#phone').value = user.phone
}

function renderShell() {
  app.innerHTML = `
    <main class="page-shell">
      <section class="hero-card">
        <div>
          <p class="eyebrow">Exercise 9</p>
          <h1>User CRUD App</h1>
          <p class="hero-text">Fetch users from JSONPlaceholder, then add, edit, delete, and search them from one simple screen.</p>
        </div>
        <div class="stats">
          <div>
            <span class="stat-label">Total users</span>
            <strong id="total-count">0</strong>
          </div>
          <div>
            <span class="stat-label">Showing</span>
            <strong id="showing-count">0</strong>
          </div>
        </div>
      </section>

      <section class="panel controls">
        <div class="search-row">
          <div>
            <h2>Search</h2>
            <p>Filter by name.</p>
          </div>
          <input id="search-input" class="search-input" type="search" placeholder="Type a name..." value="">
        </div>
      </section>

      <section class="panel form-panel">
        <div class="section-heading">
          <div>
            <h2 id="form-title">Add user</h2>
            <p id="form-description">Create a new user entry.</p>
          </div>
          <button id="cancel-edit" class="ghost-button is-hidden" type="button">Cancel edit</button>
        </div>

        <form id="user-form" class="user-form">
          <label>
            Name
            <input id="name" name="name" type="text" autocomplete="off" required placeholder="Enter name">
          </label>
          <label>
            Email
            <input id="email" name="email" type="email" autocomplete="off" required placeholder="Enter email">
          </label>
          <label>
            Phone
            <input id="phone" name="phone" type="text" autocomplete="off" required placeholder="Enter phone">
          </label>
          <button id="submit-button" class="primary-button" type="submit">Add user</button>
        </form>
      </section>

      <section id="notice-zone"></section>

      <section class="panel table-panel">
        <div class="section-heading">
          <div>
            <h2>User list</h2>
            <p>Read, update, and delete users from the table below.</p>
          </div>
        </div>

        <div id="table-zone"></div>
      </section>
    </main>
  `

  document.querySelector('#search-input').addEventListener('input', (event) => {
    state.search = event.target.value
    renderTable()
    updateStats()
  })

  document.querySelector('#user-form').addEventListener('submit', handleSubmit)

  document.querySelector('#cancel-edit').addEventListener('click', () => {
    state.editingUserId = null
    state.message = ''
    setFormValues()
    syncFormMode()
    renderNotice()
  })
}

function updateStats() {
  const filteredUsers = getFilteredUsers()
  document.querySelector('#total-count').textContent = state.users.length
  document.querySelector('#showing-count').textContent = filteredUsers.length
}

function renderNotice() {
  const noticeZone = document.querySelector('#notice-zone')

  if (state.error) {
    noticeZone.innerHTML = `<section class="notice error">${escapeHtml(state.error)}</section>`
    return
  }

  if (state.message) {
    noticeZone.innerHTML = `<section class="notice success">${escapeHtml(state.message)}</section>`
    return
  }

  noticeZone.innerHTML = ''
}

function syncFormMode() {
  const editing = Boolean(state.editingUserId)

  document.querySelector('#form-title').textContent = editing ? 'Edit user' : 'Add user'
  document.querySelector('#form-description').textContent = editing
    ? 'Update the selected user.'
    : 'Create a new user entry.'
  document.querySelector('#submit-button').textContent = editing ? 'Update user' : 'Add user'
  document.querySelector('#cancel-edit').classList.toggle('is-hidden', !editing)
}

function renderTable() {
  const tableZone = document.querySelector('#table-zone')
  const filteredUsers = getFilteredUsers()

  if (state.loading) {
    tableZone.innerHTML = '<div class="state-box">Loading users...</div>'
    return
  }

  if (filteredUsers.length === 0) {
    tableZone.innerHTML = '<div class="state-box">No users found.</div>'
    return
  }

  tableZone.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filteredUsers
            .map(
              (user) => `
                <tr>
                  <td>${escapeHtml(user.name)}</td>
                  <td>${escapeHtml(user.email)}</td>
                  <td>${escapeHtml(user.phone)}</td>
                  <td>
                    <div class="action-group">
                      <button class="small-button" data-action="edit" data-id="${user.id}" type="button">Edit</button>
                      <button class="small-button danger" data-action="delete" data-id="${user.id}" type="button">Delete</button>
                    </div>
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `

  document.querySelectorAll('[data-action="edit"]').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = Number(button.dataset.id)
      const user = state.users.find((item) => item.id === userId)

      if (!user) return

      state.editingUserId = userId
      state.message = ''
      syncFormMode()
      renderNotice()
      setFormValues(user)
    })
  })

  document.querySelectorAll('[data-action="delete"]').forEach((button) => {
    button.addEventListener('click', () => {
      handleDelete(Number(button.dataset.id))
    })
  })
}

function renderAppState() {
  updateStats()
  syncFormMode()
  renderNotice()
  renderTable()
}

async function loadUsers() {
  try {
    state.loading = true
    state.error = ''
    renderAppState()

    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error('Không tải được dữ liệu users.')
    }

    state.users = await response.json()
  } catch (error) {
    state.error = error.message || 'Có lỗi khi tải dữ liệu.'
  } finally {
    state.loading = false
    renderAppState()
  }
}

async function handleSubmit(event) {
  event.preventDefault()
  const values = getFormValues()

  if (!values.name || !values.email || !values.phone) {
    state.error = 'Vui lòng nhập đủ thông tin.'
    renderNotice()
    return
  }

  try {
    state.error = ''

    if (state.editingUserId) {
      const response = await fetch(`${API_URL}/${state.editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        throw new Error('Không cập nhật được user.')
      }

      const updatedUser = await response.json()
      state.users = state.users.map((user) =>
        user.id === state.editingUserId ? { ...user, ...values, ...updatedUser } : user
      )
      state.message = 'Đã cập nhật user.'
      state.editingUserId = null
      setFormValues()
      syncFormMode()
    } else {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        throw new Error('Không thêm được user.')
      }

      const createdUser = await response.json()
      const nextId = Math.max(...state.users.map((user) => user.id), 0) + 1
      state.users = [{ id: createdUser.id ?? nextId, ...values }, ...state.users]
      state.message = 'Đã thêm user mới.'
      setFormValues()
    }

    renderAppState()
  } catch (error) {
    state.error = error.message || 'Có lỗi xảy ra.'
    renderNotice()
  }
}

async function handleDelete(userId) {
  const confirmed = window.confirm('Bạn có muốn xóa user này không?')

  if (!confirmed) {
    return
  }

  try {
    state.error = ''

    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Không xóa được user.')
    }

    state.users = state.users.filter((user) => user.id !== userId)

    if (state.editingUserId === userId) {
      state.editingUserId = null
      setFormValues()
      syncFormMode()
    }

    state.message = 'Đã xóa user.'
    renderAppState()
  } catch (error) {
    state.error = error.message || 'Có lỗi xảy ra.'
    renderNotice()
  }
}

renderShell()
renderAppState()
loadUsers()
