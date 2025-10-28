import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Folder, Filter, User, Flag, CheckCircle, Clock } from 'lucide-react';

const STATUS_COLORS = {
  'To Do': 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-200',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Done: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  'On Hold': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  Completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  Active: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const PRIORITY_COLORS = {
  Low: 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-200',
  Medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  High: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  Urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

function ProjectCard({ project, members, onEdit, onDelete, onAddTask, onUpdateTask, onDeleteTask }) {
  const [open, setOpen] = useState(true);
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState(members[0]?.email || '');

  const grouped = useMemo(() => {
    const map = { 'To Do': [], 'In Progress': [], Done: [] };
    project.tasks.forEach((t) => map[t.status]?.push(t));
    return map;
  }, [project.tasks]);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600/10 text-indigo-600 grid place-items-center">
            <Folder className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold">{project.name}</div>
            <div className="text-xs text-gray-500">{project.epics?.length || 0} epics • {project.tasks.length} tasks</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_COLORS[project.status]}`}>{project.status}</span>
          <button onClick={() => setOpen(!open)} className="rounded-md border border-gray-200 dark:border-gray-800 px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-900">
            {open ? 'Hide' : 'Show'}
          </button>
          <button onClick={() => onEdit(project)} className="rounded-md border border-gray-200 dark:border-gray-800 px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-1">
            <Edit className="h-4 w-4" /> Edit
          </button>
          <button onClick={() => onDelete(project.id)} className="rounded-md border border-red-200 text-red-600 dark:border-red-900/50 px-2 py-1 text-sm hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {open && (
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="flex-1 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5 text-sm"
              placeholder="Quick add task"
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5 text-sm">
              {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5 text-sm">
              {members.map((m) => (
                <option key={m.email} value={m.email}>{m.name || m.email.split('@')[0]}</option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!taskText.trim()) return;
                onAddTask(project.id, {
                  id: crypto.randomUUID(),
                  title: taskText.trim(),
                  status: 'To Do',
                  priority,
                  assignee,
                  notes: '',
                  dueDate: null,
                });
                setTaskText('');
              }}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 text-white px-3 py-1.5 text-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" /> Add task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['To Do', 'In Progress', 'Done'].map((col) => (
              <div key={col} className="rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <div className="text-sm font-semibold">{col}</div>
                  <span className="text-xs text-gray-500">{grouped[col].length}</span>
                </div>
                <div className="p-3 space-y-2 min-h-[100px]">
                  {grouped[col].map((t) => (
                    <div key={t.id} className="rounded-md border border-gray-200 dark:border-gray-800 p-2 bg-white dark:bg-gray-950">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium">{t.title}</div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <span className={`px-1.5 py-0.5 rounded ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                            <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{members.find((m)=>m.email===t.assignee)?.name || t.assignee}</span>
                            {t.dueDate ? (
                              <span className="inline-flex items-center gap-1 text-amber-600"><Clock className="h-3 w-3" />{new Date(t.dueDate).toLocaleDateString()}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={t.status}
                            onChange={(e) => onUpdateTask(project.id, t.id, { status: e.target.value })}
                            className="rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs px-1 py-0.5"
                          >
                            {['To Do', 'In Progress', 'Done'].map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                          <button onClick={() => onDeleteTask(project.id, t.id)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {grouped[col].length === 0 && (
                    <div className="text-xs text-gray-500">No tasks</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectList({
  projects,
  members,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [assignee, setAssignee] = useState('All');
  const [priority, setPriority] = useState('All');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const textMatch = p.name.toLowerCase().includes(query.toLowerCase());
      const taskAssigneeMatch = assignee === 'All' || p.tasks.some((t) => t.assignee === assignee);
      const taskPriorityMatch = priority === 'All' || p.tasks.some((t) => t.priority === priority);
      const statusMatch = status === 'All' || p.status === status;
      return textMatch && taskAssigneeMatch && taskPriorityMatch && statusMatch;
    });
  }, [projects, query, assignee, priority, status]);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('Active');

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              className="pl-7 pr-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5 text-sm">
            {['All', 'Active', 'On Hold', 'Completed'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5 text-sm">
            {['All', 'Low', 'Medium', 'High', 'Urgent'].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5 text-sm">
            <option>All</option>
            {members.map((m) => (
              <option key={m.email} value={m.email}>{m.name || m.email}</option>
            ))}
          </select>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newProjectName.trim()) return;
            onCreateProject({ name: newProjectName.trim(), status: newProjectStatus });
            setNewProjectName('');
          }}
          className="flex items-center gap-2"
        >
          <input
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5 text-sm"
            placeholder="New project name"
          />
          <select value={newProjectStatus} onChange={(e) => setNewProjectStatus(e.target.value)} className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5 text-sm">
            {['Active', 'On Hold', 'Completed'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="inline-flex items-center gap-1 rounded-md bg-indigo-600 text-white px-3 py-1.5 text-sm hover:bg-indigo-700">
            <Plus className="h-4 w-4" /> Add project
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            members={members}
            onEdit={(p) => {
              const name = prompt('Edit project name', p.name);
              if (!name || !name.trim()) return;
              const status = prompt('Status (Active, On Hold, Completed)', p.status) || p.status;
              onUpdateProject(p.id, { name: name.trim(), status });
            }}
            onDelete={onDeleteProject}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500">No projects match current filters.</div>
        )}
      </div>
    </section>
  );
}

export default ProjectList;
