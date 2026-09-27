import React, { useState, useEffect } from 'react';
import API from './services/api';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import CreateProjectModal from './components/CreateProjectModal';
import ProjectCard from './components/ProjectCard';
import ProjectDetailsModal from './components/ProjectDetailsModal';
import { Search, Sparkles, Layers, Flame, ArrowUpRight, Cpu, Activity, Compass } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Full Stack',
  'Frontend',
  'Backend',
  'AI & ML',
  'Mobile App',
  'UI/UX Design',
  'DevOps',
];

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modal states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch Projects from Backend
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get('/projects', {
        params: {
          category: selectedCategory,
          search: searchTerm,
          sort: sortBy,
        },
      });
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchTerm, sortBy]);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  const handleProjectDeleted = (deletedId) => {
    setProjects(projects.filter((p) => p._id !== deletedId));
    if (selectedProject?._id === deletedId) {
      setSelectedProject(null);
    }
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects(projects.map((p) => (p._id === updatedProject._id ? updatedProject : p)));
    setSelectedProject(updatedProject);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '80px' }}>
        {/* AetherStack Hero Section */}
        <section style={{ textAlign: 'center', padding: '64px 0 44px', position: 'relative' }}>
          {/* Glowing Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: 'var(--radius-full)',
            color: '#818cf8',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '22px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)',
          }}>
            <Cpu size={16} />
            <span>The Full-Stack System Architecture & Creator Matrix</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-1.5px',
            marginBottom: '20px',
          }}>
            Architect, Showcase & Explore <br />
            <span style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Next-Gen Software Stacks
            </span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.15rem',
            maxWidth: '680px',
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}>
            Inspect live system blueprints, review technical architecture node-flows, upvote extraordinary software, and collaborate with top developers.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={() => setIsCreateOpen(true)} className="btn-gradient">
              <Sparkles size={18} />
              <span>Publish Architecture Stack</span>
              <ArrowUpRight size={18} />
            </button>
            <a href="#matrix" className="btn-outline">
              <Compass size={18} />
              <span>Explore Blueprints</span>
            </a>
          </div>
        </section>

        {/* Matrix Controls & Search */}
        <section id="matrix" style={{ marginBottom: '36px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            background: 'rgba(16, 21, 34, 0.7)',
            backdropFilter: 'blur(12px)',
            padding: '22px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          }}>
            {/* Search Input & Sort Selector */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search architecture by keyword, tech stack, tags, or creator..."
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort Selector */}
              <select
                className="form-input"
                style={{ width: 'auto', minWidth: '180px', cursor: 'pointer' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest" style={{ background: '#101522', color: '#fff' }}>⚡ Latest Stacks</option>
                <option value="popular" style={{ background: '#101522', color: '#fff' }}>🔥 Top Rated / Popular</option>
              </select>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: isActive ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dynamic Project Stacks Grid */}
        <section>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
              <div style={{
                width: '42px',
                height: '42px',
                border: '3px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }}></div>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <p>Synchronizing architecture stacks from MongoDB Atlas...</p>
            </div>
          ) : projects.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDelete={handleProjectDeleted}
                  onRequireAuth={() => setIsAuthOpen(true)}
                  onSelectProject={(p) => setSelectedProject(p)}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Flame size={48} color="#6366f1" style={{ marginBottom: '16px', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>No architecture stacks found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px' }}>
                {searchTerm || selectedCategory !== 'All'
                  ? 'Try adjusting your search queries or category filters.'
                  : 'Be the first pioneer to publish an architecture blueprint on AetherStack!'}
              </p>
              <button onClick={() => setIsCreateOpen(true)} className="btn-gradient">
                <Sparkles size={18} />
                <span>Publish the First Stack</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '34px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.88rem',
      }}>
        <p>⚡ <strong>AetherStack OS</strong> • The MERN Architecture & Creator Matrix (MongoDB Atlas • Express • React 19 • Node.js)</p>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onProjectUpdated={handleProjectUpdated}
        onRequireAuth={() => setIsAuthOpen(true)}
      />
    </div>
  );
}

export default App;
