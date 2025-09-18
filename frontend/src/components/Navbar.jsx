import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#658147] text-white p-4 flex justify-between items-center">
      <Link to="/" className="justify-start text-white text-4xl font-bold font-['Roboto']">Plant Nursery</Link>
      <div>
        {user ? (
          <>
            {user.role === 1 ? 
            (
              <>
                <Link to="/users" className="mr-4">Users</Link>    
              </>
            ) : (<></>)}
            <Link to="/plants" className="mr-4">Plants</Link>
            <Link to="/orders" className="mr-4">Orders</Link>
            <Link to="/basket" className="mr-4">Basket</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-[#8CB369] px-4 py-2 rounded hover:bg-lime-500 rounded-[30px]"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-[#8CB369] px-4 py-2 rounded hover:bg-lime-500 rounded-[30px]"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
