import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PlantForm = ({ plants, setPlants, editingPlant, setEditingPlant }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ botanicalName: '', commonName: '', seasonality: '', description: '', stockCount: '' });

  useEffect(() => {
    if (editingPlant) {
      setFormData({
        botanicalName: editingPlant.botanicalName,
        commonName: editingPlant.commonName,
        seasonality: editingPlant.seasonality,
        description: editingPlant.description,
        stockCount: editingPlant.stockCount,
      });
    } else {
      setFormData({ botanicalName: '', commonName: '', seasonality: '', description: '', stockCount: '' });
    }
  }, [editingPlant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlant) {
        const response = await axiosInstance.put(`/api/plant/${editingPlant._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlants(plants.map((plant) => (plant._id === response.data._id ? response.data : plant)));
      } else {
        const response = await axiosInstance.post('/api/plant', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlants([...plants, response.data]);
      }
      setEditingPlant(null);
      setFormData({ botanicalName: '', commonName: '', seasonality: '', description: '', stockCount: '' });
    } catch (error) {
      alert('Failed to save plant.');
      console.log(error)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="mb-4 text-black text-3xl -bold font-['pacifico']">{editingPlant ? 'Edit Plant' : 'Add New Plant'}</h1>
      <input
        type="text"
        placeholder="Botanical Name"
        value={formData.botanicalName}
        onChange={(e) => setFormData({ ...formData, botanicalName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Common Name"
        value={formData.commonName}
        onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <select
        placeholder="Seasonality"
        value={formData.seasonality}
        onChange={(e) => setFormData({ ...formData, seasonality: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        >
          <option value="" disabled>Select a season</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Autumn">Autumn</option>
          <option value="Winter">Winter</option>
        </select>
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Stock Count"
        value={formData.stockCount}
        onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="font-normal font-['Roboto'] w-40 h-10 bg-[#75b550] text-black p-2 hover:bg-[#ffff00] rounded-[30px]">
        {editingPlant ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default PlantForm;
