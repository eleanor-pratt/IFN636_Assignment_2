import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="py-6 px-6 w-full flex items-center justify-center bg-[#FFFDF1] min-h-screen ">
        <Link to="/login" className="mr-4">
            <button class="justify-start text-lime-900/75 text-[200px] font-black font-['Work_Sans']">
            Welcome
            </button>
        </Link>
    </div>
    
  );
};


export default Home;

