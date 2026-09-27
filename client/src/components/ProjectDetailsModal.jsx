import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import ArchitectureBlueprint from './ArchitectureBlueprint';
import BenchmarkSimulator from './BenchmarkSimulator';
import InteractiveLiveApiTester from './InteractiveLiveApiTester';
import {
  X,
  Heart,
  ExternalLink,
  Code2,
  Send,
  MessageSquare,
  Sparkles,
  Gauge,
  Terminal,
  Layers,
  Cpu,
} from 'lucide-react';

const ProjectDetailsModal = ({ project, isOpen, onClose, onProjectUpdated, onRequireAuth }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(project?.comments || []);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likes, setLikes] = useState(project?.likes || []);
  const [isLiking, setIsLiking] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'blueprint' | 'benchmarks' | 'api' | 'discussion'

  if (!isOpen || !project) return null;

  const isLiked = user && likes.some((id) => id === user._id || id?._id === user._id);

  const handleLike = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await API.post(`/projects/${project._id}/like`);
      if (res.data.success) {
        setLikes(res.data.likes);
        if (onProjectUpdated) {
          onProjectUpdated({ ...project, likes: res.data.likes });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await API.post(`/projects/${project._id}/comments`, { text: commentText });
      if (res.data.success) {
        setComments(res.data.data);
        setCommentText('');
        if (onProjectUpdated) {
          onProjectUpdated({ ...project, comments: res.data.data });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post review');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '860px',
        maxHeight: '94vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.6)',
            border: 'none',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={18} />
        </button>

        {/* Hero Banner Image */}
        <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
          <img
            src={project.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10, 13, 20, 1) 0%, rgba(10, 13, 20, 0.3) 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: '18px', left: '28px', right: '28px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge">{project.category}</span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(236, 72, 153, 0.3)',
                color: '#f472b6',
                border: '1px solid rgba(236, 72, 153, 0.5)',
              }}>
                ⚡ Complexity: {project.architecture?.complexityScore || 90}/100
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{project.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{project.tagline}</p>
          </div>
        </div>

        {/* Navigation Tabs (Master-Level 5-Tab Bar) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '10px 24px 0',
          background: 'rgba(16, 21, 34, 0.6)',
          overflowX: 'auto',
        }}>
          {[
            { id: 'overview', label: '📖 Overview' },
            { id: 'blueprint', label: '⚡ Architecture Nodes' },
            { id: 'benchmarks', label: '📊 System Benchmarks' },
            { id: 'api', label: '🎛️ Live API Sandbox' },
            { id: 'discussion', label: `💬 Discussion (${comments.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '24px', flex: 1 }}>
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  SYSTEM SPECIFICATIONS
                </h4>
                <p style={{ color: '#f1f5f9', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  TECH STACK & INTEGRATIONS
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.tags && project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '5px 12px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#818cf8',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Creator Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                marginTop: '10px',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={project.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={project.user?.name || 'Creator'}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                      {project.user?.name || 'Lead Architect'}
                    </h5>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {project.user?.bio || 'Building distributed architectures on AetherStack'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline"
                      style={{ padding: '8px 14px' }}
                    >
                      <Code2 size={16} />
                      <span>Code</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gradient"
                      style={{ padding: '8px 14px' }}
                    >
                      <ExternalLink size={16} />
                      <span>Live App</span>
                    </a>
                  )}
                  <button
                    onClick={handleLike}
                    style={{
                      background: isLiked ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: isLiked ? '1px solid rgba(236, 72, 153, 0.4)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: isLiked ? '#ec4899' : 'var(--text-secondary)',
                    }}
                  >
                    <Heart size={16} fill={isLiked ? '#ec4899' : 'none'} />
                    <span style={{ fontWeight: 700 }}>{likes.length}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Architecture Blueprint Nodes */}
          {activeTab === 'blueprint' && (
            <ArchitectureBlueprint
              architecture={project.architecture}
              category={project.category}
              title={project.title}
            />
          )}

          {/* TAB 3: System Benchmarks & Telemetry */}
          {activeTab === 'benchmarks' && (
            <BenchmarkSimulator
              benchmarks={project.benchmarks}
            />
          )}

          {/* TAB 4: Live Interactive API Sandbox */}
          {activeTab === 'api' && (
            <InteractiveLiveApiTester
              endpoints={project.apiEndpoints}
              projectTitle={project.title}
            />
          )}

          {/* TAB 5: Threaded Discussions */}
          {activeTab === 'discussion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder={user ? 'Leave architectural feedback, code reviews, or questions...' : 'Sign in to join the technical discussion...'}
                  className="form-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={!user || submittingComment}
                />
                <button
                  type="submit"
                  disabled={!user || submittingComment || !commentText.trim()}
                  className="btn-gradient"
                  style={{ padding: '0 20px' }}
                >
                  <Send size={16} />
                  <span>{submittingComment ? '...' : 'Post'}</span>
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '320px', overflowY: 'auto' }}>
                {comments && comments.length > 0 ? (
                  comments.map((comm, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <img
                          src={comm.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={comm.user?.name || 'Dev'}
                          style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                          {comm.user?.name || 'Developer'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          • {new Date(comm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0, paddingLeft: '30px' }}>
                        {comm.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
                    <p style={{ fontSize: '0.9rem' }}>No discussions yet. Be the first to start the review!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
