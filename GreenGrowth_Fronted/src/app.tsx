import { Outlet } from "react-router";
import Header from "./components/header";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}