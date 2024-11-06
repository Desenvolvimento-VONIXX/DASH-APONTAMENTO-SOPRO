import { useState, useEffect } from "react";
import { useConsultar } from "../../../hook/useConsultar";
import Snipper from "../Snipper";
import FormApontamento from "../Form/FormApontamento";
import { JX } from "../../lib/JX";

function ModalApontamento({ onClose, op, produto, codProdAcabado }) {
    const [resultApontamentos, setResultApontamentos] = useState([]);
    const [consultaApontamentos, setConsultaApontamentos] = useState('');
    const [consultaResumoApt, setConsultaResumoApt] = useState('');
    const [qntTotal, setQntTotal] = useState(0);
    const [qntSaldoOp, setQntSaldoOp] = useState(0);
    const [qntRealizado, setQntSaldoRealizado] = useState(0);
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


    useEffect(() => {
        const novaConsulta = `
            SELECT 
            IPROC.IDIPROC AS IDIPROC,
            FORMAT(NOTA.DTNEG, 'dd/MM/yyyy') AS DATA_APONTAMENTO,
            NOTA.QTDNEG AS QTD_APONTADA,
            PRO.DESCRPROD AS NOMEPROD
            FROM TPRIPROC IPROC
            INNER JOIN TPRIPA IPA ON IPA.IDIPROC = IPROC.IDIPROC
            INNER JOIN TGFPRO PRO ON PRO.CODPROD = IPA.CODPRODPA
            LEFT JOIN (
                SELECT IDIPROC, ITE.QTDNEG, ITE.CODPROD, ITE.CONTROLE, CAB.DTNEG
                FROM TGFCAB CAB 
                INNER JOIN TGFITE ITE ON ITE.NUNOTA = CAB.NUNOTA
                INNER JOIN TPRROPE ROPE ON ROPE.NUNOTA = CAB.NUNOTA
                INNER JOIN TPROEST OEST ON OEST.IDEFX = ROPE.IDEFX AND OEST.SEQOPER = ROPE.SEQOPER
                WHERE CAB.IDIPROC IS NOT NULL 
                AND OEST.TIPOITENS = 'PA'
                AND OEST.QUANDO = 'PA'
                AND CAB.TIPMOV = 'F'
                AND ITE.USOPROD = 'V'
            ) NOTA ON NOTA.IDIPROC = IPROC.IDIPROC 
                AND NOTA.CODPROD = IPA.CODPRODPA
                AND (ISNULL(NOTA.CONTROLE, ' ') = ' ' 
                    OR PRO.TIPCONTEST = 'L' 
                    OR ISNULL(NOTA.CONTROLE, ' ') = ISNULL(IPA.CONTROLEPA, ' '))
            WHERE 
            IPA.CODPRODPA = ${codProdAcabado}
            AND IPROC.IDIPROC = ${op}
            ORDER BY NOTA.DTNEG ASC

        `;
        setConsultaApontamentos(novaConsulta);
    }, [op, codProdAcabado]);

    useEffect(() => {
        const novaConsulta = `
            SELECT 
            ISNULL(SUM(X.TAMLOTE), 0) AS QTD,
            ISNULL(SUM(X.TAMLOTE), 0) - ISNULL(SUM(QTD_NOTA), 0) - ISNULL(SUM(QTD_PERDA), 0) AS SALDO_OP,
            ISNULL(SUM(QTD_RESERVADA), 0) AS QTD_RESERVADA,
            ISNULL(SUM(QTD_SUBTRAIR), 0) AS QTD_SUBTRAIR
            FROM (
            SELECT IPROC.IDIPROC,
            MAX(IPA.QTDPRODUZIR) AS TAMLOTE,
            ISNULL(SUM(NOTA.QTDNEG), 0) AS QTD_NOTA,
            (CASE
            WHEN ISNULL(SUM(NOTA.QTDNEG), 0) > 0 THEN APO_PERDA.QTDPERDA
            ELSE 0
            END) AS QTD_PERDA,
            (CASE
            WHEN ISNULL(SUM(NOTA.QTDNEG), 0) > ISNULL(MAX(IDEP.QTDDEP), 0) THEN ISNULL(SUM(NOTA.QTDNEG), 0)
            ELSE ISNULL(MAX(IDEP.QTDDEP), 0)
            END) AS QTD_SUBTRAIR,
            ISNULL(MAX(IDEP.QTDDEP), 0) AS QTD_RESERVADA
            FROM
            TPRIPA IPA
            INNER JOIN TPRIPROC IPROC ON (IPA.IDIPROC = IPROC.IDIPROC)
            INNER JOIN TGFPRO PRO ON (PRO.CODPROD = IPA.CODPRODPA)
            LEFT JOIN (
            SELECT IDIPROC, ITE.QTDNEG, ITE.CODPROD, ITE.CONTROLE 
            FROM TGFCAB CAB 
            INNER JOIN TGFITE ITE ON (ITE.NUNOTA = CAB.NUNOTA)
            INNER JOIN TPRROPE ROPE ON (ROPE.NUNOTA = CAB.NUNOTA)
            INNER JOIN TPROEST OEST ON (OEST.IDEFX = ROPE.IDEFX AND OEST.SEQOPER = ROPE.SEQOPER)
            WHERE CAB.IDIPROC IS NOT NULL 
            AND OEST.TIPOITENS = 'PA'
            AND OEST.QUANDO = 'PA'
            AND CAB.TIPMOV = 'F'
            AND ITE.USOPROD = 'V'
            ) NOTA ON (NOTA.IDIPROC = IPROC.IDIPROC AND NOTA.CODPROD = IPA.CODPRODPA AND (ISNULL(NOTA.CONTROLE, ' ') = ' ' OR (PRO.TIPCONTEST = 'L' OR ISNULL(NOTA.CONTROLE, ' ') = ISNULL(IPA.CONTROLEPA, ' '))))
            LEFT JOIN (
            SELECT ISNULL(SUM(APA.QTDPERDA), 0) AS QTDPERDA, IATV.IDIPROC, APA.CODPRODPA, APA.CONTROLEPA
            FROM TPRAPA APA
            INNER JOIN TPRAPO APO ON (APO.NUAPO = APA.NUAPO)
            INNER JOIN TPRIATV IATV ON (IATV.IDIATV = APO.IDIATV)
            WHERE APO.SITUACAO = 'C'
            AND APA.QTDPERDA > 0
            GROUP BY IATV.IDIPROC, APA.CODPRODPA, APA.CONTROLEPA
            ) APO_PERDA ON (APO_PERDA.IDIPROC = IPROC.IDIPROC AND APO_PERDA.CODPRODPA = IPA.CODPRODPA AND (ISNULL(APO_PERDA.CONTROLEPA, ' ') = ' ' OR (PRO.TIPCONTEST = 'L' OR ISNULL(APO_PERDA.CONTROLEPA, ' ') = ISNULL(IPA.CONTROLEPA, ' '))))
            LEFT JOIN (
            SELECT IDIPROCPI, SUM(QTDDEP) AS QTDDEP FROM TPRIDEP
            GROUP BY IDIPROCPI
            ) IDEP ON IPROC.IDIPROC = IDEP.IDIPROCPI
            WHERE 
            IPA.CODPRODPA = ${codProdAcabado}
            AND (PRO.TIPCONTEST = 'L' OR ISNULL(IPA.CONTROLEPA, ' ') = '')
            AND IPROC.STATUSPROC IN ('A', 'R', 'P2', 'S', 'S2')
            AND IPROC.IDIPROC = ${op}
            GROUP BY IPROC.IDIPROC, APO_PERDA.QTDPERDA
            ) X

        `;
        setConsultaResumoApt(novaConsulta);
    }, [op, codProdAcabado]);


    const { data: dataApontamentos, loading: loadingApontamentos, error: errorApontamentos } = useConsultar(consultaApontamentos);
    const { data: dataResumoApt, loading: loadingResumoApt, error: errorResumoApt } = useConsultar(consultaResumoApt);


    useEffect(() => {
        if (dataApontamentos && dataApontamentos.length > 0) {
            const formattedData = dataApontamentos.map(item => ({
                nroOp: item.IDIPROC,
                dataApontamento: item.DATA_APONTAMENTO,
                codProd: item.CODPROD,
                nomeProd: item.NOMEPROD,
                qntApontada: item.QTD_APONTADA
            }));
            setResultApontamentos(formattedData);
        } else {
            setResultApontamentos([]);
        }
    }, [dataApontamentos]);

    useEffect(() => {
        console.log(dataResumoApt);

        if (dataResumoApt && dataResumoApt.length > 0) {
            const dados = dataResumoApt[0];

            setQntTotal(dados.QTD || 0);
            setQntSaldoRealizado(dados.QTD_SUBTRAIR || 0);
            setQntSaldoOp(dados.SALDO_OP || 0);
        }
    }, [dataResumoApt]);

    const codProd = resultApontamentos.length > 0 ? resultApontamentos[0].codProd : '';




    return (
        <>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-30 z-40" />
            <div
                id="static-modal"
                data-modal-backdrop="static"
                tabIndex="-1"
                aria-hidden="true"
                className="overflow-y-auto flex overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
                <div className="relative p-3 w-full max-w-2xl max-h-full">
                    <div className="relative rounded-lg shadow bg-gray-800">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600">
                            <h3 className="text-xl font-semibold text-white">
                                Apontamentos (OP - {op})
                            </h3>
                            <button
                                onClick={onClose}
                                type="button"
                                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                                data-modal-hide="static-modal"
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-3 md:p-5 flex items-center justify-between">
                            <p className="text-base leading-relaxed font-bold text-gray-400">
                                Produto: <span className="text-white">{produto}</span>
                            </p>

                        </div>

                        <div className="w-full">
                            <FormApontamento produto={produto} op={op} codProd={codProdAcabado} codUsu={codUsuLog}/>
                        </div>

                        <div className="p-3">
                            {loadingApontamentos ? (
                                <div className="flex justify-center py-4">
                                    <Snipper />
                                </div>
                            ) : resultApontamentos.length > 0 ? (
                                <div>
                                    <div className="flex space-x-4 justify-between">
                                        <h1 className="text-white font-bold mb-2">Apontamentos Realizados:</h1>
                                        <div className="text-[13px] text-white">
                                            <h1>Resumo:</h1>
                                            <p>Qnt Total: <span className="font-bold">{qntTotal.toLocaleString('pt-BR')}</span></p>
                                            <p>Qnt Apontamento: <span className="font-bold">{qntRealizado.toLocaleString('pt-BR')}</span></p>
                                            <p>Qnt Saldo OP: <span className="font-bold">{qntSaldoOp.toLocaleString('pt-BR')}</span></p>
                                        </div>

                                    </div>
                                    <div className="relative overflow-x-auto shadow-md rounded-lg p-4">
                                        <ol className="items-center sm:flex">
                                            {resultApontamentos
                                                .filter(item => item.qntApontada && item.qntApontada > 0)
                                                .map((item, index) => (
                                                    <li className="relative mb-6 sm:mb-0 min-w-[40%]" key={index}>
                                                        <div className="flex items-center">
                                                            <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white">
                                                                <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                                                </svg>
                                                            </div>
                                                            <div className="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
                                                        </div>
                                                        <div className="mt-3 sm:pe-8">
                                                            <h3 className="text-lg font-semibold text-white">
                                                                Qnt Apontada: <span className="text-blue-300 font-bold">{item.qntApontada}</span>
                                                            </h3>
                                                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 ">{item.dataApontamento}</time>
                                                        </div>
                                                    </li>
                                                ))}
                                        </ol>
                                        {resultApontamentos.filter(item => item.qntApontada && item.qntApontada > 0).length === 0 && (
                                            <div className="text-center text-gray-400 p-2">Sem Registros de Apontamento</div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h1 className="text-white font-bold mb-2">Apontamentos Realizados:</h1>
                                    <p className="text-center text-gray-400 p-2">Sem Registros de Apontamento</p>
                                </div>
                            )}
                        </div>




                        <div className="flex items-center p-4 md:p-5 border-t rounded-b border-gray-600">
                            <button
                                data-modal-hide="static-modal"
                                type="button"
                                className="py-2.5 px-5 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700"
                                onClick={onClose}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalApontamento;
