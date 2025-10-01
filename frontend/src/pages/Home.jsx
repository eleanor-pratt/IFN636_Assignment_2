import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div 
      className="py-6 px-6 w-full flex items-center justify-center 
                 bg-[#FFFDF1] dark:bg-slate-900 min-h-screen"
    >
      <Link to="/login" className="mr-4">
        <button 
          className="justify-start font-['pacifico'] 
                     text-lime-700 dark:text-lime-400 text-[200px]"
        >
          Plant Nursery
        </button>
      </Link>
    </div>
  );
};

export default Home;
