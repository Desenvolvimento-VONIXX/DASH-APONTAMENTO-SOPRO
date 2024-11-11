import React from "react";

function TablePrducaoLinhas() {
    return (
        <div className="">
            <table className="w-full text-sm text-left text-gray-400 rounded-lg shadow-lg overflow-hidden">
                <thead className="text-xs uppercase bg-[#2C2C54] text-white">
                    <tr>
                        <th scope="col" className="px-6 py-3"></th>
                        <th scope="col" className="px-6 py-3">Turno (%)</th>
                        <th scope="col" className="px-6 py-3">Hora (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { linha: "Linha 1", turno: 60, hora: 21 },
                        { linha: "Linha 2", turno: 46, hora: 80 },
                        { linha: "Linha 3", turno: 45, hora: 56 },
                        { linha: "Linha 4", turno: 87, hora: 46 },
                    ].map((row, index) => (
                        <tr key={index} className={`bg-gray-800 }`}>
                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                                {row.linha}
                            </th>
                            <td className="px-6 py-4">{row.turno}</td>
                            <td className="px-6 py-4">{row.hora}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablePrducaoLinhas;
