import { useState, useEffect } from "react";
import ModalApontamento from "../Modal/ModalApontamento";
import PlayPause from "../Buttons/PlayPause";
import { useConsultar } from "../../../hook/useConsultar";
import Snipper from "../Snipper";
import ModalCronometro from "../Modal/ModalCronometro";

function CardOP({ searchTerm }) {
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [consulta, setConsulta] = useState('');
    const [result, setResult] = useState([]);
    const [selectedOP, setSelectedOP] = useState(null);
    const [produto, setProduto] = useState('');
    const [codProdAcabado, setCodProdutoAcabado] = useState(null);

    useEffect(() => {
        const novaConsulta = ` 
            SELECT  
            OPE.IDIPROC AS OP,
            FORMAT(OPE.DHINST, 'dd/MM/yyyy HH:mm') AS DATA_INICIO_FORMATADA,
            IPA.CODPRODPA,
            PRO.DESCRPROD AS NOME_PRODUTO,
            CODEXEC,
            IATV.*,
            EFX.* 
            FROM TPRIATV IATV 
            JOIN TPREFX EFX ON EFX.IDEFX = IATV.IDEFX 
            JOIN TPRIPROC OPE ON OPE.IDIPROC = IATV.IDIPROC   
            JOIN TPRIPA IPA ON IPA.IDIPROC=IATV.IDIPROC
            JOIN TGFPRO PRO ON PRO.CODPROD = IPA.CODPRODPA
            WHERE
            IATV.DHFINAL IS NULL
            AND OPE.STATUSPROC NOT IN ('S','F','C')
            AND IPA.CODPRODPA IN (4105192,3001016,3001015)
            AND EFX.DESCRICAO = 'FINALIZAÇÃO'
            ORDER BY DHINICIO DESC
        `;
        setConsulta(novaConsulta);
    }, []);

    const { data, loading, error } = useConsultar(consulta);

    useEffect(() => {
        if (data && data.length > 0) {
            const formattedData = data.map(item => ({
                op: item.OP,
                dataInicio: item.DATA_INICIO_FORMATADA,
                nomePro: item.NOME_PRODUTO,
                codProdAcabado: item.CODPRODPA
            }));
            setResult(formattedData);
        } else {
            setResult([]);
        }
    }, [data]);

    const filteredResults = result.filter(item => 
        item.op.toString().includes(searchTerm)
    );

    const handleCardClickModal1 = (op, nomePro, codProdAcabado) => {
        setSelectedOP(op);
        setProduto(nomePro);
        setCodProdutoAcabado(codProdAcabado);
        setShowModal1(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 mb-10 w-full">
                {loading ? (
                    <div className="flex justify-center items-center col-span-full">
                        <Snipper />
                    </div>
                ) : (
                    filteredResults.map((item, index) => (
                        <div key={index} className="relative w-full bg-[#2C2C54] rounded-lg shadow-lg hover:bg-[#3A3A6D] transition-all duration-300 transform hover:scale-105">
                            <div className="absolute left-0 top-0 h-full w-2 bg-[#aba6f1] rounded-l-lg"></div>
                            <div className="p-6" onClick={() => handleCardClickModal1(item.op, item.nomePro, item.codProdAcabado)}>
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="text-[20px] font-bold text-[#D6D6F8]">OP: <span> {item.op} </span></h1>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm text-[#D6D6F8] opacity-70">
                                        <span className="font-semibold">Data de Inicio:</span><br />
                                        {item.dataInicio}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm text-[#D6D6F8] opacity-70">
                                        <span className="font-semibold">Produto: </span><br />
                                        {item.nomePro}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal1 && (
                <ModalCronometro
                    onClose={() => setShowModal1(false)}
                    op={selectedOP}
                    produto={produto}
                    codProdAcabado={codProdAcabado}
                />
            )}
        </>
    );
}

export default CardOP;
