import { Link } from "react-router-dom";
import logo from "../../public/logo.png";

export default function Header() {
  return (
    <>
      <header className="bg-lime-200 text-teal-950 shadow-lg border-b-2 border-teal-700">
        <div className="h-[4rem] flex items-center px-6">
          <Link to="/">
            {" "}
            <img
              src={logo}
              style={{ width: "auto", height: "150px" }}
              className="mr-2"
              alt="Logo"
            ></img>{" "}
          </Link>
        </div>
      </header>
    </>
  );
}
