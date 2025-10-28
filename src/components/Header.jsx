import React from 'react';
import { Search, Bell, Sun, Moon, User } from 'lucide-react';

function Header({ theme, onToggleTheme, searchQuery, onSearchChange }) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-950/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
            <span className="text-lg font-semibold tracking-tight">Nova PM</span>
          </div>

          <div className="relative hidden md:block w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              type="text"
              placeholder="Search workspaces, projects, tasks, or tags..."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-semibold text-white grid place-items-center">3</span>
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 py-1.5">
              <User className="h-4 w-4" />
              <span className="hidden sm:block text-sm">alex@novapm.io</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
