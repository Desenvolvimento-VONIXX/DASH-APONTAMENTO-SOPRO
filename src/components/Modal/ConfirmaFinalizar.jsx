import { useState, useEffect } from "react";
import { JX } from "../../lib/JX";
import ModalSuccess from "../Modal/ModalSuccess";
import ModalError from "../Modal/ModalError";
import Snipper from "../Snipper";

function ModalConfirmaFinalizar({ onClose, op, produto, codProdAcabado }) {
    const [isModalSuccess, setIsModalSuccessOpen] = useState(false);
    const [isModalError, setIsModalErrorOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [erro, setErro] = useState('');  // Error message
    const [id, setId] = useState('');

    const getCurrentDate = () => {
        const date = new Date();
        const day = `0${date.getDate()}`.slice(-2);
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const year = date.getFullYear();
        const hours = `0${date.getHours()}`.slice(-2);
        const minutes = `0${date.getMinutes()}`.slice(-2);
        const seconds = `0${date.getSeconds()}`.slice(-2);

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        JX.consultar(`SELECT ID FROM AD_TPRSOPROD WHERE OP = ${op}`)
            .then((dataId) => {
                if (dataId && dataId.length > 0) {
                    const item = dataId[0];
                    setId(item.ID);
                }
            });
    }, [op]);

    const handleSubmit = (e) => {
        setIsLoading(true);
        JX.salvar(
            {
                DHFINAL: getCurrentDate()
            }, "AD_TPRSOPROD",
            [
                {
                    ID: id,
                    OP: op
                }
            ]
        )
            .then(data => {
                console.error('Erro ao Finalizar: ', data);
                setIsLoading(false);
                const response = data[0] || {};  
                if (response.status === "0") {
                    setIsModalErrorOpen(true);
                    setErro(response.statusMessage);  
                } else {
                    setIsModalSuccessOpen(true);
                }
            })
            .catch(function (error) {
                setIsLoading(false);
                console.error('Erro ao Finalizar: ', error);
                setIsModalErrorOpen(true);
                setErro(`Erro técnico: ${error.message || 'Ocorreu um erro desconhecido'}`);
            });
    };

    return (
        <>
            <div id="popup-modal" tabIndex="-1" className="rounded-lg fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden top-0 right-0 left-0 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative rounded-lg shadow bg-[#091225]">
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <h3 className="mb-5 text-lg font-bold text-gray-400">Você tem certeza que deseja Finalizar?</h3>
                            <button data-modal-hide="popup-modal" type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading && <Snipper className="p-5" />}
                                {isLoading ? "Finalizando, Aguarde..." : "Finalizar"}
                            </button>
                            <button type="button" className="py-2.5 px-5 ms-3 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700" onClick={onClose}>Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalSuccess && (
                <ModalSuccess
                    onClose={() => setIsModalSuccessOpen(false)}
                    mensagemSuccess={'Finalizado com Sucesso.'}
                />
            )}

            {isModalError && (
                <ModalError
                    onClose={() => setIsModalErrorOpen(false)}
                    mensagemError={erro}  // Exibe a mensagem de erro diretamente aqui
                />
            )}
        </>
    );
}

export default ModalConfirmaFinalizar;
