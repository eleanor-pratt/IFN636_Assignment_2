import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const UserForm = ({ users, setUsers, editingUser, setEditingUser }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 0, // 0 = user, 1 = admin
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        password: '', // don't prefill existing password
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

        const response = await axiosInstance.put(
          `/api/user/${editingUser._id}`,
          payload,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setUsers(users.map((u) => (u._id === response.data._id ? response.data : u)));
      } else {
        if (!formData.password.trim()) {
          alert('Password is required for new users.');
          return;
        }

        const response = await axiosInstance.post(
          '/api/user',
          {
            name: formData.name,
            email: formData.email,
            password: formData.password.trim(),
            role: Number(formData.role),
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setUsers([...users, response.data]);
      }

      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 0 });
    } catch (error) {
      alert('Failed to save user.');
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="mb-4 text-black text-3xl -bold font-['pacifico']">
        {editingUser ? 'Edit User' : 'Add New User'}
      </h1>

      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      {editingUser ? (
        <input
          type="password"
          placeholder="New Password (optional)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
      ) : (
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
      )}

      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) })}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value={0}>User</option>
        <option value={1}>Admin</option>
      </select>

      <button
        type="submit"
        className="font-normal font-['Roboto'] w-40 h-10 bg-[#75b550] text-black p-2 hover:bg-[#e8d174] rounded-[30px]"
      >
        {editingUser ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default UserForm;
