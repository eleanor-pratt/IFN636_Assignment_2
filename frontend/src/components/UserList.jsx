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

  if (!users?.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6
                      bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        No users found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((u) => (
        <div
          key={u._id}
          className="p-4 rounded-xl shadow
                     bg-white dark:bg-slate-900
                     border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {u.name}
          </h2>
          <p className="italic text-slate-600 dark:text-slate-400">{u.email}</p>
          <p className="mt-1 text-slate-700 dark:text-slate-300">
            Role:{' '}
            <span
              className={`${
                u.role === 1
                  ? 'text-lime-700 dark:text-lime-400'
                  : 'text-slate-700 dark:text-slate-300'
              } font-medium`}
            >
              {roleLabel(u.role)}
            </span>
          </p>

          <div className="flex gap-x-2 mt-4">
            <button
              onClick={() => setEditingUser(u)}
              className="px-4 py-2 rounded-[30px] w-24 text-sm
                         bg-[#8CB369] text-black hover:bg-[#e8d174]
                         dark:text-white dark:hover:bg-[#a3c96e]"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(u._id)}
              className="px-4 py-2 rounded-[30px] w-24 text-sm
                         bg-red-600 text-white hover:bg-red-700"
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