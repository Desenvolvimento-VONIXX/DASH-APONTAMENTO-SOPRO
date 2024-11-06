import { useState, useEffect } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

function PlayPause({ time, setTime }) {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isPlaying && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying, time, setTime]);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="flex items-center justify-center w-12 h-12 mr-2 text-white bg-[#2f7162] hover:bg-[#2f7162] rounded-full"
            >
                <FaPlay className="text-2xl" />
            </button>
            <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="flex items-center justify-center w-12 h-12 text-white bg-[#913232] hover:bg-[#913232] rounded-full"
            >
                <FaPause className="text-2xl" />
            </button>
        </>
    );
}

export default PlayPause;
