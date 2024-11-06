import { useState } from "react";
import { useConsultar } from "../../../hook/useConsultar";
import Snipper from "../Snipper";
import Cronometro from "../Buttons/Cronometro";
import CronometroOp from "../Buttons/CronometroOP";
import ModalApontamento from "./ModalApontamento";
import ModalConfirmaIniciar from "./ConfirmaIniciar";
import ModalConfirmaFinalizar from "./ConfirmaFinalizar";
import TablePrducaoLinhas from "../Table/TableLinhas";

function ModalCronometro({ onClose, op, produto, codProdAcabado }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalIniciar, setShowModalIniciar] = useState(false);
    const [showModalFinalizar, setShowModalFinalizar] = useState(false);


    const handleCardClickModalApontamento = () => {
        setShowModal(true);
    };

    const handleCardClickModalConfirmaIniciar = () => {
        setShowModalIniciar(true);
    };

    const handleCardClickModalConfirmaFinalizar = () => {
        setShowModalFinalizar(true);
    };


    return (
        <>
            <div className="fixed inset-0 bg-[#091225]  opacity-100 z-40 " />
            <div
                id="static-modal"
                data-modal-backdrop="static"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed inset-0 z-50 flex justify-center items-center w-full h-full "
            >
                <div className="relative w-full h-full max-w-full max-h-full">
                    <div className="relative w-full h-full bg-gray-700 rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600 ">
                            <h3 className="text-xl font-semibold text-white">
                                OP - {op}
                            </h3>

                            <div className="flex space-x-1">
                                <button type="button" className="border focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
                                    onClick={handleCardClickModalConfirmaIniciar}
                                >
                                    Iniciar
                                </button>
                                <button type="button" className="border focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
                                    onClick={handleCardClickModalApontamento}
                                >Apontar</button>
                                <button type="button" className="border focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700"
                                    onClick={handleCardClickModalConfirmaFinalizar}

                                >Finalizar</button>
                            </div>
                        </div>


                        <div className="p-3  space-y-6">
                            <div className="flex sm-p-[6px] md-p-[6px] space-x-6 justify-center">
                                <Cronometro op={op} codProdAcabado={codProdAcabado} />
                                <CronometroOp op={op} codProdAcabado={codProdAcabado} />
                            </div>

                            <div className="relative overflow-x-auto">
                                <TablePrducaoLinhas />
                            </div>
                        </div>



                        <div className="flex items-center rounded-b border-gray-600 justify-center">
                            <button
                                type="button"
                                className="py-2.5 px-5 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
                                onClick={onClose}
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <ModalApontamento
                    onClose={() => setShowModal(false)}
                    op={op}
                    produto={produto}
                    codProdAcabado={codProdAcabado}
                />
            )}

            {showModalIniciar && (
                <ModalConfirmaIniciar
                    onClose={() => setShowModalIniciar(false)}
                    op={op}
                    produto={produto}
                    codProdAcabado={codProdAcabado}
                />
            )}

            {showModalFinalizar && (
                <ModalConfirmaFinalizar
                    onClose={() => setShowModalFinalizar(false)}
                    op={op}
                    produto={produto}
                    codProdAcabado={codProdAcabado}
                />
            )}
        </>
    );
}

export default ModalCronometro;
