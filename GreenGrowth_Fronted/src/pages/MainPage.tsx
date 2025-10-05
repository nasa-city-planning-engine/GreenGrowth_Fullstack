import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center bg-worldImg"
      style={{ backgroundImage: "url('/world.jpg')" }}
    >
      <Link
        to="/map"
        className="bg-green-600 hover:bg-green-700/85 text-white font-bold py-3 px-6 rounded-full shadow-lg transition underline outline-2 outline-solid "
      >
        Start
      </Link>
    </div>
  );
};

export default MainPage;
