import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import WorkspaceSwitcher from './components/WorkspaceSwitcher';
import ProjectList from './components/ProjectList';
import AnalyticsOverview from './components/AnalyticsOverview';

function seedData() {
  const ws1 = {
    id: crypto.randomUUID(),
    name: 'Growth Team',
    members: [
      { email: 'alex@novapm.io', name: 'Alex', role: 'Owner' },
      { email: 'jamie@novapm.io', name: 'Jamie', role: 'Admin' },
      { email: 'mia@novapm.io', name: 'Mia', role: 'Member' },
    ],
    projects: [
      {
        id: crypto.randomUUID(),
        name: 'Website Revamp',
        status: 'Active',
        epics: ['Design system', 'Marketing pages'],
        tasks: [
          { id: crypto.randomUUID(), title: 'Audit current pages', status: 'To Do', priority: 'Medium', assignee: 'alex@novapm.io', notes: '', dueDate: null },
          { id: crypto.randomUUID(), title: 'Build new Navbar', status: 'In Progress', priority: 'High', assignee: 'jamie@novapm.io', notes: '', dueDate: new Date().toISOString() },
          { id: crypto.randomUUID(), title: 'Migrate blog', status: 'Done', priority: 'Low', assignee: 'mia@novapm.io', notes: '', dueDate: null },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: 'Product Launch Q4',
        status: 'On Hold',
        epics: ['Beta program', 'PR kit'],
        tasks: [
          { id: crypto.randomUUID(), title: 'Recruit beta users', status: 'To Do', priority: 'Urgent', assignee: 'mia@novapm.io', notes: '', dueDate: null },
          { id: crypto.randomUUID(), title: 'Draft announcement', status: 'To Do', priority: 'Medium', assignee: 'alex@novapm.io', notes: '', dueDate: null },
        ],
      },
    ],
  };

  const ws2 = {
    id: crypto.randomUUID(),
    name: 'Platform Engineering',
    members: [
      { email: 'sam@novapm.io', name: 'Sam', role: 'Owner' },
      { email: 'alex@novapm.io', name: 'Alex', role: 'Admin' },
    ],
    projects: [
      {
        id: crypto.randomUUID(),
        name: 'Observability Upgrade',
        status: 'Active',
        epics: ['Tracing', 'Dashboards'],
        tasks: [
          { id: crypto.randomUUID(), title: 'Adopt OTEL', status: 'In Progress', priority: 'High', assignee: 'sam@novapm.io', notes: '', dueDate: null },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: 'CI Speedup',
        status: 'Completed',
        epics: ['Caching', 'Parallelism'],
        tasks: [
          { id: crypto.randomUUID(), title: 'Shard test suites', status: 'Done', priority: 'Medium', assignee: 'alex@novapm.io', notes: '', dueDate: null },
        ],
      },
    ],
  };

  return [ws1, ws2];
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [workspaces, setWorkspaces] = useState(seedData());
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(workspaces[0].id);
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const current = useMemo(
    () => workspaces.find((w) => w.id === currentWorkspaceId) || workspaces[0],
    [workspaces, currentWorkspaceId]
  );

  function updateWorkspace(id, updater) {
    setWorkspaces((prev) => prev.map((w) => (w.id === id ? updater(w) : w)));
  }

  // Workspace actions
  const handleCreateWorkspace = (name) => {
    const ws = { id: crypto.randomUUID(), name, members: [], projects: [] };
    setWorkspaces((prev) => [...prev, ws]);
    setCurrentWorkspaceId(ws.id);
  };
  const handleRenameWorkspace = (id, name) => updateWorkspace(id, (w) => ({ ...w, name }));
  const handleDeleteWorkspace = (id) => {
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    if (currentWorkspaceId === id && workspaces.length > 1) setCurrentWorkspaceId(workspaces.find((w) => w.id !== id)?.id || '');
  };
  const handleInviteMember = (id, email, role) => {
    updateWorkspace(id, (w) => ({ ...w, members: [...w.members, { email, role: 'Pending', name: email.split('@')[0] }]}));
    setTimeout(() => {
      // auto-accept invite for demo
      updateWorkspace(id, (w) => ({ ...w, members: w.members.map((m) => (m.email === email ? { ...m, role } : m)) }));
    }, 600);
  };
  const handleChangeMemberRole = (id, email, role) => updateWorkspace(id, (w) => ({ ...w, members: w.members.map((m) => (m.email === email ? { ...m, role } : m)) }));
  const handleRemoveMember = (id, email) => updateWorkspace(id, (w) => ({ ...w, members: w.members.filter((m) => m.email !== email) }));

  // Project actions
  const handleCreateProject = ({ name, status }) => {
    updateWorkspace(current.id, (w) => ({
      ...w,
      projects: [
        ...w.projects,
        { id: crypto.randomUUID(), name, status, epics: [], tasks: [] },
      ],
    }));
  };
  const handleUpdateProject = (projectId, patch) => {
    updateWorkspace(current.id, (w) => ({
      ...w,
      projects: w.projects.map((p) => (p.id === projectId ? { ...p, ...patch } : p)),
    }));
  };
  const handleDeleteProject = (projectId) => {
    updateWorkspace(current.id, (w) => ({ ...w, projects: w.projects.filter((p) => p.id !== projectId) }));
  };

  // Task actions
  const handleAddTask = (projectId, task) => {
    updateWorkspace(current.id, (w) => ({
      ...w,
      projects: w.projects.map((p) => (p.id === projectId ? { ...p, tasks: [task, ...p.tasks] } : p)),
    }));
  };
  const handleUpdateTask = (projectId, taskId, patch) => {
    updateWorkspace(current.id, (w) => ({
      ...w,
      projects: w.projects.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)) }
          : p
      ),
    }));
  };
  const handleDeleteTask = (projectId, taskId) => {
    updateWorkspace(current.id, (w) => ({
      ...w,
      projects: w.projects.map((p) => (p.id === projectId ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) } : p)),
    }));
  };

  // Global search filters projects by name and tasks by title
  const visibleProjects = useMemo(() => {
    if (!globalSearch.trim()) return current?.projects || [];
    const q = globalSearch.toLowerCase();
    return (current?.projects || []).filter(
      (p) => p.name.toLowerCase().includes(q) || p.tasks.some((t) => t.title.toLowerCase().includes(q))
    );
  }, [current, globalSearch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        <WorkspaceSwitcher
          workspaces={workspaces}
          currentWorkspaceId={currentWorkspaceId}
          setCurrentWorkspaceId={setCurrentWorkspaceId}
          onCreateWorkspace={handleCreateWorkspace}
          onRenameWorkspace={handleRenameWorkspace}
          onDeleteWorkspace={handleDeleteWorkspace}
          onInviteMember={handleInviteMember}
          onChangeMemberRole={handleChangeMemberRole}
          onRemoveMember={handleRemoveMember}
        />

        <main className="flex-1 space-y-6">
          <AnalyticsOverview projects={current?.projects || []} members={current?.members || []} />

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Projects & Tasks</h2>
              <div className="text-xs text-gray-500">{visibleProjects.length} projects</div>
            </div>
            <ProjectList
              projects={visibleProjects}
              members={current?.members || []}
              onCreateProject={handleCreateProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </main>
      </div>

      <footer className="py-6 text-center text-xs text-gray-500">
        Built with ❤️ for internal collaboration • Demo data only
      </footer>
    </div>
  );
}
