import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let response;
        if (user.role === 1) {
          response = await axiosInstance.get('/api/order/all', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
        } else {
          response = await axiosInstance.get('/api/order/user', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
        }


        
        setOrders(response.data);
      } catch (error) {
        alert(error);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
    {user.role === 1 ? 
      (
        <>
        <OrderForm
        orders={orders}
        setOrders={setOrders}
        editingOrder={editingOrder}
        setEditingOrder={setEditingOrder}
      />   
        </>
      ) : (<></>)}
      <OrderList orders={orders} setOrders={setOrders} setEditingOrder={setEditingOrder} />
    </div>
  );
};

export default Orders;
