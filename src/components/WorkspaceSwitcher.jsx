import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Users, Mail, ChevronDown } from 'lucide-react';

function RoleBadge({ role }) {
  const styles = {
    Owner: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Admin: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    Member: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    Pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-700'}`}>{role}</span>
  );
}

function WorkspaceSwitcher({
  workspaces,
  currentWorkspaceId,
  setCurrentWorkspaceId,
  onCreateWorkspace,
  onRenameWorkspace,
  onDeleteWorkspace,
  onInviteMember,
  onChangeMemberRole,
  onRemoveMember,
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const current = useMemo(
    () => workspaces.find((w) => w.id === currentWorkspaceId),
    [workspaces, currentWorkspaceId]
  );

  return (
    <aside className="w-full md:w-72 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900">
          <div className="text-left">
            <div className="text-xs text-gray-500">Current workspace</div>
            <div className="font-medium">{current?.name}</div>
          </div>
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="mt-2 space-y-2">
            {workspaces.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  setCurrentWorkspaceId(w.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 ${
                  w.id === currentWorkspaceId ? 'bg-gray-50 dark:bg-gray-900' : ''
                }`}
              >
                <div className="font-medium">{w.name}</div>
                <div className="text-xs text-gray-500">{w.members.length} members • {w.projects.length} projects</div>
              </button>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                onCreateWorkspace(name.trim());
                setName('');
              }}
              className="flex items-center gap-2"
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1 text-sm"
                placeholder="New workspace name"
              />
              <button className="inline-flex items-center gap-1 rounded-md bg-indigo-600 text-white px-2 py-1 text-sm hover:bg-indigo-700">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Members</h3>
            <span className="text-xs text-gray-500">{current?.members.length}</span>
          </div>
          <ul className="space-y-2">
            {current?.members.map((m) => (
              <li key={m.email} className="flex items-center justify-between gap-2 rounded-md border border-gray-200 dark:border-gray-800 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white text-xs font-semibold">
                    {m.name?.[0]?.toUpperCase() || m.email[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium leading-tight">{m.name || m.email.split('@')[0]}</div>
                    <div className="text-xs text-gray-500 leading-tight">{m.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <RoleBadge role={m.role} />
                  <button
                    onClick={() => {
                      const next = m.role === 'Member' ? 'Admin' : m.role === 'Admin' ? 'Owner' : 'Member';
                      onChangeMemberRole(current.id, m.email, next);
                    }}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Cycle role"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onRemoveMember(current.id, m.email)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!inviteEmail.trim()) return;
              onInviteMember(current.id, inviteEmail.trim(), inviteRole);
              setInviteEmail('');
            }}
            className="mt-3 space-y-2"
          >
            <div className="text-xs text-gray-500">Invite member</div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full pl-7 pr-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm"
                  placeholder="name@company.com"
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5 text-sm"
              >
                <option>Member</option>
                <option>Admin</option>
                <option>Owner</option>
              </select>
              <button className="inline-flex items-center gap-1 rounded-md bg-indigo-600 text-white px-2 py-1.5 text-sm hover:bg-indigo-700">
                <Users className="h-4 w-4" /> Invite
              </button>
            </div>
          </form>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Workspace settings</h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                const newName = prompt('Rename workspace', current?.name || '');
                if (newName && newName.trim()) onRenameWorkspace(current.id, newName.trim());
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <Edit className="h-4 w-4" /> Rename
            </button>
            <button
              onClick={() => {
                if (confirm('Delete workspace and all its data?')) onDeleteWorkspace(current.id);
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-red-200 text-red-600 dark:border-red-900/50 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4" /> Delete workspace
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default WorkspaceSwitcher;
