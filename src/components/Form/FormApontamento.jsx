import { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { JX } from "../../lib/JX";
import ModalSuccess from "../Modal/ModalSuccess";
import ModalError from "../Modal/ModalError";
import Snipper from "../Snipper";

function FormApontamento({ produto, op, codProd, codUsu, onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [isLastEntry, setIsLastEntry] = useState(false);
    const [erro, setErro] = useState('');
    const [isModalSuccess, setIsModalSuccessOpen] = useState(false);
    const [isModalError, setIsModalErrorOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getCurrentDate = () => { 
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quantity === 0 || quantity < 0) {
            setErro("Digite uma quantidade válida!")
            setIsModalErrorOpen(true);
            return;
        }

        setIsLoading(true);

        JX.salvar(
            { 
                IDIPROC: op,
                QTD: quantity,
                CODUSU: codUsu,
                DTAPONTAMENTO: getCurrentDate(),
                ULTIMO: 'N',
                CODPROD: codProd
            },
            "AD_APONTAMENTOSOPRO",
            []
        ).then(data => {
            setIsLoading(false);
            if (data.status === "0") {
                setIsModalErrorOpen(true);
                setErro(data.statusMessage);
            } else {
                setQuantity(0);
                setIsModalSuccessOpen(true);
                if (onSuccess) onSuccess();
            }
        })
            .catch(function (error) {
                setIsLoading(false);
                setIsModalErrorOpen(true);
                console.error('Erro ao apontar: ', error);
            });
    };

    return (
        <>
            <form className="flex items-center" onSubmit={handleSubmit}>
                <div className="flex items-center">
                    <div className="ml-4 w-6/2">
                        <label htmlFor="quantity" className="mb-2 text-sm font-medium text-white">Quantidade:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            required
                            onChange={(e) => setQuantity(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 w-full h-full"
                        />
                    </div>
                </div>
            </form>

            <div className="p-3 ml-1">
                <button
                    type="button"
                    className={`mt-1 px-3 py-2 text-[13px] font-medium inline-flex items-center text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading && <Snipper className="p-10" />} 
                    {isLoading ? "APONTANDO, AGUARDE..." : "APONTAR"} 
                </button>
            </div>


            {isModalSuccess && (
                <ModalSuccess
                onCloseSuccess={() => setIsModalSuccessOpen(false)}
                    mensagemSuccess={'Apontamento Realizado.'}
                />
            )}

            {isModalError && (
                <ModalError
                    onClose={() => setIsModalErrorOpen(false)}
                    mensagemError={erro}
                />
            )}
        </>
    );
}

export default FormApontamento;
