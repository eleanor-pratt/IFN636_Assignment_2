import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const OrderList = ({ orders, setOrders, setEditingOrder }) => {
  const { user } = useAuth();

  const handleDelete = async (orderId) => {
    try {
      await axiosInstance.delete(`/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(orders.filter((o) => o._id !== orderId));
    } catch (error) {
      alert('Failed to delete order.');
    }
  };

  const isCompleted = (completed) => {
    if (typeof completed === 'boolean') return completed;
    if (typeof completed === 'string') {
      const v = completed.toLowerCase();
      return v === 'filled' || v === 'true';
    }
    return false;
  };

  if (!orders?.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6
                      bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const completed = isCompleted(order.completed);
        const dateText = order.orderDate
          ? new Date(order.orderDate).toLocaleDateString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '—';

        return (
          <div
            key={order._id}
            className="p-4 rounded-xl shadow
                       bg-white dark:bg-slate-900
                       border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Order #{order._id?.slice(-6) || ''}
                </h3>
                <p className="mt-1 text-slate-700 dark:text-slate-300">
                  {order.description || '—'}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0
                  ${
                    completed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                title={completed ? 'Filled' : 'Not Filled'}
              >
                {completed ? 'Filled' : 'Not Filled'}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Delivery Date: {dateText}
            </p>

            <div className="flex gap-2 mt-4">
              {user?.role === 1 && (
                <>
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="px-3 py-1.5 rounded-[30px] text-sm
                               bg-[#8CB369] text-black hover:bg-[#e8d174]
                               dark:text-white dark:hover:bg-[#a3c96e]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="px-3 py-1.5 rounded-[30px] text-sm
                               bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
