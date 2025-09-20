import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending

  const fetchOrders = async (sortParam = sortOrder) => {
    try {
      const response = await axiosInstance.get(`/api/order?sort=${sortParam}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(response.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    fetchOrders(newSortOrder);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium">Sort by Date:</label>
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8CB369]"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      
      <OrderForm
        orders={orders}
        setOrders={setOrders}
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
        onOrderChange={() => fetchOrders()}
      />
      <OrderList orders={orders} setOrders={setOrders} setEditingOrder={setEditingOrder} />
    </div>
  );
};

export default Orders;
