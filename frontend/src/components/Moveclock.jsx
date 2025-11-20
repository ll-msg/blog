import { useEffect, useState } from "react";

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondDeg = seconds * 6;
    const minuteDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;

    return (
        <div className="relative w-40 h-40 sm:w-30 sm:h-30 rounded-full border-2 border-text-soft flex items-center justify-center bg-bg-soft/40 shadow-lg">

            <div
                className="absolute w-1.5 h-8 bg-white rounded origin-bottom top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }}
            />
            <div
                className="absolute w-1 h-11 bg-white rounded origin-bottom top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)` }}
            />
            <div
                className="absolute w-0.5 h-13 bg-red-400 rounded origin-bottom top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -100%) rotate(${secondDeg}deg)` }}
            />
            <div className="w-2 h-2 bg-red-400 rounded-full z-50"></div>
        </div>
    );
}
