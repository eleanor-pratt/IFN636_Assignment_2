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
        <div key={item._id} className="bg-stone-100 p-4 mb-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-[#2E6D17]">{item.plant.commonName}</h2>
          <p className="text text-gray-500 italic">{item.plant.botanicalName}</p>
          <p className="text ">Quantity: {item.quantity} <button
              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
              className=" font-normal font-['Roboto'] bg-[#75b550] text-black p-2 hover:bg-[#ffff00] rounded-[30px]"
              >
              -
              </button>
              <button
              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
              className="font-normal font-['Roboto'] bg-[#75b550] text-black p-2 hover:bg-[#ffff00] rounded-[30px]"
              >
              +
              </button>
          </p>
          <div className="mt-2">
            <button
              onClick={() => handleDelete(item._id)}
              className="font-normal font-['Roboto'] bg-[#ff4e50] text-black p-2 hover:bg-[#ffff00] rounded-[30px]"
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
