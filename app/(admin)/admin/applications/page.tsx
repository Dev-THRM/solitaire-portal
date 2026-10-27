'use client';

import { useEffect, useState, useCallback, Suspense, Fragment } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  adminGetApplications,
  adminGetResumeStatus,
  adminGetApplicationCategories,
  adminTriggerCategorization,
  adminAddManualCategory,
  adminRemoveCategory,
  adminGetAlternateSuggestions,
  adminGetCategories,
  adminGetJobs,
  type Job,
  type Application,
  type CandidateCategory,
  type ResumeStatus,
  type Category,
} from '../../../_lib/api';
import { getToken } from '../../../_lib/auth';
import {
  Mail, Phone, FileText, CheckCircle2, Clock, Eye, XCircle, Search,
  User, Folder, ArrowRightLeft, PauseCircle, RefreshCw, Sparkles,
  Plus, Trash2, AlertCircle, ChevronRight, Brain, ChevronDown, Banknote,
} from 'lucide-react';

const STATUS_CONFIG: Record<string, any> = {
  PENDING:     { label: 'Pending',     icon: Clock,          color: '#f59e0b', bg: '#fef3c7' },
  REVIEWED:    { label: 'Reviewed',    icon: Eye,            color: '#3b82f6', bg: '#dbeafe' },
  CATEGORIZED: { label: 'Categorized', icon: Folder,         color: '#8b5cf6', bg: '#ede9fe' },
  ACCEPTED:    { label: 'Accepted',    icon: CheckCircle2,   color: '#10b981', bg: '#d1fae5' },
  SWITCHED:    { label: 'Switched',    icon: ArrowRightLeft, color: '#0ea5e9', bg: '#e0f2fe' },
  ON_HOLD:     { label: 'On Hold',     icon: PauseCircle,    color: '#f97316', bg: '#ffedd5' },
  REJECTED:    { label: 'Rejected',    icon: XCircle,        color: '#ef4444', bg: '#fee2e2' },
};

// ── Confidence bar ────────────────────────────────────────────────────────────
function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

// ── Categorization status badge ───────────────────────────────────────────────
function CategorizationStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; bg: string; label: string }> = {
    PENDING:    { color: '#f59e0b', bg: '#fef3c7', label: 'Extraction pending' },
    PROCESSING: { color: '#3b82f6', bg: '#dbeafe', label: 'Categorizing…'      },
    DONE:       { color: '#10b981', bg: '#d1fae5', label: 'Categorized'         },
    FAILED:     { color: '#ef4444', bg: '#fee2e2', label: 'Failed'              },
  };
  const cfg = configs[status] ?? configs.PENDING;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
      background: cfg.bg, color: cfg.color,
    }}>
      <Brain size={12} /> {cfg.label}
    </span>
  );
}

// ── Categories panel (shown in the detail sidebar) ───────────────────────────
function CategoriesPanel({ app, onAppUpdate }: { app: Application; onAppUpdate?: (app: Application) => void }) {
  const [resumeStatus, setResumeStatus] = useState<ResumeStatus>(null);
  const [categories, setCategories] = useState<CandidateCategory[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [altSuggestions, setAltSuggestions] = useState<CandidateCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [showAddManual, setShowAddManual] = useState(false);
  const [manualCategoryId, setManualCategoryId] = useState('');
  const [manualEvidence, setManualEvidence] = useState('');
  const [addingManual, setAddingManual] = useState(false);
  const [triggerMsg, setTriggerMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getToken()!;
    setLoading(true);
    try {
      const [rsRes, catRes, allCatRes] = await Promise.all([
        adminGetResumeStatus(token, app.id),
        adminGetApplicationCategories(token, app.id),
        adminGetCategories(token),
      ]);
      setResumeStatus(rsRes.data);
      setCategories(catRes.data);
      setAllCategories(allCatRes.data.filter((c) => c.isActive));

      // If backend categorization is DONE but local app state is still PENDING
      if (rsRes.data?.categorizationStatus === 'DONE' && app.status === 'PENDING') {
        if (onAppUpdate) onAppUpdate({ ...app, status: 'CATEGORIZED' });
      }

      // Load alternates if rejected
      if (app.status === 'REJECTED') {
        const altRes = await adminGetAlternateSuggestions(token, app.id);
        setAltSuggestions(altRes.data?.suggestions ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, [app.id, app.status]);

  useEffect(() => { load(); }, [load]);

  // Poll while processing
  useEffect(() => {
    if (resumeStatus?.categorizationStatus === 'PROCESSING' || resumeStatus?.extractionStatus === 'PENDING') {
      const interval = setInterval(load, 3000);
      return () => clearInterval(interval);
    }
  }, [resumeStatus, load]);

  async function handleTrigger() {
    const token = getToken()!;
    setTriggering(true); setTriggerMsg(null);
    try {
      const res = await adminTriggerCategorization(token, app.id);
      setTriggerMsg(res.message);
      setTimeout(load, 3000);
    } catch (err: any) {
      setTriggerMsg(err.message ?? 'Failed to trigger');
    } finally { setTriggering(false); }
  }

  async function handleRemove(categoryId: string) {
    const token = getToken()!;
    await adminRemoveCategory(token, app.id, categoryId);
    setCategories((prev) => prev.filter((c) => c.categoryId !== categoryId));
  }

  async function handleAddManual() {
    if (!manualCategoryId) return;
    const token = getToken()!;
    setAddingManual(true);
    try {
      const res = await adminAddManualCategory(token, app.id, {
        categoryId: manualCategoryId,
        evidence: manualEvidence || 'Manually assigned by admin',
      });
      setCategories((prev) => {
        const existing = prev.find((c) => c.categoryId === manualCategoryId);
        if (existing) return prev.map((c) => c.categoryId === manualCategoryId ? res.data : c);
        return [...prev, res.data];
      });
      setShowAddManual(false);
      setManualCategoryId('');
      setManualEvidence('');
    } catch (err) { console.error(err); }
    finally { setAddingManual(false); }
  }

  if (loading) return (
    <div style={{ padding: '16px 0' }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 56, borderRadius: 12, marginBottom: 10 }} />
      ))}
    </div>
  );

  const catStatus = resumeStatus?.categorizationStatus;
  const extStatus = resumeStatus?.extractionStatus;
  const hasFailed = extStatus === 'FAILED' || catStatus === 'FAILED';
  const canCategorize = resumeStatus && (
    (extStatus === 'DONE' && catStatus !== 'PROCESSING') ||
    hasFailed
  );
  const isProcessing = catStatus === 'PROCESSING' || extStatus === 'PENDING';

  // Categories already assigned to this applicant (by categoryId)
  const assignedCategoryIds = new Set(categories.map((c) => c.categoryId));
  const availableToAdd = allCategories.filter((c) => !assignedCategoryIds.has(c.id));

  return (
    <div>
      {/* Status + trigger row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
            AI Categories
          </h4>
          {resumeStatus && <CategorizationStatusBadge status={catStatus ?? 'PENDING'} />}
          {!resumeStatus && (
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>No resume processed yet</span>
          )}
        </div>
        <button
          id={`trigger-categorize-${app.id}`}
          onClick={handleTrigger}
          disabled={triggering || isProcessing || !resumeStatus || ['ACCEPTED', 'REJECTED'].includes(app.status)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            borderRadius: 10, border: 'none', cursor: canCategorize && !['ACCEPTED', 'REJECTED'].includes(app.status) ? 'pointer' : 'not-allowed',
            background: hasFailed
              ? '#fee2e2'
              : canCategorize && !['ACCEPTED', 'REJECTED'].includes(app.status)
                ? 'var(--color-primary)'
                : 'var(--color-surface-2)',
            color: hasFailed
              ? '#dc2626'
              : canCategorize && !['ACCEPTED', 'REJECTED'].includes(app.status)
                ? 'white'
                : 'var(--color-text-muted)',
            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
            opacity: triggering || ['ACCEPTED', 'REJECTED'].includes(app.status) ? 0.6 : 1,
          }}
          title={['ACCEPTED', 'REJECTED'].includes(app.status) ? 'Cannot re-run for finalized applications' : !resumeStatus ? 'No resume extracted yet' : catStatus === 'PROCESSING' ? 'Processing…' : hasFailed ? 'Retry extraction & categorization' : 'Re-run categorization'}
        >
          <RefreshCw size={14} style={{ animation: isProcessing ? 'spin 1s linear infinite' : 'none' }} />
          {hasFailed ? 'Retry' : catStatus === 'DONE' ? 'Re-run' : 'Categorize'}
        </button>
      </div>

      {triggerMsg && (
        <div style={{ marginBottom: 12, padding: '8px 14px', background: '#dbeafe', borderRadius: 10, fontSize: 13, color: '#1e40af' }}>
          {triggerMsg}
        </div>
      )}

      {/* Extraction error */}
      {extStatus === 'FAILED' && resumeStatus?.extractionError && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fee2e2', borderRadius: 10, fontSize: 13, color: '#dc2626', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Extraction failed:</strong> {resumeStatus.extractionError}
          </div>
        </div>
      )}

      {/* Categorization error */}
      {catStatus === 'FAILED' && resumeStatus?.categorizationError && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fff7ed', borderRadius: 10, fontSize: 13, color: '#c2410c', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Categorization failed:</strong> {resumeStatus.categorizationError}
          </div>
        </div>
      )}

      {/* Category chips */}
      {categories.length === 0 && catStatus === 'DONE' && (
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: 12 }}>
          No categories matched by AI. You can assign one manually below.
        </p>
      )}

      {categories.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {categories.map((cc) => (
            <div
              key={cc.id}
              style={{
                background: 'var(--color-surface-2)', borderRadius: 14, padding: '12px 14px',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>
                    {cc.category.name}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6,
                    background: cc.source === 'MANUAL' ? '#dbeafe' : '#ede9fe',
                    color: cc.source === 'MANUAL' ? '#1e40af' : '#6d28d9',
                    letterSpacing: '0.03em',
                  }}>
                    {cc.source === 'MANUAL' ? 'MANUAL' : 'AI'}
                  </span>
                </div>
                <button
                  id={`remove-cat-${cc.categoryId}`}
                  onClick={() => handleRemove(cc.categoryId)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#ef4444', padding: 4, borderRadius: 6,
                    display: 'flex', alignItems: 'center',
                  }}
                  title="Remove category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <ConfidenceBar value={cc.confidence} />
              <p style={{
                fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8,
                lineHeight: 1.5, fontStyle: 'italic',
              }}>
                "{cc.evidence}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add manual category */}
      {availableToAdd.length > 0 && (
        <div>
          {!showAddManual ? (
            <button
              id={`add-manual-cat-${app.id}`}
              onClick={() => setShowAddManual(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                borderRadius: 10, border: '1.5px dashed var(--color-border)', background: 'white',
                fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', cursor: 'pointer',
                width: '100%', justifyContent: 'center', transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              <Plus size={14} /> Add category manually
            </button>
          ) : (
            <div style={{ background: 'white', border: '1.5px solid var(--color-primary)', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <select
                id={`manual-cat-select-${app.id}`}
                value={manualCategoryId}
                onChange={(e) => setManualCategoryId(e.target.value)}
                style={{
                  padding: '10px 12px', borderRadius: 10, border: '1px solid var(--color-border)',
                  fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'white',
                }}
              >
                <option value="">Select a category…</option>
                {availableToAdd.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                id={`manual-cat-evidence-${app.id}`}
                value={manualEvidence}
                onChange={(e) => setManualEvidence(e.target.value)}
                placeholder="Reason / evidence (optional)"
                style={{
                  padding: '10px 12px', borderRadius: 10, border: '1px solid var(--color-border)',
                  fontSize: 13, fontFamily: 'inherit', outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setShowAddManual(false); setManualCategoryId(''); setManualEvidence(''); }}
                  className="btn btn-ghost" style={{ flex: 1, borderRadius: 8, padding: '8px' }}>Cancel</button>
                <button
                  id={`confirm-add-manual-cat-${app.id}`}
                  onClick={handleAddManual}
                  disabled={!manualCategoryId || addingManual}
                  className="btn btn-primary"
                  style={{ flex: 1, borderRadius: 8, padding: '8px', opacity: addingManual ? 0.6 : 1 }}
                >
                  {addingManual ? 'Adding…' : 'Add'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alternate suggestions (REJECTED applications only) */}
      {app.status === 'REJECTED' && altSuggestions.length > 0 && (
        <div style={{ marginTop: 20, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={16} color="#f59e0b" />
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
              Alternate Role Suggestions
            </h4>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
            This applicant may be a fit for other roles despite being rejected from {app.job?.title ?? 'the applied role'}.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {altSuggestions.map((cc) => (
              <div
                key={cc.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  background: '#fffbeb', borderRadius: 12, border: '1px solid #fde68a',
                }}
              >
                <ChevronRight size={14} color="#f59e0b" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)' }}>{cc.category.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{Math.round(cc.confidence * 100)}% match</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function ApplicationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId') ?? undefined;

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showSwitchModal, setShowSwitchModal] = useState<string | null>(null);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }

    adminGetApplications(token, jobId)
      .then((res) => setApplications(res.data))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [jobId, router]);

  function handleAppUpdate(updatedApp: Application) {
    setApplications((prev) => prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)));
    setSelected((prev) => (prev?.id === updatedApp.id ? updatedApp : prev));
  }

  async function handleStatusClick(appId: string, status: string) {
    if (status === 'SWITCHED') {
      setShowSwitchModal(appId);
      if (activeJobs.length === 0) {
        adminGetJobs(getToken()!).then(res => setActiveJobs(res.data.filter(j => j.isActive)));
      }
      return;
    }
    await updateStatus(appId, status);
  }

  async function updateStatus(appId: string, status: string, targetJobId?: string) {
    const token = getToken()!;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/apply/admin/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, jobId: targetJobId }),
      });
      if (res.ok) {
        setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status: status as Application['status'] } : a));
        setSelected((prev) => prev?.id === appId ? { ...prev, status: status as Application['status'] } : prev);
        
        if (targetJobId && jobId) {
          setApplications(prev => prev.filter(a => a.id !== appId));
          if (selected?.id === appId) setSelected(null);
        } else if (targetJobId) {
          // If viewing all, just reload to get the new job title
          adminGetApplications(token).then((res) => setApplications(res.data));
        }
      }
    } finally { 
      setUpdatingStatus(false);
      setShowSwitchModal(null);
      setSelectedJobId('');
    }
  }

  const filtered = statusFilter === 'ALL' ? applications : applications.filter((a) => a.status === statusFilter);

  if (loading) return (
    <div style={{ display: 'flex', gap: 24, maxWidth: 1200 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />)}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--color-primary)' }}>Applications</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>
            {filtered.length} application{filtered.length !== 1 ? 's' : ''}
            {jobId ? ` for selected job` : ' total'}
          </p>
        </div>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <button
          onClick={() => setStatusFilter('ALL')}
          style={{
            padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
            transition: 'all 0.2s',
            background: statusFilter === 'ALL' ? 'var(--color-primary)' : 'white',
            color: statusFilter === 'ALL' ? 'white' : 'var(--color-text-muted)',
            boxShadow: statusFilter === 'ALL' ? '0 4px 12px rgba(30,73,106,0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          All ({applications.length})
        </button>
        {Object.keys(STATUS_CONFIG).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const count = applications.filter((a) => a.status === s).length;
          const isActive = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
                background: isActive ? cfg.color : 'white',
                color: isActive ? 'white' : 'var(--color-text-muted)',
                boxShadow: isActive ? `0 4px 12px ${cfg.color}40` : '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <cfg.icon size={16} />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, alignItems: 'start' }}>
        {/* Applications List */}
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '80px 24px', textAlign: 'center' }}>
              <Search size={48} color="var(--color-text-muted)" opacity={0.3} style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, color: 'var(--color-text)' }}>No applications found</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>Try changing your filter settings</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Applicant</th>
                    <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Job</th>
                    <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => {
                    const cfg = STATUS_CONFIG[app.status];
                    const isSelected = selected?.id === app.id;
                    return (
                      <Fragment key={app.id}>
                        <tr
                          onClick={() => setSelected(isSelected ? null : app)}
                          style={{
                            background: isSelected ? 'var(--color-primary-light)' : 'white',
                            borderBottom: isSelected ? 'none' : '1px solid var(--color-border)',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--color-surface-2)'; }}
                          onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.background = 'white'; }}
                        >
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{app.firstName} {app.lastName}</div>
                            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Mail size={12} /> {app.email}
                            </div>
                            {(app.noticePeriod || app.expectedCtc) && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                                {app.noticePeriod && (
                                  <span style={{ fontSize: 11, color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: 6, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={11} /> {app.noticePeriod}
                                  </span>
                                )}
                                {app.expectedCtc && (
                                  <span style={{ fontSize: 11, color: '#047857', background: '#d1fae5', padding: '2px 8px', borderRadius: 6, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    Exp: {app.expectedCtc}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: 14, color: 'var(--color-text)' }}>
                            {app.job?.title ?? '—'}
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                              background: cfg.bg, color: cfg.color,
                            }}>
                              <cfg.icon size={14} /> {cfg.label}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: 13, color: 'var(--color-text-subtle)' }}>
                            {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                        </tr>
                        {isSelected && (
                          <tr style={{ background: 'var(--color-primary-light)', borderBottom: '1px solid var(--color-border)' }}>
                            <td colSpan={4} style={{ padding: '0 24px 24px 24px' }}>
                              <div style={{
                                background: 'white', borderRadius: 20, padding: 24,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid var(--color-border)',
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                  <div>
                                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>{app.firstName} {app.lastName}</h3>
                                    <p style={{ color: 'var(--color-primary)', fontWeight: 500, marginTop: 4, fontSize: 13 }}>
                                      Applied for: {app.job?.title}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {/* Contact Info */}
                                    <div style={{ background: 'var(--color-surface-2)', padding: 12, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text)' }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}><Mail size={14} /></div>
                                        <a href={`mailto:${app.email}`} style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>{app.email}</a>
                                      </div>
                                      {app.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-text)' }}>
                                          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}><Phone size={14} /></div>
                                          {app.phone}
                                        </div>
                                      )}
                                    </div>

                                    {/* Compensation & Availability */}
                                    {(app.currentCtc || app.expectedCtc || app.noticePeriod) && (
                                      <div style={{ background: 'var(--color-surface-2)', padding: 14, borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                                          Compensation & Availability
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                                          {app.currentCtc && (
                                            <div style={{ background: 'white', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                                              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
                                                <Banknote size={12} /> Current CTC
                                              </span>
                                              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text)', marginTop: 4, display: 'block' }}>{app.currentCtc}</span>
                                            </div>
                                          )}
                                          {app.expectedCtc && (
                                            <div style={{ background: 'white', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                                              <span style={{ fontSize: 11, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
                                                <Banknote size={12} /> Expected CTC
                                              </span>
                                              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-primary)', marginTop: 4, display: 'block' }}>{app.expectedCtc}</span>
                                            </div>
                                          )}
                                          {app.noticePeriod && (
                                            <div style={{ background: 'white', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                                              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
                                                <Clock size={12} /> Notice Period
                                              </span>
                                              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text)', marginTop: 4, display: 'block' }}>{app.noticePeriod}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Update Status */}
                                    <div style={{ background: 'var(--color-surface-2)', padding: 16, borderRadius: 14 }}>
                                      <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 12 }}>Update Status</h4>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => {
                                          const isActive = app.status === val;
                                          
                                          const isAcceptedOrRejected = ['ACCEPTED', 'REJECTED'].includes(app.status);
                                          const isSwitchedOrOnHold = ['SWITCHED', 'ON_HOLD'].includes(app.status);
                                          const isPrevious = ['PENDING', 'REVIEWED', 'CATEGORIZED'].includes(val);
                                          
                                          let isDisabled = updatingStatus;
                                          if (isAcceptedOrRejected && !isActive) {
                                            isDisabled = true;
                                          } else if (isSwitchedOrOnHold && isPrevious && !isActive) {
                                            isDisabled = true;
                                          }
                                          
                                          return (
                                            <button
                                              key={val}
                                              onClick={() => handleStatusClick(app.id, val)}
                                              disabled={isDisabled}
                                              style={{
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                padding: '8px 12px',
                                                borderRadius: 10,
                                                fontSize: 13,
                                                fontWeight: 600,
                                                border: `1px solid ${isActive ? cfg.color : 'var(--color-border)'}`,
                                                background: isActive ? cfg.bg : 'white',
                                                color: isActive ? cfg.color : 'var(--color-text-muted)',
                                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s',
                                                opacity: isDisabled && !isActive ? 0.4 : 1,
                                              }}
                                              title={isDisabled && !updatingStatus ? "Cannot move backwards from a final state" : undefined}
                                              onMouseOver={(e) => {
                                                if (!isActive && !isDisabled) {
                                                  e.currentTarget.style.borderColor = cfg.color;
                                                  e.currentTarget.style.color = cfg.color;
                                                  e.currentTarget.style.background = cfg.bg;
                                                }
                                              }}
                                              onMouseOut={(e) => {
                                                if (!isActive && !isDisabled) {
                                                  e.currentTarget.style.borderColor = 'var(--color-border)';
                                                  e.currentTarget.style.color = 'var(--color-text-muted)';
                                                  e.currentTarget.style.background = 'white';
                                                }
                                              }}
                                            >
                                              <cfg.icon size={14} />
                                              {cfg.label}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Cover Letter */}
                                    <div>
                                      <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <FileText size={15} color="var(--color-primary)" /> Cover Letter
                                      </h4>
                                      <div style={{
                                        background: 'white', border: '1px solid var(--color-border)', padding: 12, borderRadius: 14,
                                        fontSize: 13, lineHeight: 1.5, color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap', maxHeight: 120, overflowY: 'auto',
                                      }}>
                                        {app.coverLetter || <em>No cover letter provided</em>}
                                      </div>
                                    </div>

                                    {/* Resume */}
                                    {app.resumeUrl && (
                                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 10, fontSize: 13 }}>
                                        <FileText size={15} /> View Resume Document
                                      </a>
                                    )}
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {/* Categorization panel */}
                                    <CategoriesPanel app={app} onAppUpdate={handleAppUpdate} />
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showSwitchModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 16, width: 400, maxWidth: '90%', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>Switch Role</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
              Select the new role for this candidate. They will be immediately moved to the new role's candidate list.
            </p>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10,
                border: '1px solid var(--color-border)', marginBottom: 24,
                fontSize: 14, outline: 'none', background: 'var(--color-surface-2)',
                color: 'var(--color-text)'
              }}
            >
              <option value="">Select a target job...</option>
              {activeJobs.filter(j => j.id !== (selected?.jobId || applications.find(a => a.id === showSwitchModal)?.jobId)).map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSwitchModal(null)} className="btn btn-ghost" style={{ borderRadius: 10, padding: '10px 16px' }}>Cancel</button>
              <button
                onClick={() => updateStatus(showSwitchModal, 'SWITCHED', selectedJobId)}
                disabled={!selectedJobId || updatingStatus}
                className="btn btn-primary"
                style={{ borderRadius: 10, padding: '10px 16px', background: '#0ea5e9', color: 'white', border: 'none', opacity: !selectedJobId || updatingStatus ? 0.6 : 1 }}
              >
                {updatingStatus ? 'Switching...' : 'Confirm Switch'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spin animation for the refresh icon */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<div>Loading applications...</div>}>
      <ApplicationsPageContent />
    </Suspense>
  );
}
