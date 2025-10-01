import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const OrderForm = ({ orders, setOrders, editingOrder, setEditingOrder }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    completed: false,     
    orderDate: ''         
  });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        description: editingOrder.description ?? '',
        completed: !!editingOrder.completed,
        
        orderDate: editingOrder.orderDate
          ? String(editingOrder.orderDate).slice(0, 10)
          : ''
      });
    } else {
      setFormData({ description: '', completed: false, orderDate: '' });
    }
  }, [editingOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!formData.description.trim()) {
      alert('Please enter a description.');
      return;
    }

    try {
      if (editingOrder) {
        const { data } = await axiosInstance.put(
          `/api/order/${editingOrder._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setOrders(orders.map((o) => (o._id === data._id ? data : o)));
      } else {
        const { data } = await axiosInstance.post(
          '/api/order',
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setOrders([...orders, data]);
      }

      setEditingOrder(null);
      setFormData({ description: '', completed: false, orderDate: '' });
    } catch (error) {
      alert('Failed to save order.');
      console.log(error);
    }
  };

  return (
    
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md rounded-xl p-6"
    >
      <h1 className="mb-4 text-slate-900 dark:text-white text-3xl font-bold font-['pacifico']">
        {editingOrder ? 'Edit Order' : 'Add New Order'}
      </h1>

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
        Description
      </label>
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white
                   placeholder-slate-500 dark:placeholder-slate-400"
      />

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
        Status
      </label>
      <select
        value={String(formData.completed)}
        onChange={(e) => setFormData({ ...formData, completed: e.target.value === 'true' })}
        className="w-64 mb-4 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white"
      >
        <option value="false">Not Filled</option>
        <option value="true">Filled</option>
      </select>

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">
        Delivery Date
      </label>
      <input
        type="date"
        value={formData.orderDate}
        onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
        className="w-64 mb-6 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white"
      />

      <p></p>
      <button
        type="submit"
        className="font-['Roboto'] w-40 h-10 rounded-[30px]
                   bg-[#75b550] text-black hover:bg-[#e8d174]
                   dark:text-white dark:hover:bg-[#8cb369]"
      >
        {editingOrder ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default OrderForm;
