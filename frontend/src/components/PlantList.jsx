import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PlantList = ({ plants, setPlants, setEditingPlant }) => {
  const { user } = useAuth();

  const handleDelete = async (plantId) => {
    try {
      await axiosInstance.delete(`/api/plant/${plantId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPlants(plants.filter((plant) => plant._id !== plantId));
    } catch (error) {
      alert('Failed to delete plant.');
    }
  };

  const handleAddBasketItem = async (plantId) => {
    try {
      await axiosInstance.post(`/api/basketItem`, {plant: plantId, quantity: 1}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (error) {
      alert('Failed to add plant to basket.');
    }
  };

  return (
    <div>
      {plants.map((plant) => (
        <div key={plant._id} className="bg-[#f9f9f7] p-4 mb-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-[#2E6D17]">{plant.commonName}</h2>
          <p className="text text-gray-500 italic">{plant.botanicalName}</p>
          <p className="text">{plant.description}</p>
          <p className="text">Stock Count: {plant.stockCount}</p>
          <div className="flex gap-x-2">
            <button
              onClick={() => setEditingPlant(plant)}
              className="bg-[#75b550] px-4 py-2 hover:bg-[#ffff00] rounded-[30px] gap-4"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(plant._id)}
              className="bg-[#ff4e50] px-4 py-2 hover:bg-[#ffff00] rounded-[30px] flex-gap-10"
            >
              Delete
            </button>
             <button
              onClick={() => handleAddBasketItem(plant._id)}
              className="bg-[#9ed670] px-4 py-2 hover:bg-[#ffff00] rounded-[30px] gap-4"
            >
              Add to Basket
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantList;
