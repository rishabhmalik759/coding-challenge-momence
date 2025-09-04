import { Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Route>
    </Routes>
  );
}

export default App;
