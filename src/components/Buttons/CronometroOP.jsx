import React, { useState, useEffect } from "react";
import { useConsultar } from "../../../hook/useConsultar";

function CronometroOp({ title, op, codProdAcabado }) {
    const [timeOp, setTimeOp] = useState(0);
    const [timeAtv, setTimeAtv] = useState(0);
    const [consultaPeriodoOp, setConsultaPeriodoOp] = useState('');
    const [consultaPeriodoAtv, setConsultaPeriodoAtv] = useState('');
    const [dataInicioOp, setDataInicioOp] = useState('');
    const [dataFimOp, setDataFimOp] = useState('');
    const [dataInicioAtv, setDataInicioAtv] = useState('');
    const [dataFimAtv, setDataFimAtv] = useState('');

    useEffect(() => {
        const novaConsulta = `
            SELECT
            FORMAT(OPE.DHINST, 'yyyy-MM-ddTHH:mm:ss') AS DATA_INICIO,
            FORMAT(OPE.DHTERMINO, 'yyyy-MM-ddTHH:mm:ss') AS DATA_FIM
            FROM TPRIPROC OPE
            JOIN TPRIPA IPA ON IPA.IDIPROC = OPE.IDIPROC
            WHERE 
            IPA.CODPRODPA = ${codProdAcabado}
            AND OPE.IDIPROC = ${op}
        `;
        setConsultaPeriodoOp(novaConsulta);
    }, [op, codProdAcabado]);

    useEffect(() => {
        const novaConsulta = `
            SELECT
            FORMAT(IATV.DHINICIO, 'yyyy-MM-ddTHH:mm:ss') AS DATA_INICIO_ATV,
            FORMAT(IATV.DHFINAL, 'yyyy-MM-ddTHH:mm:ss') AS DATA_FIM_ATV
            FROM TPRIATV IATV 
            JOIN TPREFX EFX ON EFX.IDEFX = IATV.IDEFX 
            JOIN TPRIPROC OPE ON OPE.IDIPROC = IATV.IDIPROC   
            JOIN TPRIPA IPA ON IPA.IDIPROC=IATV.IDIPROC
            JOIN TGFPRO PRO ON PRO.CODPROD = IPA.CODPRODPA
            WHERE 
            OPE.IDIPROC = ${op}
            AND IPA.CODPRODPA = ${codProdAcabado}
            AND OPE.STATUSPROC NOT IN ('S','F','C')
            AND IPA.CODPRODPA IN (4105192,3001016,3001015)
            AND EFX.DESCRICAO = 'FINALIZAÇÃO'
        `;
        setConsultaPeriodoAtv(novaConsulta);
    }, [op, codProdAcabado]);

    const { data: dataOp, loading: loadingOp, error: errorOp } = useConsultar(consultaPeriodoOp);
    const { data: dataAtv, loading: loadingAtv, error: errorAtv } = useConsultar(consultaPeriodoAtv);

    useEffect(() => {
        if (dataOp && dataOp.length > 0) {
            const item = dataOp[0];
            setDataInicioOp(item.DATA_INICIO);
            setDataFimOp(item.DATA_FIM);
        }
    }, [dataOp]);

    useEffect(() => {
        console.log(dataAtv);
        if (dataAtv && dataAtv.length > 0) {
            const item = dataAtv[0];
            if (item.DATA_INICIO_ATV === null && item.DATA_FIM_ATV === null) {
                setDataInicioAtv("A iniciar");
                setDataFimAtv("");
            } else {
                setDataInicioAtv(item.DATA_INICIO_ATV);
                setDataFimAtv(item.DATA_FIM_ATV);
            }
        }
    }, [dataAtv]);


    useEffect(() => {
        if (dataInicioOp) {
            const startTime = new Date(dataInicioOp).getTime();
            const interval = setInterval(() => {
                const currentTime = Date.now();
                const elapsedTime = Math.floor((currentTime - startTime) / 1000);

                setTimeOp(elapsedTime);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [dataInicioOp]);

    useEffect(() => {
        if (dataInicioAtv && dataInicioAtv !== "A iniciar") {
            const startTime = new Date(dataInicioAtv).getTime();
            const interval = setInterval(() => {
                const currentTime = Date.now();
                const elapsedTime = Math.floor((currentTime - startTime) / 1000);
                setTimeAtv(elapsedTime);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setTimeAtv(0); 
        }
    }, [dataInicioAtv]);


    const formatTime = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${String(days).padStart(2, '0')}d:${String(hours).padStart(2, '0')}h:${String(minutes).padStart(2, '0')}m:${String(secs).padStart(2, '0')}s`;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setConsultaPeriodoAtv(prev => `${prev} `);
            setConsultaPeriodoOp(prev => `${prev} `);
        }, 2000); 

        return () => clearInterval(intervalId);
    }, []);



    return (
        <>
            <div className="flex flex-col gap-[2px] items-center p-6 bg-[#2C2C54] rounded-3xl shadow-lg w-full mx-auto" style={{ margin: '10px' }}>
                <div className="flex items-center justify-center w-full sm-text-[15px] md-text-[15px] lg:text-2xl xl:text-2xl 2xl:text-2xl font-mono font-bold text-white tracking-widest bg-black bg-opacity-30 px-4 py-2 rounded-lg">
                    {formatTime(timeOp)}
                </div>
                <h2 className="text-sm font-semibold text-white">Tempo Total OP</h2>
                <p className="text-sm text-gray-300">Início: {dataInicioOp ? new Date(dataInicioOp).toLocaleString() : 'Carregando...'}</p>
            </div>
            <div className="flex flex-col gap-[2px] items-center p-6 bg-[#2C2C54] rounded-3xl shadow-lg w-full mx-auto" style={{ margin: '10px' }}>
                <div className="flex items-center justify-center w-full sm-text-[15px] md-text-[15px] lg:text-2xl xl:text-2xl 2xl:text-2xlfont-mono font-bold text-white tracking-widest bg-black bg-opacity-30 px-4 py-2 rounded-lg">
                    {formatTime(timeAtv)}
                </div>
                <h2 className="text-sm font-semibold text-white">Tempo Total Atividade</h2>
                <p className="text-sm text-gray-300">Início: {dataInicioAtv ? (dataInicioAtv === "A iniciar" ? "A iniciar" : new Date(dataInicioAtv).toLocaleString()) : 'Carregando...'}</p>
            </div>
        </>
    );
}

export default CronometroOp;
