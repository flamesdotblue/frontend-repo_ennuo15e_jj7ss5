import React, { useMemo } from 'react';

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accent}`}>{value}</div>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d) => (
        <div key={d.label} className="flex-1">
          <div className="w-full bg-indigo-600/80 rounded-t-md" style={{ height: `${(d.value / max) * 100}%` }} />
          <div className="mt-1 text-[10px] text-gray-500 truncate text-center">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsOverview({ projects, members }) {
  const { totalTasks, byStatus, byAssignee, completion } = useMemo(() => {
    const tasks = projects.flatMap((p) => p.tasks);
    const totalTasks = tasks.length;
    const byStatus = ['To Do', 'In Progress', 'Done'].map((s) => ({
      label: s,
      value: tasks.filter((t) => t.status === s).length,
    }));
    const assignees = {};
    tasks.forEach((t) => {
      assignees[t.assignee] = (assignees[t.assignee] || 0) + 1;
    });
    const byAssignee = members.map((m) => ({ label: m.name || m.email, value: assignees[m.email] || 0 }));
    const completion = projects.map((p) => {
      const done = p.tasks.filter((t) => t.status === 'Done').length;
      const total = p.tasks.length || 1;
      return { id: p.id, name: p.name, percent: Math.round((done / total) * 100) };
    });
    return { totalTasks, byStatus, byAssignee, completion };
  }, [projects, members]);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total tasks" value={totalTasks} accent="text-indigo-600" />
        <Stat label="To Do" value={byStatus.find((s) => s.label === 'To Do')?.value || 0} accent="text-gray-700 dark:text-gray-200" />
        <Stat label="In Progress" value={byStatus.find((s) => s.label === 'In Progress')?.value || 0} accent="text-blue-600" />
        <Stat label="Done" value={byStatus.find((s) => s.label === 'Done')?.value || 0} accent="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
          <div className="text-sm font-semibold mb-2">Tasks by assignee</div>
          <BarChart data={byAssignee} />
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950 space-y-3">
          <div className="text-sm font-semibold">Project progress</div>
          {completion.map((c) => (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{c.name}</span>
                <span className="font-medium">{c.percent}%</span>
              </div>
              <ProgressBar value={c.percent} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnalyticsOverview;
