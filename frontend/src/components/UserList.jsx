import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const UserList = ({ users, setUsers, setEditingUser }) => {
  const { user } = useAuth();

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((u) => u._id !== userId));
    } catch (error) {
      alert('Failed to delete user.');
      console.log(error);
    }
  };

  const roleLabel = (role) => (role === 1 ? 'Admin' : 'User');

  return (
    <div>
      {users.map((u) => (
        <div key={u._id} className="bg-[#f9f9f7] p-4 mb-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-[#2E6D17]">{u.name}</h2>
          <p className="text text-gray-500 italic">{u.email}</p>
          <p className="text">Role: {roleLabel(u.role)}</p>

          <div className="flex gap-x-2 mb-4 mt-4">
            <button
              onClick={() => setEditingUser(u)}
              className="bg-[#8CB369] px-4 py-2 hover:bg-[#e8d174] rounded-[30px] w-20"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(u._id)}
              className="bg-[#668a46] px-4 py-2 hover:bg-[#e8d174] rounded-[30px] w-20"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;