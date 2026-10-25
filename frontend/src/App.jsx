
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Waves, Fish, CheckCircle, Plus, Pencil, Trash2, Search, RefreshCw, Save, X, Eye } from 'lucide-react'
import './App.css'

const API = import.meta.env.VITE_API_URL

const emptyForm = {
  pondName: '',
  fishSpecies: '',
  areaAcres: '',
  active: true
}

function App() {
  const [ponds, setPonds] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [selectedPond, setSelectedPond] = useState(null)
  const [viewId, setViewId] = useState('')

  const loadPonds = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API}/displayall`)
      setPonds(Array.isArray(response.data) ? response.data : [])
      setError('')
    } catch (err) {
      setError('Unable to load ponds. Check backend connection and API URL.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPonds()
  }, [])

  const updateField = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: name === 'active' ? value === 'true' : value
    })
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  // CREATE
  const addPond = async (payload) => {
    return await axios.post(`${API}/add`, payload)
  }

  // UPDATE
  const updatePond = async (id, payload) => {
    return await axios.put(`${API}/update/${id}`, payload)
  }

  const submitForm = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!form.pondName.trim() || !form.fishSpecies.trim()) {
      setError('Pond name and fish species are required.')
      return
    }

    if (!form.areaAcres || Number(form.areaAcres) <= 0) {
      setError('Area must be greater than zero.')
      return
    }

    const payload = {
      pondName: form.pondName.trim(),
      fishSpecies: form.fishSpecies.trim(),
      areaAcres: Number(form.areaAcres),
      active: form.active
    }

    setSaving(true)
    try {
      if (editingId !== null) {
        await updatePond(editingId, payload)
        setMessage('Pond updated successfully!')
      } else {
        await addPond(payload)
        setMessage('Pond added successfully!')
      }

      resetForm()
      await loadPonds()
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.message || 'Operation failed. Check the backend response.')
    } finally {
      setSaving(false)
    }
  }

  // READ ONE
  const viewPond = async (id) => {
    setMessage('')
    setError('')
    setSelectedPond(null)

    try {
      const response = await axios.get(`${API}/display/id/${id}`)
      setSelectedPond(response.data)
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.message || `Unable to find pond with ID ${id}.`)
    }
  }

  const searchById = async (e) => {
    e.preventDefault()

    if (!viewId || Number(viewId) <= 0) {
      setError('Enter a valid pond ID.')
      return
    }

    await viewPond(Number(viewId))
  }

  const editPond = (pond) => {
    setEditingId(pond.id)
    setForm({
      pondName: pond.pondName || '',
      fishSpecies: pond.fishSpecies || '',
      areaAcres: pond.areaAcres ?? '',
      active: Boolean(pond.active)
    })
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // DELETE
  const deletePond = async (id) => {
    if (!window.confirm(`Delete pond ${id}? This action cannot be undone.`)) return

    setMessage('')
    setError('')

    try {
      await axios.delete(`${API}/delete/${id}`)
      setMessage(`Pond ${id} deleted successfully!`)

      if (editingId === id) resetForm()
      if (selectedPond?.id === id) setSelectedPond(null)

      await loadPonds()
    } catch (err) {
      const data = err.response?.data
      setError(typeof data === 'string' ? data : data?.message || 'Unable to delete pond.')
    }
  }

  const filteredPonds = ponds.filter((pond) =>
    `${pond.pondName} ${pond.fishSpecies} ${pond.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const activeCount = ponds.filter((pond) => pond.active === true).length
  const speciesCount = new Set(ponds.map((pond) => pond.fishSpecies).filter(Boolean)).size

  return (
    <div className="app-shell">
      <nav className="navbar navbar-dark topbar">
        <div className="container-fluid px-lg-4">
          <a className="navbar-brand brand" href="#home">
            <span className="brand-icon"><Waves size={30} /></span>
            <span><strong>AquaCare</strong><small>Pond Management</small></span>
          </a>
          <div className="nav-links">
            <a href="#home" className="nav-link active">Home</a>
            <a href="#pond-form" className="nav-link">Add Pond</a>
            <a href="#pond-records" className="nav-link">View Ponds</a>
          </div>
          <span className="system-label"><Fish size={21} /> Aquaculture System</span>
        </div>
      </nav>

      <main className="container-fluid dashboard px-3 px-lg-4" id="home">
        <section className="hero">
          <div>
            <h1>Welcome to AquaCare</h1>
            <p>Manage your aquaculture ponds efficiently and easily.</p>
          </div>
          <Waves className="hero-icon" size={66} />
        </section>

        {message && (
          <div className="alert alert-success d-flex align-items-center">
            {message}
            <button className="btn-close ms-auto" onClick={() => setMessage('')} />
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            {error}
            <button className="btn-close ms-auto" onClick={() => setError('')} />
          </div>
        )}

        <section className="row g-3 stats-row">
          <div className="col-12 col-md-4">
            <div className="stat-card stat-blue">
              <span className="stat-icon"><Waves size={27} /></span>
              <div><span>Total Ponds</span><h2>{ponds.length}</h2></div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="stat-card stat-green">
              <span className="stat-icon"><CheckCircle size={27} /></span>
              <div><span>Active Ponds</span><h2>{activeCount}</h2></div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="stat-card stat-orange">
              <span className="stat-icon"><Fish size={27} /></span>
              <div><span>Fish Species</span><h2>{speciesCount}</h2></div>
            </div>
          </div>
        </section>

        <section className="panel form-panel" id="pond-form">
          <div className="section-heading">
            <span className="heading-icon"><Plus size={25} /></span>
            <div>
              <h2>{editingId !== null ? `Update Pond #${editingId}` : 'Add New Pond'}</h2>
              <p>The pond ID is generated automatically when adding a new record.</p>
            </div>
          </div>

          <form onSubmit={submitForm}>
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-4">
                <label className="form-label">Pond Name *</label>
                <input className="form-control" name="pondName" value={form.pondName} onChange={updateField} placeholder="Enter pond name" required />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <label className="form-label">Fish Species *</label>
                <input className="form-control" name="fishSpecies" value={form.fishSpecies} onChange={updateField} placeholder="e.g. Rohu, Tilapia" required />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <label className="form-label">Area (acres) *</label>
                <input className="form-control" type="number" name="areaAcres" value={form.areaAcres} onChange={updateField} placeholder="Enter area" min="0.01" step="0.01" required />
              </div>
              <div className="col-12 col-md-6 col-lg-4">
                <label className="form-label">Status *</label>
                <select className="form-select" name="active" value={String(form.active)} onChange={updateField}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="col-12 col-lg-8 form-actions">
                <button className="btn btn-primary submit-btn" type="submit" disabled={saving}>
                  <Save size={18} /> {saving ? 'Saving...' : editingId !== null ? 'Update Pond' : 'Add Pond'}
                </button>
                {editingId !== null && (
                  <button className="btn btn-outline-secondary cancel-btn" type="button" onClick={resetForm}>
                    <X size={18} /> Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>

        <section className="panel" id="pond-search">
          <div className="section-heading">
            <span className="heading-icon"><Eye size={24} /></span>
            <div><h2>Find Pond by ID</h2><p>Retrieve one specific pond from the backend.</p></div>
          </div>

          <form className="row g-2" onSubmit={searchById}>
            <div className="col-12 col-md-8">
              <input className="form-control" type="number" min="1" value={viewId} onChange={(e) => setViewId(e.target.value)} placeholder="Enter pond ID" required />
            </div>
            <div className="col-12 col-md-4">
              <button className="btn btn-primary w-100" type="submit"><Search size={17} /> Find Pond</button>
            </div>
          </form>

          {selectedPond && (
            <div className="single-pond mt-3">
              <h3>Pond Details</h3>
              <p><strong>ID:</strong> {selectedPond.id}</p>
              <p><strong>Name:</strong> {selectedPond.pondName}</p>
              <p><strong>Fish Species:</strong> {selectedPond.fishSpecies}</p>
              <p><strong>Area:</strong> {selectedPond.areaAcres} acres</p>
              <p><strong>Status:</strong> {selectedPond.active ? 'Active' : 'Inactive'}</p>
              <div className="action-buttons">
                <button className="btn btn-primary btn-sm" onClick={() => editPond(selectedPond)}><Pencil size={14} /> Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => deletePond(selectedPond.id)}><Trash2 size={14} /> Delete</button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedPond(null)}><X size={14} /> Close</button>
              </div>
            </div>
          )}
        </section>

        <section className="panel records-panel" id="pond-records">
          <div className="records-heading">
            <div className="section-heading">
              <span className="heading-icon"><Eye size={24} /></span>
              <div><h2>All Pond Records</h2><p>View, edit or delete existing records.</p></div>
            </div>
            <div className="record-tools">
              <div className="search-box">
                <Search size={18} />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, name or species..." />
              </div>
              <button className="btn btn-outline-primary refresh-btn" onClick={loadPonds} aria-label="Refresh ponds">
                <RefreshCw size={19} />
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table pond-table align-middle">
              <thead>
                <tr><th>ID</th><th>Pond Name</th><th>Fish Species</th><th>Area (acres)</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="table-message"><span className="spinner-border spinner-border-sm me-2" />Loading records...</td></tr>
                ) : filteredPonds.length === 0 ? (
                  <tr><td colSpan="6" className="table-message">{search ? 'No matching ponds found.' : 'No pond records found. Add your first pond above.'}</td></tr>
                ) : (
                  filteredPonds.map((pond) => (
                    <tr key={pond.id}>
                      <td>{pond.id}</td>
                      <td className="pond-name">{pond.pondName}</td>
                      <td>{pond.fishSpecies}</td>
                      <td>{pond.areaAcres}</td>
                      <td>
                        <span className={`status-badge ${pond.active ? 'status-active' : 'status-inactive'}`}>
                          {pond.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => viewPond(pond.id)}><Eye size={14} /> View</button>
                          <button className="btn btn-sm btn-primary" onClick={() => editPond(pond)}><Pencil size={14} /> Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deletePond(pond.id)}><Trash2 size={14} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="records-footer">Showing {filteredPonds.length} of {ponds.length} records</div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} AquaCare. All rights reserved.</span>
        <span><Waves size={17} /> Healthy Ponds | Healthy Future</span>
      </footer>
    </div>
  )
}

export default App
