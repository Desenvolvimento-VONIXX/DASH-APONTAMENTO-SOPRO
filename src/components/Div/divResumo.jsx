import { useState, useEffect } from "react";
import { useConsultar } from "../../../hook/useConsultar";

function Resumo({ op, codProdAcabado }) {
    const [consultaResumoApt, setConsultaResumoApt] = useState('');
    const [qntTotal, setQntTotal] = useState(0);
    const [qntSaldoOp, setQntSaldoOp] = useState(0);
    const [qntRealizado, setQntSaldoRealizado] = useState(0);

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

    const { data: dataResumoApt, loading: loadingResumoApt, error: errorResumoApt } = useConsultar(consultaResumoApt);

    useEffect(() => {
        if (dataResumoApt && dataResumoApt.length > 0) {
            const dados = dataResumoApt[0];
 
            setQntTotal(dados.QTD || 0);
            setQntSaldoRealizado(dados.QTD_SUBTRAIR || 0);
            setQntSaldoOp(dados.SALDO_OP || 0);
        }
    }, [dataResumoApt]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setConsultaResumoApt(prev => `${prev} `);
        }, 2000); 

        return () => clearInterval(intervalId);
    }, []);
    
    return (
        <div className="text-[12px] text-white">
            <p>Qnt Total: <span className="font-bold">{qntTotal.toLocaleString('pt-BR')}</span></p>
            <p>Qnt Apontamento: <span className="font-bold">{qntRealizado.toLocaleString('pt-BR')}</span></p>
            <p>Qnt Saldo OP: <span className="font-bold">{qntSaldoOp.toLocaleString('pt-BR')}</span></p>
        </div>
    );
}

export default Resumo;
