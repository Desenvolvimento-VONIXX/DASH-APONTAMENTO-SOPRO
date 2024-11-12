import { useState } from "react";
import "./index.css";
import Nav from "./components/Nav/Nav";
import CardOP from "./components/Card/CardOP";
import CardButton from "./components/Card/CardButton";

function App() {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleMachineSelection = (machine) => {
    setSelectedMachine(machine);
  };

  return (
    <>
      {!selectedMachine ? (
        <div className="h-screen flex flex-col justify-center items-center">
          <h1 className="text-2xl font-semibold text-center text-white mb-3">Escolha a máquina que deseja usar</h1>
          <div className="flex space-x-4 p-8">
            <CardButton
              title="Máquina 1"
              onClick={() => handleMachineSelection("1")}
            />
            <CardButton
              title="Máquina 2"
              onClick={() => handleMachineSelection("2")}
            />
          </div>
        </div>

      ) : (
        <div className="h-screen">

          <Nav onSearch={setSearchTerm} />
          <div className="flex justify-center items-center p-8">

            <CardOP
              searchTerm={searchTerm}
              selectedMachine={selectedMachine} 
            />
          </div>

        </div>
      )}
    </>


  );
}

export default App;
