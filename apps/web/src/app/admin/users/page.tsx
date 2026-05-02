'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, ShieldAlert, MoreVertical } from 'lucide-react';
import api from '@/lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch - replace with real endpoint later
    // fetchUsers();
    setUsers([
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', created_at: new Date().toISOString() },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', created_at: new Date().toISOString() },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-slate-400 mt-1">Manage registered congregation members and admins.</p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..."
              className="w-full bg-slate-800 border-none text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-sm">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Joined</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No users found.</td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {user.role === 'admin' ? (
                      <span className="flex items-center gap-1 w-max px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-xs border border-indigo-500/20">
                        <ShieldAlert size={12} /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 w-max px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-white/5">
                        <Shield size={12} /> User
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
