import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      navigate('/plants');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 ">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded ">
        <h1 className="mb-4 text-center text-[#8CB369] text-5xl font-['Satisfy']">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="mx-auto block justify-center font-normal font-['Roboto'] w-40 h-10 bg-[#8CB369] text-black p-2 hover:bg-[#e8d174] rounded-[30px]">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
