import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [sortOrder, setSortOrder] = useState('date-desc'); // Default to date descending

  const fetchOrders = async (sortParam = sortOrder) => {
    if (!user || !user.token) {
      console.log('No user or token available');
      return;
    }
    
    try {
      console.log('Fetching orders with sort parameter:', sortParam);
      const response = await axiosInstance.get(`/api/order?sort=${sortParam}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Orders fetched successfully:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to fetch orders: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, user:', user);
    if (user && user.token) {
      console.log('User authenticated, fetching orders...');
      fetchOrders();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSortChange = (newSortOrder) => {
    console.log('Sort order changed to:', newSortOrder);
    setSortOrder(newSortOrder);
    fetchOrders(newSortOrder);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        {user.role === 1 && (
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
              <optgroup label="Sort by Order Number">
                <option value="order-number-desc">Order Number: High to Low</option>
                <option value="order-number-asc">Order Number: Low to High</option>
              </optgroup>
            </select>
          </div>
        )}
      </div>

      {user.role === 1 && (
        <OrderForm
          orders={orders}
          setOrders={setOrders}
          editingOrder={editingOrder}
          setEditingOrder={setEditingOrder}
          onOrderChange={() => fetchOrders()}
        />
      )}

      <OrderList 
        orders={orders} 
        setOrders={setOrders} 
        setEditingOrder={setEditingOrder} 
      />
    </div>
  );
};

export default Orders;