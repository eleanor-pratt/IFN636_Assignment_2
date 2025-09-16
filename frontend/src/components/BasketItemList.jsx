import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const BasketItemList = ({ items, setItems }) => {
  const { user } = useAuth();

  const handleDelete = async (itemId) => {
    try {
      await axiosInstance.delete(`/api/basketItem/${itemId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      alert('Failed to delete item.');
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      const response = await axiosInstance.put(`/api/basketItem/${itemId}`, {quantity}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(items.map((item) => (item._id === response.data._id ? response.data : item)));
    } catch (error) {
      alert('Failed to delete item.');
    }
  }

  return (
    <div>
      {items.map((item) => (
        <div key={item._id} className="bg-[#f9f9f7] p-4 mb-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#2E6D17]">{item.plant.commonName}</h2>
          <p className="text text-gray-500 italic">{item.plant.botanicalName}</p>
          <p className="text ">Quantity: {item.quantity} 
          <div className="flex items-center gap-4 mt-4">
              <button
              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
              className="bg-[#ededea] p-2 hover:bg-[#e8d174]"
              >
              -
              </button>
               <span className="text-lg font-semibold">{item.quantity}</span>
              <button
              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
              className="bg-[#ededea] p-2 hover:bg-[#e8d174]"
              >
              +
              </button>
              </div>
          </p>
          <div className="flex">
            <button
              onClick={() => handleDelete(item._id)}
              className="ml-auto mt-4 text-center bg-[#d6924d] px-4 py-2 hover:bg-[#e8d174] rounded-[30px] w-40"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BasketItemList;
