import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF1] dark:bg-slate-900 py-8">

      <div className="max-w-md mx-auto mt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 p-6 shadow-md rounded border border-slate-200 dark:border-slate-700"
        >
          <h1 className="mb-6 text-center text-[#8CB369] text-5xl font-['Satisfy']">
            Registration
          </h1>

          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-4 p-2 border rounded 
                     bg-white dark:bg-slate-800 
                     border-slate-300 dark:border-slate-600 
                     text-slate-900 dark:text-white 
                     placeholder-slate-500 dark:placeholder-slate-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mb-4 p-2 border rounded 
                     bg-white dark:bg-slate-800 
                     border-slate-300 dark:border-slate-600 
                     text-slate-900 dark:text-white 
                     placeholder-slate-500 dark:placeholder-slate-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full mb-6 p-2 border rounded 
          bg-white dark:bg-slate-800 
          border-slate-300 dark:border-slate-600 
          text-slate-900 dark:text-white 
          placeholder-slate-500 dark:placeholder-slate-400"
          />

          <button
            type="submit"
            className="mx-auto block w-40 h-10 rounded-[30px] font-['Roboto'] font-normal 
                     bg-[#8CB369] text-black hover:bg-[#e8d174] 
                     dark:text-white dark:hover:bg-[#a3c96e]"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
