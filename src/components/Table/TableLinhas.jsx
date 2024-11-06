import React, { useState, useEffect } from "react";
import { useConsultar } from "../../../hook/useConsultar";


function TablePrducaoLinhas() {

    return (
        <div style={{ margin: '1px' }}>
            <table class="w-full text-sm text-left rtl:text-right  text-gray-400 ">
                <thead class="text-xs uppercase  bg-gray-700 text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">

                        </th>
                        <th scope="col" class="px-6 py-3">

                        </th>
                        <th scope="col" class="px-6 py-3">
                            Turno (%)
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Hora (%)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap text-white">
                            Linha 1
                        </th>
                        <td class="px-6 py-4">

                        </td>
                        <td class="px-6 py-4">
                            60
                        </td>
                        <td class="px-6 py-4">
                            21
                        </td>
                    </tr>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap text-white">
                            Linha 2
                        </th>
                        <td class="px-6 py-4">

                        </td>
                        <td class="px-6 py-4">
                            46
                        </td>
                        <td class="px-6 py-4">
                            80
                        </td>
                    </tr>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap text-white">
                            Linha 3
                        </th>
                        <td class="px-6 py-4">

                        </td>
                        <td class="px-6 py-4">
                            45
                        </td>
                        <td class="px-6 py-4">
                            56
                        </td>
                    </tr>
                    <tr class="border-b bg-gray-800 border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium  whitespace-nowrap text-white">
                            Linha 4
                        </th>
                        <td class="px-6 py-4">

                        </td>
                        <td class="px-6 py-4">
                            87
                        </td>
                        <td class="px-6 py-4">
                            46
                        </td>
                    </tr>



                </tbody>
            </table>
        </div>
    )

}

export default TablePrducaoLinhas;
