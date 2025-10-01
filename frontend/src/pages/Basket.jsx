import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import BasketItemList from '../components/BasketItemList';
import { useAuth } from '../context/AuthContext';

const Basket = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get('/api/basketItem', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems(response.data || []);
      } catch (error) {
        alert(error?.response?.data?.message || 'Failed to load basket items');
      }
    };
    if (user?.token) fetchItems();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FFFDF1] dark:bg-slate-900 py-8">
      <div className="container mx-auto px-6">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
            Your Basket
          </h2>
          <BasketItemList items={items} setItems={setItems} />
        </section>
      </div>
    </div>
  );
};

export default Basket;
