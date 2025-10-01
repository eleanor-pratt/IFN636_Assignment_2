import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const UserForm = ({ users, setUsers, editingUser, setEditingUser }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 0, 
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        password: '', 
        role: typeof editingUser.role === 'number' ? editingUser.role : 0,
      });
    } else {
      setFormData({ name: '', email: '', password: '', role: 0 });
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const payload = {
          name: formData.name,
          email: formData.email,
          role: Number(formData.role),
        };
        if (formData.password.trim()) {
          payload.password = formData.password.trim();
        }

        const { data } = await axiosInstance.put(
          `/api/user/${editingUser._id}`,
          payload,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setUsers(users.map((u) => (u._id === data._id ? data : u)));
      } else {
        if (!formData.password.trim()) {
          alert('Password is required for new users.');
          return;
        }

        const { data } = await axiosInstance.post(
          '/api/user',
          {
            name: formData.name,
            email: formData.email,
            password: formData.password.trim(),
            role: Number(formData.role),
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setUsers([...users, data]);
      }

      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 0 });
    } catch (error) {
      alert('Failed to save user.');
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md rounded-xl p-6"
    >
      <h1 className="mb-4 text-slate-900 dark:text-white text-3xl font-bold font-['pacifico']">
        {editingUser ? 'Edit User' : 'Add New User'}
      </h1>

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">Name</label>
      <input
        type="text"
        placeholder="e.g., Alex Johnson"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white
                   placeholder-slate-500 dark:placeholder-slate-400"
      />

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">Email</label>
      <input
        type="email"
        placeholder="e.g., alex@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full mb-4 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white
                   placeholder-slate-500 dark:placeholder-slate-400"
      />

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
        {editingUser ? 'New Password (optional)' : 'Password'}
      </label>
      <input
        type="password"
        placeholder={editingUser ? 'Set a new password (optional)' : 'Enter a password'}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="w-full mb-4 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white
                   placeholder-slate-500 dark:placeholder-slate-400"
      />

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">Role</label>
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) })}
        className="w-full mb-6 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white"
      >
        <option value={0}>User</option>
        <option value={1}>Admin</option>
      </select>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="font-['Roboto'] w-40 h-10 rounded-[30px]
                     bg-[#75b550] text-black hover:bg-[#e8d174]
                     dark:text-white dark:hover:bg-[#8cb369]"
        >
          {editingUser ? 'Update' : 'Add'}
        </button>

        {editingUser && (
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            className="px-4 h-10 rounded-lg text-sm
                       border border-slate-300 dark:border-slate-600
                       bg-white dark:bg-slate-800
                       text-slate-700 dark:text-slate-200
                       hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
