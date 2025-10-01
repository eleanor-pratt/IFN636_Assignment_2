import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [sortOrder, setSortOrder] = useState('date-desc');

  const fetchOrders = useCallback(async (sortParam = sortOrder) => {
    if (!user?.token) return;
    try {
      const url =
        user.role === 1
          ? `/api/order/all?sort=${sortParam}`
          : `/api/order/user?sort=${sortParam}`;
      const { data } = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error?.response?.data || error);
      alert('Failed to fetch orders: ' + (error.response?.data?.message || error.message));
    }
  }, [user, sortOrder]);

  useEffect(() => {
    fetchOrders();
  }, [user, fetchOrders]);

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    fetchOrders(newSortOrder);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF1] dark:bg-slate-900 py-8">
      <div className="container mx-auto px-6 space-y-8">
        {user?.role === 1 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
              Manage Orders
            </h2>
            <OrderForm
              orders={orders}
              setOrders={setOrders}
              editingOrder={editingOrder}
              setEditingOrder={setEditingOrder}
              onOrderChange={() => fetchOrders()}
            />
          </section>
        )}

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow p-6">
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Sort by:
            </label>
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 rounded-lg
                         bg-white dark:bg-slate-800
                         border border-slate-300 dark:border-slate-600
                         text-slate-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-[#8CB369]"
            >
              <optgroup label="Sort by Date">
                <option value="date-desc">Date: Newest First</option>
                <option value="date-asc">Date: Oldest First</option>
              </optgroup>
              <optgroup label="Sort by Status">
                <option value="completed-desc">Status: Not Filled</option>
                <option value="completed-asc">Status: Filled</option>
              </optgroup>
            </select>
          </div>

          <OrderList
            orders={orders}
            setOrders={setOrders}
            setEditingOrder={setEditingOrder}
          />
        </section>
      </div>
    </div>
  );
};

export default Orders;
