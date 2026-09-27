import React, { useState } from 'react';
import API from '../services/api';
import { X, Sparkles, AlertCircle, Cpu } from 'lucide-react';

const CATEGORIES = [
  'Full Stack',
  'Frontend',
  'Backend',
  'AI & ML',
  'Mobile App',
  'UI/UX Design',
  'DevOps',
];

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Full Stack',
    tags: '',
    thumbnail: '',
    liveUrl: '',
    githubUrl: '',
    clientArch: 'React 19, Vite, Glassmorphism UI',
    apiArch: 'Node.js, Express REST API, JWT Auth',
    databaseArch: 'MongoDB Atlas NoSQL, Mongoose ODM',
    cloudArch: 'Render Cloud Engine, Vercel Edge',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showArchFields, setShowArchFields] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        thumbnail: formData.thumbnail,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        architecture: {
          client: formData.clientArch,
          api: formData.apiArch,
          database: formData.databaseArch,
          cloud: formData.cloudArch,
        },
      };

      const res = await API.post('/projects', payload);
      if (res.data.success) {
        onProjectCreated(res.data.data);
        onClose();
        setFormData({
          title: '',
          tagline: '',
          description: '',
          category: 'Full Stack',
          tags: '',
          thumbnail: '',
          liveUrl: '',
          githubUrl: '',
          clientArch: 'React 19, Vite, Glassmorphism UI',
          apiArch: 'Node.js, Express REST API, JWT Auth',
          databaseArch: 'MongoDB Atlas NoSQL, Mongoose ODM',
          cloudArch: 'Render Cloud Engine, Vercel Edge',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create stack.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '620px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
          Publish to AetherStack ⚡
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Publish your full-stack architecture and codebase to the creator network
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#f87171',
            fontSize: '0.88rem',
            marginBottom: '16px',
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px' }}>Project Title *</label>
            <input
              type="text"
              required
              name="title"
              className="form-input"
              placeholder="e.g. NexusFlow AI Architecture"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px' }}>Short Tagline *</label>
            <input
              type="text"
              required
              name="tagline"
              className="form-input"
              placeholder="e.g. High-throughput distributed vector search engine on MERN"
              value={formData.tagline}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px' }}>Category *</label>
              <select
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#101522', color: '#fff' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px' }}>Tech Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                className="form-input"
                placeholder="React 19, Node.js, MongoDB Atlas, Redis"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px' }}>Full Description *</label>
            <textarea
              required
              name="description"
              rows={3}
              className="form-input"
              placeholder="Describe the architectural design, database modeling, and unique technical features..."
              value={formData.description}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px' }}>Live Demo URL</label>
              <input
                type="url"
                name="liveUrl"
                className="form-input"
                placeholder="https://yourapp.dev"
                value={formData.liveUrl}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px' }}>GitHub Repo URL</label>
              <input
                type="url"
                name="githubUrl"
                className="form-input"
                placeholder="https://github.com/user/repo"
                value={formData.githubUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px' }}>Thumbnail Image URL</label>
            <input
              type="url"
              name="thumbnail"
              className="form-input"
              placeholder="https://images.unsplash.com/... (optional)"
              value={formData.thumbnail}
              onChange={handleChange}
            />
          </div>

          {/* Toggle Custom Architecture Nodes */}
          <div style={{ marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setShowArchFields(!showArchFields)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Cpu size={15} />
              <span>{showArchFields ? '▲ Hide Custom Architecture Nodes' : '▼ Customize Architecture Blueprint Nodes (Optional)'}</span>
            </button>
          </div>

          {showArchFields && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              border: '1px solid var(--border-color)',
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#818cf8', fontWeight: 600 }}>1. Client Layer</label>
                <input
                  type="text"
                  name="clientArch"
                  className="form-input"
                  value={formData.clientArch}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#c084fc', fontWeight: 600 }}>2. API Layer</label>
                <input
                  type="text"
                  name="apiArch"
                  className="form-input"
                  value={formData.apiArch}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>3. Database Layer</label>
                <input
                  type="text"
                  name="databaseArch"
                  className="form-input"
                  value={formData.databaseArch}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#f472b6', fontWeight: 600 }}>4. Cloud Layer</label>
                <input
                  type="text"
                  name="cloudArch"
                  className="form-input"
                  value={formData.cloudArch}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '13px' }}
          >
            <Sparkles size={18} />
            <span>{loading ? 'Compiling Blueprint...' : 'Publish Architecture & Stack'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
