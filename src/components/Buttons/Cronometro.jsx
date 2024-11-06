import React, { useState, useEffect } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { JX } from "../../lib/JX";

function Cronometro({ op }) {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [idUpdateDhfim, setIdUpdateDhFim] = useState('');
    const [intervalId, setIntervalId] = useState(null);
    const [dataIni, setDataIni] = useState('');
    const [totalTempo, setTotalTempo] = useState(0);

    useEffect(() => {
        const fetchExistingRecord = async () => {
            const consulta = `SELECT ID AS ID_TIME, DHINI FROM AD_TIMEOP WHERE IDIPROC = ${op} AND (DHFIM IS NULL OR DHFIM = '')`;
            try {
                const dataTime = await JX.consultar(consulta);
                if (dataTime && dataTime.length > 0) {
                    setIdUpdateDhFim(dataTime[0].ID_TIME);
                    const dhini = dataTime[0].DHINI;
                    setDataIni(formatDateTimeIni(dhini));
                    if (!isActive) {
                        setIsActive(true);
                    }
                }
            } catch (err) {
                console.error("Erro ao consultar registro existente:", err);
            }
        };

        fetchExistingRecord();
    }, [op]);

    useEffect(() => {
        const fetchTotalTime = async () => {
            const consulta = `SELECT SUM(DATEDIFF(SECOND, DHINI, DHFIM)) AS TotalTimeInSeconds FROM AD_TIMEOP WHERE IDIPROC = ${op} AND DHFIM IS NOT NULL`;
            try {
                const totalTime = await JX.consultar(consulta);
                if (totalTime && totalTime.length > 0) {
                    const total = totalTime[0].TotalTimeInSeconds || 0;
                    setTotalTempo(total);
                }
            } catch (err) {
                console.error("Erro ao consultar registro existente:", err);
            }
        };

        fetchTotalTime();
    }, [op]);

    useEffect(() => {
        if (dataIni) {
            const startTime = new Date(dataIni).getTime();
            const interval = setInterval(() => {
                const currentTime = Date.now();
                const elapsedTime = Math.floor((currentTime - startTime) / 1000) + totalTempo;
                setTime(elapsedTime);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [dataIni, totalTempo]);

    useEffect(() => {
        if (isActive) {
            const id = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
            setIntervalId(id);
        } else if (!isActive && intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isActive]);

    const handleStart = () => {
        const formattedStartTime = formatDateTime(new Date());
        setTime(totalTempo);

        JX.salvar(
            {
                IDIPROC: op,
                DHINI: formattedStartTime,
            },
            "AD_TIMEOP",
            []
        )
            .then(() => {
                const novaConsulta = `SELECT ID AS ID_TIME, DHINI FROM AD_TIMEOP WHERE IDIPROC = ${op} AND (DHFIM IS NULL OR DHFIM = '')`;
                JX.consultar(novaConsulta)
                    .then((dataTime) => {
                        if (dataTime && dataTime.length > 0) {
                            const item = dataTime[0];
                            setIdUpdateDhFim(item.ID_TIME);
                            setDataIni(formatDateTimeIni(item.DHINI));
                        }
                    });
            })
            .catch(err => console.error("Erro ao salvar registro:", err));
    };

    const handlePause = () => {
        const formattedPauseTime = formatDateTime(new Date());

        if (idUpdateDhfim) {
            JX.salvar(
                {
                    DHFIM: formattedPauseTime,
                }, "AD_TIMEOP",
                [
                    {
                        ID: idUpdateDhfim
                    }
                ]
            )
                .then(() => {
                    setIdUpdateDhFim('');
                    setDataIni('');
                    setIsActive(false);
                });
        } else {
            console.log("Nenhum registro encontrado com DHFIM null ou vazio.");
        }
    };

    const handleStartPause = () => {
        setIsActive(prevIsActive => {
            if (!prevIsActive) {
                handleStart();
            } else {
                handlePause();
            }
            return !prevIsActive;
        });
    };

    const formatTime = (time) => {
        const days = Math.floor(time / (24 * 3600));
        const hours = Math.floor((time % (24 * 3600)) / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        const formattedDays = String(days).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedDays}d:${formattedHours}h:${formattedMinutes}m:${formattedSeconds}s`;
    };

    const formatDateTime = (date) => {
        const day = `0${date.getDate()}`.slice(-2);
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const year = date.getFullYear();
        const hours = `0${date.getHours()}`.slice(-2);
        const minutes = `0${date.getMinutes()}`.slice(-2);
        const seconds = `0${date.getSeconds()}`.slice(-2);

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const formatDateTimeIni = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const day = datePart.slice(0, 2);
        const month = datePart.slice(2, 4);
        const year = datePart.slice(4, 8);
        return `${year}-${month}-${day}T${timePart}`;
    };

    return (
        <div className="flex flex-col items-center space-y-6 bg-[#2C2C54] p-6 rounded-3xl shadow-lg w-full mx-auto" style={{ margin: '10px' }}>
            <div className="sm-text-[15px] md-text-[15px] lg:text-2xl xl:text-2xl 2xl:text-2xl flex items-center justify-center w-full font-mono font-bold text-white tracking-widest bg-black bg-opacity-30 px-4 py-2 rounded-lg">
                {formatTime(time)}
            </div>
            <div className="flex" style={{marginTop: '7px'}}>
                {isActive ? (
                    <button
                        onClick={handleStartPause}
                        className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-red-300"
                    >
                        <FaPause className="text-[20px]" />
                    </button>
                ) : (
                    <button
                        onClick={handleStartPause}
                        className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                        <FaPlay className="text-[20px]" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Cronometro;
