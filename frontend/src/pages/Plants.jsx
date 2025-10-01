import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import PlantForm from '../components/PlantForm';
import PlantList from '../components/PlantList';
import { useAuth } from '../context/AuthContext';

const Plants = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [editingPlant, setEditingPlant] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axiosInstance.get('/api/plant', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlants(response.data);
      } catch (error) {
        alert(error);
      }
    };

    fetchPlants();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#FFFDF1] dark:bg-slate-900 py-8">
      <div className="container mx-auto px-6 space-y-8">
        {user.role === 1 && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
              Manage Plants
            </h2>

            <PlantForm
              plants={plants}
              setPlants={setPlants}
              editingPlant={editingPlant}
              setEditingPlant={setEditingPlant}
            />
          </section>
        )}

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">
            All Plants
          </h2>

          <PlantList
            plants={plants}
            setPlants={setPlants}
            setEditingPlant={setEditingPlant}
          />
        </section>
      </div>
    </div>
  );
};

export default Plants;
