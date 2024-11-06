import { useState } from "react";
import "./index.css";
import Nav from "./components/Nav/Nav";
import CardOP from "./components/Card/CardOP";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="h-screen">
      <Nav onSearch={setSearchTerm} />
      <div className="flex justify-center items-center p-8">
        <CardOP searchTerm={searchTerm} />
      </div>
    </div>
  );
}

export default App;
