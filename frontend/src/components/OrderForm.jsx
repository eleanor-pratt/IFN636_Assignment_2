import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const OrderForm = ({ orders, setOrders, editingOrder, setEditingOrder }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({completed: '', description: '', orderDate: '' });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        description: editingOrder.description,
        completed: editingOrder.completed,
        orderDate: editingOrder.orderDate,
      });
    } else {
      setFormData({completed: '', description: '', orderDate: '' });
    }
  }, [editingOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        const response = await axiosInstance.put(`/api/order/${editingOrder._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(orders.map((order) => (order._id === response.data._id ? response.data : order)));
      } else {
        const response = await axiosInstance.post('/api/order', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders([...orders, response.data]);
      }
      setEditingOrder(null);
      setFormData({completed: '', description: '', orderDate: '' });
    } catch (error) {
      alert('Failed to save order.');
      console.log(error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="mb-4 text-black text-3xl -bold font-['pacifico']">{editingOrder ? 'Add New Order' : 'Add New Order'}</h1>
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        placeholder="Status"
        value={formData.completed}
        onChange={(e) => setFormData({ ...formData, completed: e.target.value })}
        className="w-64 mb-4 p-2 border rounded"
        >
          <option value="" disabled>Select Status</option>
          <option value="Filled">Filled</option>
          <option value="Not Filled">Not Filled</option>
        </select>
        <div></div>
      <input
        type="date"
        placeholder="Delivery Date"
        value={formData.orderDate}
        onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
        className="w-64 mb-4 p-2 border rounded"
      />
      <div></div>
      <button type="submit" className="font-normal font-['Roboto'] w-40 h-10 bg-[#75b550] text-black p-2 hover:bg-[#e8d174] rounded-[30px]">
        {editingOrder ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default OrderForm;
