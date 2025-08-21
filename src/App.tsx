import { Outlet } from "react-router";
import { Navbar } from "./components/layouts/navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
