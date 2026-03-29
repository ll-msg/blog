import { useEffect, useState } from 'react';

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
    <div className="blog-analog-clock" aria-label="Analog clock">
      <div
        className="blog-clock-hand blog-clock-hand-hour"
        style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
      />
      <div
        className="blog-clock-hand blog-clock-hand-minute"
        style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
      />
      <div
        className="blog-clock-hand blog-clock-hand-second"
        style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
      />
      <div className="blog-clock-center" />
    </div>
  );
}
