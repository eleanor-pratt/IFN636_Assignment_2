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
      await axiosInstance.post(`/api/basketItem`, { plant: plantId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (error) {
      alert('Failed to add plant to basket.');
    }
  };

  if (!plants?.length) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6
                      bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
        No plants yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {plants.map((plant) => (
        <div
          key={plant._id}
          className="p-4 rounded-xl shadow
                     bg-white dark:bg-slate-900
                     border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {plant.commonName}
          </h2>

          <p className="italic mt-0.5 text-slate-600 dark:text-slate-400">
            {plant.botanicalName}
          </p>

          {plant.description && (
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              {plant.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-sm
                         bg-lime-100 text-lime-800
                         dark:bg-lime-900/40 dark:text-lime-300"
            >
              Stock: {plant.stockCount}
            </span>
          </div>

          <div className="flex gap-x-2 mt-4">
            {user.role === 1 && (
              <>
                <button
                  onClick={() => setEditingPlant(plant)}
                  className="px-4 py-2 rounded-[30px] w-24 text-sm
                             bg-[#8CB369] text-black hover:bg-[#e8d174]
                             dark:text-white dark:hover:bg-[#a3c96e]"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(plant._id)}
                  className="px-4 py-2 rounded-[30px] w-24 text-sm
                             bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            )}

            <button
              onClick={() => handleAddBasketItem(plant._id)}
              className="ml-auto font-normal font-['Roboto'] w-40 h-10 rounded-[30px]
                         bg-[#8CB369] text-black hover:bg-[#e8d174]
                         dark:text-white dark:hover:bg-[#a3c96e]"
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
