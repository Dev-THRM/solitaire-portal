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
    <div style={{ width: '100%', maxWidth: 1200 }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />
      ))}
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: 1200 }}>
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

      {/* Categories Datatable */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Name</th>
              <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Description</th>
              <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Usage</th>
              <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--color-text-muted)' }}>
                  <Tag size={40} opacity={0.3} style={{ marginBottom: 16, margin: '0 auto' }} />
                  <p>No categories yet. Add one above to start.</p>
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => {
                const isEditing = editingId === cat.id;
                const usageCount = cat._count?.candidateCategories ?? 0;
                
                return (
                  <tr key={cat.id} style={{ 
                    borderBottom: idx === categories.length - 1 ? 'none' : '1px solid var(--color-border)',
                    transition: 'background 0.2s ease',
                    background: !cat.isActive ? 'var(--color-surface-2)' : 'transparent',
                    opacity: !cat.isActive ? 0.7 : 1
                  }}>
                    <td style={{ padding: '16px 24px' }}>
                      {isEditing ? (
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                          style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--color-primary)', fontSize: 14, width: '100%', outline: 'none' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                            <Tag size={18} />
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text)', textDecoration: !cat.isActive ? 'line-through' : 'none' }}>{cat.name}</span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {isEditing ? (
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                          rows={1}
                          style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--color-border)', fontSize: 13, width: '100%', resize: 'vertical', outline: 'none' }}
                        />
                      ) : (
                        <div style={{ fontSize: 14, color: 'var(--color-text-muted)', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={cat.description}>
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={14} /> {usageCount}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        background: cat.isActive ? '#dcfce7' : 'var(--color-border)', 
                        color: cat.isActive ? '#166534' : 'var(--color-text-muted)', 
                        fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 20 
                      }}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditingId(null)} className="btn btn-ghost" style={{ padding: '6px 10px', borderRadius: 8, fontSize: 13 }}>
                            Cancel
                          </button>
                          <button onClick={() => handleUpdate(cat.id)} disabled={saving} className="btn btn-primary" style={{ padding: '6px 10px', borderRadius: 8, fontSize: 13 }}>
                            Save
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button
                            id={`edit-cat-${cat.id}`}
                            onClick={() => { setEditingId(cat.id); setEditForm({ name: cat.name, description: cat.description }); }}
                            style={{ padding: '8px', color: 'var(--color-text-muted)', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-surface-2)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            id={`toggle-cat-${cat.id}`}
                            onClick={() => handleToggleActive(cat)}
                            title={cat.isActive ? "Deactivate category" : "Reactivate category"}
                            style={{ padding: '8px', color: 'var(--color-text-muted)', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseOver={(e) => { e.currentTarget.style.background = cat.isActive ? 'rgba(239, 68, 68, 0.1)' : '#dcfce7'; e.currentTarget.style.color = cat.isActive ? '#ef4444' : '#166534'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                          >
                            {cat.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
