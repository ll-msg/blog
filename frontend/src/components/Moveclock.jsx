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
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-text-soft flex items-center justify-center bg-bg-soft/40 shadow-lg">
            <div
                className="absolute w-1.5 h-7 sm:h-8 bg-white rounded origin-bottom top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }}
            />
            <div
                className="absolute w-1 h-10 sm:h-11 bg-white rounded origin-bottom top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)` }}
            />
            <div
                className="absolute w-0.5 h-12 sm:h-14 bg-red-400 rounded origin-bottom top-1/2 left-1/2"
                style={{ transform: `translate(-50%, -100%) rotate(${secondDeg}deg)` }}
            />
            <div className="w-2 h-2 bg-red-400 rounded-full z-50"></div>
        </div>
    );
}
