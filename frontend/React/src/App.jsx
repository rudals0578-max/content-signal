import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Business from "./pages/Business";
import Creative from "./pages/Creative";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/business" element={<Business />} />
        <Route path="/creative" element={<Creative />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
