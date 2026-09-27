import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Heart, ExternalLink, Code2, Trash2, Cpu, Eye } from 'lucide-react';

const ProjectCard = ({ project, onDelete, onRequireAuth, onSelectProject }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(project.likes || []);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = user && likes.some((id) => id === user._id || id?._id === user._id);
  const isOwner = user && project.user && (project.user._id === user._id || project.user === user._id);
  const complexityScore = project.architecture?.complexityScore || 85;

  const handleLike = async (e) => {
    e.stopPropagation();
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
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await API.delete(`/projects/${project._id}`);
        onDelete(project._id);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  return (
    <div
      onClick={() => onSelectProject && onSelectProject(project)}
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        cursor: 'pointer',
      }}
    >
      {/* Thumbnail Header */}
      <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
        <img
          src={project.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
          alt={project.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Badges Overlay */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <span className="badge" style={{ backdropFilter: 'blur(8px)', background: 'rgba(10, 13, 20, 0.75)' }}>
            {project.category}
          </span>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(236, 72, 153, 0.25)',
            backdropFilter: 'blur(8px)',
            color: '#f472b6',
            border: '1px solid rgba(236, 72, 153, 0.4)',
          }}>
            ⚡ {complexityScore}/100
          </span>
        </div>

        {/* Delete button (Owner only) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(239, 68, 68, 0.85)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Delete Project"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>{project.title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '14px', flex: 1, lineClamp: 2 }}>
          {project.tagline}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {project.tags && project.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.75rem',
                padding: '3px 8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Button: View Blueprint */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#818cf8',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '14px',
        }}>
          <Cpu size={14} />
          <span>Click to view Architecture Blueprint & Discussion</span>
        </div>

        {/* Author Info & Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '14px',
          marginTop: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={project.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={project.user?.name || 'User'}
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {project.user?.name || 'Anonymous'}
            </span>
          </div>

          {/* Action Links & Likes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                title="View Source Code"
              >
                <Code2 size={18} />
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}
                title="Live Demo"
              >
                <ExternalLink size={18} />
              </a>
            )}

            {/* Like Button */}
            <button
              onClick={handleLike}
              style={{
                background: isLiked ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: isLiked ? '1px solid rgba(236, 72, 153, 0.4)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                color: isLiked ? '#ec4899' : 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}
            >
              <Heart size={14} fill={isLiked ? '#ec4899' : 'none'} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{likes.length}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
