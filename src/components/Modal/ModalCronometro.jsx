import { useState, useEffect } from "react";
import { useConsultar } from "../../../hook/useConsultar";
import Snipper from "../Snipper";
import Cronometro from "../Buttons/Cronometro";
import CronometroOp from "../Buttons/CronometroOP";
import ModalApontamento from "./ModalApontamento";
import ModalConfirmaIniciar from "./ConfirmaIniciar";
import ModalConfirmaFinalizar from "./ConfirmaFinalizar";
import TablePrducaoLinhas from "../Table/TableLinhas";
import { JX } from "../../lib/JX";

function ModalCronometro({ onClose, op, produto, codProdAcabado }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalIniciar, setShowModalIniciar] = useState(false);
    const [showModalFinalizar, setShowModalFinalizar] = useState(false);
    const [codUsuLog, setCodUsuLog] = useState('');

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

    const handleCardClickModalApontamento = () => {
        setShowModal(true);
    };

    const handleCardClickModalConfirmaIniciar = () => {
        setShowModalIniciar(true);
    };


    const handleCardClickModalConfirmaFinalizar = () => {
        setShowModalFinalizar(true);
    };


    useEffect(() => {
        console.log("codusu", codUsuLog)
    }, [codUsuLog])



    return (
        <>

            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                <div className="w-full h-full bg-gray-700 rounded-lg shadow p-4 md:p-5 overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-gray-600 pb-4">
                        <h3 className="text-xl font-semibold text-white">OP - {op}</h3>
                        <div className="flex space-x-1">
                            <button
                                type="button"
                                className="border font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                                onClick={handleCardClickModalConfirmaIniciar}
                            >
                                Iniciar
                            </button>
                            <button
                                type="button"
                                className="border font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                                onClick={handleCardClickModalApontamento}
                            >
                                Apontar
                            </button>
                            <button
                                type="button"
                                className="border font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                                onClick={handleCardClickModalConfirmaFinalizar}
                            >
                                Finalizar
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-center">
                            <Cronometro op={op} codProdAcabado={codProdAcabado} />
                            <CronometroOp op={op} codProdAcabado={codProdAcabado} />
                        </div>
                        {/* <div className="relative overflow-x-auto">
                            <TablePrducaoLinhas />
                        </div> */}
                    </div>

                    <div className="flex items-center justify-center  pt-4">
                        <button
                            type="button"
                            className="py-2.5 px-5 text-sm font-medium rounded-lg border bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
                            onClick={onClose}
                        >
                            Voltar
                        </button>
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
                    codUsuLog={codUsuLog}
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
