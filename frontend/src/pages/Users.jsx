import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/api/user', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(res.data || []);
      } catch (err) {
        alert(err?.response?.data?.message || 'Failed to load users');
      }
    };
    if (user?.token) fetchUsers();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FFFDF1] dark:bg-slate-900 py-8">
      <div className="container mx-auto px-6 space-y-8">

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
            Manage Users
          </h2>
          <UserForm
            users={users}
            setUsers={setUsers}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
          />
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
            All Users
          </h2>
          <UserList
            users={users}
            setUsers={setUsers}
            setEditingUser={setEditingUser}
          />
        </section>

      </div>
    </div>
  );
};

export default Users;
