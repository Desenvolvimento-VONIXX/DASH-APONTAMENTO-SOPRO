import { useState, useEffect } from "react";
import Snipper from "../Snipper";
import { JX } from "../../lib/JX";

function ModalConfirmaIniciar({ onClose, op, produto, codProdAcabado }) {
    const [codUsuLog, setCodUsuLog] = useState('')

    useEffect(() => {
        const fetchUserCode = async () => {
            try {
                const result = await JX.consultar(`SELECT CODUSU FROM SANKHYA.TSIUSU USU WHERE USU.CODUSU = SANKHYA.STP_GET_CODUSULOGADO()`);
                if (result && result.length > 0) {
                    const item = result[0];

                    setCodUsuLog(item.CODUSU);

                }
            } catch (error) {
                console.error("Erro ao consultar o código do usuário:", error);
            }
        };

        fetchUserCode();
    }, []);


    return (
        <>
            <div id="popup-modal" tabindex="-1" className="rounded-lg fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden top-0 right-0 left-0 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <div class="relative rounded-lg shadow bg-[#091225] ">
                     
                        <div class="p-4 md:p-5 text-center">
                            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <h3 class="mb-5 text-lg font-bold text-gray-400">Você tem certeza que deseja Iniciar?</h3>
                            <button data-modal-hide="popup-modal" type="button" class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                Iniciar
                            </button>
                            <button data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium focus:outline-none  rounded-lg border  focus:z-10 focus:ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 dark:hover:text-white hover:bg-gray-700" onClick={onClose}>Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ModalConfirmaIniciar;