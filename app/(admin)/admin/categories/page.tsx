'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeactivateCategory,
  type Category,
} from '@/app/_lib/api';
import { getToken } from '@/app/_lib/auth';
import { Tag, Plus, Edit2, PowerOff, Power, Check, X, Users, ChevronDown, ChevronUp } from 'lucide-react';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    const token = getToken();
    if (!token) { router.push('/login'); return; }
    try {
      const res = await adminGetCategories(token);
      setCategories(res.data);
    } catch { router.push('/login'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!newForm.name.trim() || !newForm.description.trim()) return;
    const token = getToken()!;
    setSaving(true); setError(null);
    try {
      const res = await adminCreateCategory(token, newForm);
      setCategories((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewForm({ name: '', description: '' });
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message ?? 'Failed to create category');
    } finally { setSaving(false); }
  }

  async function handleUpdate(id: string) {
    const token = getToken()!;
    setSaving(true); setError(null);
    try {
      const res = await adminUpdateCategory(token, id, editForm);
      setCategories((prev) => prev.map((c) => c.id === id ? res.data : c));
      setEditingId(null);
    } catch (err: any) {
      setError(err.message ?? 'Failed to update category');
    } finally { setSaving(false); }
  }

  async function handleToggleActive(cat: Category) {
    const token = getToken()!;
    if (!cat.isActive) {
      // Re-activate
      const res = await adminUpdateCategory(token, cat.id, { isActive: true });
      setCategories((prev) => prev.map((c) => c.id === cat.id ? res.data : c));
    } else {
      if (!confirm(`Deactivate "${cat.name}"? It will no longer appear in new categorizations but historical assignments are preserved.`)) return;
      await adminDeactivateCategory(token, cat.id);
      setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, isActive: false } : c));
    }
  }

  const active = categories.filter((c) => c.isActive);
  const inactive = categories.filter((c) => !c.isActive);

  if (loading) return (
    <div style={{ maxWidth: 860 }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--color-primary)' }}>Job Categories</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>
            {active.length} active categor{active.length !== 1 ? 'ies' : 'y'} · used for AI resume classification
          </p>
        </div>
        <button
          id="add-category-btn"
          onClick={() => { setShowAddForm((v) => !v); setError(null); }}
          className="btn btn-primary btn-lg"
          style={{ borderRadius: 12, boxShadow: '0 10px 25px rgba(30,73,106,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 20, padding: '12px 20px', background: '#fee2e2', borderRadius: 12, color: '#dc2626', fontSize: 14, fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Add form */}
      {showAddForm && (
        <div style={{
          background: 'white', borderRadius: 20, padding: 28, marginBottom: 28,
          border: '2px solid var(--color-primary)', boxShadow: '0 8px 32px rgba(30,73,106,0.1)',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={20} /> New Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                Category Name *
              </label>
              <input
                id="new-category-name"
                value={newForm.name}
                onChange={(e) => setNewForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sommelier"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: '1.5px solid var(--color-border)', fontSize: 15,
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                Description * <span style={{ fontWeight: 400 }}>(used by Gemini for matching)</span>
              </label>
              <textarea
                id="new-category-description"
                value={newForm.description}
                onChange={(e) => setNewForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe the role, key duties, and typical qualifications..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 12,
                  border: '1.5px solid var(--color-border)', fontSize: 15,
                  fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAddForm(false); setError(null); }} className="btn btn-ghost" style={{ borderRadius: 10 }}>
                Cancel
              </button>
              <button
                id="save-new-category-btn"
                onClick={handleCreate}
                disabled={saving || !newForm.name.trim() || !newForm.description.trim()}
                className="btn btn-primary"
                style={{ borderRadius: 10, opacity: saving ? 0.6 : 1 }}
              >
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {active.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: 20, border: '1px solid var(--color-border)' }}>
            <Tag size={40} color="var(--color-text-muted)" opacity={0.3} style={{ marginBottom: 16 }} />
            <p style={{ color: 'var(--color-text-muted)' }}>No categories yet. Add one above to start.</p>
          </div>
        )}

        {active.map((cat) => {
          const isEditing = editingId === cat.id;
          const isExpanded = expandedId === cat.id;
          const usageCount = cat._count?.candidateCategories ?? 0;

          return (
            <div
              key={cat.id}
              style={{
                background: 'white', borderRadius: 20, border: '1px solid var(--color-border)',
                overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                transition: 'box-shadow 0.2s',
              }}
            >
              {isEditing ? (
                /* Edit form */
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <input
                      id={`edit-name-${cat.id}`}
                      value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Category name"
                      style={{
                        padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--color-primary)',
                        fontSize: 15, fontFamily: 'inherit', fontWeight: 600, outline: 'none',
                      }}
                    />
                    <textarea
                      id={`edit-desc-${cat.id}`}
                      value={editForm.description}
                      onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Description"
                      rows={2}
                      style={{
                        padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--color-border)',
                        fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical',
                      }}
                    />
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditingId(null)} className="btn btn-ghost" style={{ borderRadius: 8, padding: '8px 14px' }}>
                        <X size={16} /> Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        disabled={saving}
                        className="btn btn-primary"
                        style={{ borderRadius: 8, padding: '8px 14px' }}
                      >
                        <Check size={16} /> Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Display row */
                <div>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: 'var(--color-primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)',
                    }}>
                      <Tag size={22} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)', marginBottom: 2 }}>
                        {cat.name}
                      </div>
                      {!isExpanded && (
                        <div style={{
                          fontSize: 13, color: 'var(--color-text-muted)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {cat.description}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-muted)' }}>
                        <Users size={14} /> {usageCount}
                      </span>
                      <button
                        id={`edit-cat-${cat.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(cat.id);
                          setEditForm({ name: cat.name, description: cat.description });
                          setExpandedId(null);
                        }}
                        style={{
                          background: 'var(--color-surface-2)', border: 'none', borderRadius: 8,
                          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--color-primary)', cursor: 'pointer',
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        id={`toggle-cat-${cat.id}`}
                        onClick={(e) => { e.stopPropagation(); handleToggleActive(cat); }}
                        style={{
                          background: '#dcfce7', border: 'none', borderRadius: 8,
                          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#166534', cursor: 'pointer',
                        }}
                        title="Deactivate category"
                      >
                        <Power size={16} />
                      </button>
                      {isExpanded ? <ChevronUp size={16} color="var(--color-text-muted)" /> : <ChevronDown size={16} color="var(--color-text-muted)" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{
                      padding: '0 24px 20px 84px',
                      fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted)',
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: 16, marginTop: -8,
                    }}>
                      {cat.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Inactive categories */}
      {inactive.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12 }}>
            Inactive Categories ({inactive.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {inactive.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: 'white', borderRadius: 16, border: '1px dashed var(--color-border)',
                  padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, opacity: 0.7,
                }}
              >
                <Tag size={18} color="var(--color-text-muted)" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{cat.name}</span>
                </div>
                <button
                  id={`reactivate-cat-${cat.id}`}
                  onClick={() => handleToggleActive(cat)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
                    padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: '#dcfce7', color: '#166534',
                  }}
                >
                  <Power size={14} /> Re-activate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
