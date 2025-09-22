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
    <div className="container mx-auto p-6">
      <UserForm
        users={users}
        setUsers={setUsers}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />
      <UserList
        users={users}
        setUsers={setUsers}
        setEditingUser={setEditingUser}
      />
    </div>
  );
};

export default Users;
