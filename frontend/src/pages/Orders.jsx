import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [sortOrder, setSortOrder] = useState('date-desc'); // Default to date descending

  const fetchOrders = useCallback(async (sortParam = sortOrder) => {
    if (!user || !user.token) {
      console.log('No user or token available');
      return;
    }

    try {
      let response;
      if (user.role === 1) {
        response = await axiosInstance.get(`/api/order/all?sort=${sortParam}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else {
        response = await axiosInstance.get(`/api/order/user?sort=${sortParam}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to fetch orders: ' + (error.response?.data?.message || error.message));
    }
  }, [user, sortOrder]);

  useEffect(() => {
    fetchOrders();
  }, [user, fetchOrders]);

  const handleSortChange = (newSortOrder) => {
    console.log('Sort order changed to:', newSortOrder);
    setSortOrder(newSortOrder);
    fetchOrders(newSortOrder);
  };

  return (
    <div className="container mx-auto p-6">
      {user && user.role === 1 && (
        <OrderForm
          orders={orders}
          setOrders={setOrders}
          editingOrder={editingOrder}
          setEditingOrder={setEditingOrder}
          onOrderChange={() => fetchOrders()}
        />
      )}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8CB369]"
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
    </div>
  );
};

export default Orders;