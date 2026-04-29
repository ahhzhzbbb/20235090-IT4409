import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://jsonplaceholder.typicode.com/users'
const emptyForm = { name: '', email: '', phone: '' }

export default function App() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const isEditing = editingId !== null

  useEffect(() => {
    let active = true

    async function loadUsers() {
      try {
        setLoading(true)
        setError('')

        const { data } = await axios.get(API_URL)
        if (active) {
          setUsers(data)
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || 'Có lỗi khi tải dữ liệu.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      active = false
    }
  }, [])

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name || !form.email || !form.phone) {
      setError('Vui lòng nhập đủ thông tin.')
      setMessage('')
      return
    }

    try {
      setError('')
      setMessage('')

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      }

      if (editingId) {
        const { data: updatedUser } = await axios.put(`${API_URL}/${editingId}`, payload)
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === editingId ? { ...user, ...payload, ...updatedUser } : user
          )
        )
        setEditingId(null)
        setMessage('Đã cập nhật user.')
      } else {
        const { data: createdUser } = await axios.post(API_URL, payload)
        const nextId = Math.max(...users.map((user) => user.id), 0) + 1
        setUsers((currentUsers) => [{ id: createdUser.id ?? nextId, ...payload }, ...currentUsers])
        setMessage('Đã thêm user mới.')
      }

      setForm(emptyForm)
    } catch (submitError) {
      setError(submitError.message || 'Có lỗi xảy ra.')
      setMessage('')
    }
  }

  async function handleDelete(userId) {
    const confirmed = window.confirm('Bạn có muốn xóa user này không?')
    if (!confirmed) return

    try {
      setError('')
      setMessage('')

      await axios.delete(`${API_URL}/${userId}`)

      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId))
      if (editingId === userId) {
        setEditingId(null)
        setForm(emptyForm)
      }
      setMessage('Đã xóa user.')
    } catch (deleteError) {
      setError(deleteError.message || 'Có lỗi xảy ra.')
      setMessage('')
    }
  }

  function startEdit(user) {
    setEditingId(user.id)
    setForm({ name: user.name, email: user.email, phone: user.phone })
    setError('')
    setMessage('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setMessage('')
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <main className="app">
      <h1>User CRUD</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleFormChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleFormChange}
          required
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={handleFormChange}
          required
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
        {isEditing ? (
          <button type="button" className="secondary" onClick={cancelEdit}>
            Cancel
          </button>
        ) : null}
      </form>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <span>
          {filteredUsers.length}/{users.length}
        </span>
      </div>

      {error ? <p className="notice error">{error}</p> : null}
      {message ? <p className="notice success">{message}</p> : null}

      {loading ? (
        <p>Loading...</p>
      ) : filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="table-wrap">
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
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button type="button" onClick={() => startEdit(user)}>
                      Edit
                    </button>
                    <button type="button" className="danger" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
