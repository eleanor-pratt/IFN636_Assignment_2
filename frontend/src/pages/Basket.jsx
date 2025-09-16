import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
// import OrderForm from '../components/OrderForm';
import BasketItemList from '../components/BasketItemList';
import { useAuth } from '../context/AuthContext';

const Basket = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  // const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get('/api/basketItem', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setItems(response.data);
      } catch (error) {
        alert(error);
      }
    };

    fetchItems();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <BasketItemList items={items} setItems={setItems}/>
    </div>
  );
};

export default Basket;
