import { Outlet } from "react-router";
import { Navbar } from "./components/layouts/navbar";
import { Footer } from "./components/layouts/footer";

function App() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
