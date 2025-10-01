import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PlantForm = ({ plants, setPlants, editingPlant, setEditingPlant }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    botanicalName: '',
    commonName: '',
    seasonality: '',
    description: '',
    stockCount: ''
  });

  useEffect(() => {
    if (editingPlant) {
      setFormData({
        botanicalName: editingPlant.botanicalName ?? '',
        commonName: editingPlant.commonName ?? '',
        seasonality: editingPlant.seasonality ?? '',
        description: editingPlant.description ?? '',
        stockCount: editingPlant.stockCount ?? ''
      });
    } else {
      setFormData({ botanicalName: '', commonName: '', seasonality: '', description: '', stockCount: '' });
    }
  }, [editingPlant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlant) {
        const { data } = await axiosInstance.put(`/api/plant/${editingPlant._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlants(plants.map((p) => (p._id === data._id ? data : p)));
      } else {
        const { data } = await axiosInstance.post('/api/plant', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlants([...plants, data]);
      }
      setEditingPlant(null);
      setFormData({ botanicalName: '', commonName: '', seasonality: '', description: '', stockCount: '' });
    } catch (error) {
      alert('Failed to save plant.');
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 
                 shadow-md rounded-xl p-6"
    >
      <h1 className="mb-4 text-slate-900 dark:text-white text-3xl font-bold font-['pacifico']">
        {editingPlant ? 'Edit Plant' : 'Add New Plant'}
      </h1>

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">Botanical Name</label>
      <input
        type="text"
        placeholder="e.g., Monstera deliciosa"
        value={formData.botanicalName}
        onChange={(e) => setFormData({ ...formData, botanicalName: e.target.value })}
        className="w-full mb-4 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white
                   placeholder-slate-500 dark:placeholder-slate-400"
      />

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">Common Name</label>
      <input
        type="text"
        placeholder="e.g., Swiss Cheese Plant"
        value={formData.commonName}
        onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
        className="w-full mb-4 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white
                   placeholder-slate-500 dark:placeholder-slate-400"
      />

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">Seasonality</label>
      <select
        value={formData.seasonality}
        onChange={(e) => setFormData({ ...formData, seasonality: e.target.value })}
        className="w-full mb-4 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white"
      >
        <option value="" disabled>Select a season</option>
        <option value="Spring">Spring</option>
        <option value="Summer">Summer</option>
        <option value="Autumn">Autumn</option>
        <option value="Winter">Winter</option>
      </select>

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">Description</label>
      <textarea
        rows={3}
        placeholder="Short care/use notes"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white
                   placeholder-slate-500 dark:placeholder-slate-400"
      />

      <label className="block text-sm mb-1 text-slate-700 dark:text-slate-300">Stock Count</label>
      <input
        type="number"
        min="0"
        placeholder="e.g., 12"
        value={formData.stockCount}
        onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
        className="w-full mb-6 p-2 rounded border
                   bg-white dark:bg-slate-800
                   border-slate-300 dark:border-slate-600
                   text-slate-900 dark:text-white
                   placeholder-slate-500 dark:placeholder-slate-400"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="font-['Roboto'] w-40 h-10 rounded-[30px]
                     bg-[#75b550] text-black hover:bg-[#e8d174]
                     dark:text-white dark:hover:bg-[#8cb369]"
        >
          {editingPlant ? 'Update' : 'Add'}
        </button>

        {editingPlant && (
          <button
            type="button"
            onClick={() => setEditingPlant(null)}
            className="px-4 h-10 rounded-lg text-sm
                       border border-slate-300 dark:border-slate-600
                       bg-white dark:bg-slate-800
                       text-slate-700 dark:text-slate-200
                       hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default PlantForm;
