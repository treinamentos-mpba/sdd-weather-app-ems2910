import type { WeatherIconName } from '../types/weather';

interface WeatherIconProps {
  name: WeatherIconName;
  className?: string;
}

function IconShape({ name }: Pick<WeatherIconProps, 'name'>) {
  if (name === 'sun') {
    return (
      <>
        <circle cx="32" cy="32" r="11" />
        <path d="M32 5v7m0 40v7M5 32h7m40 0h7M12.9 12.9l5 5m28.2 28.2 5 5m0-38.2-5 5M17.9 46.1l-5 5" />
      </>
    );
  }

  if (name === 'rain') {
    return (
      <>
        <path d="M18 39h27a11 11 0 0 0 0-22 16 16 0 0 0-30-3A12 12 0 0 0 18 39Z" />
        <path d="m23 47-3 6m15-6-3 6m15-6-3 6" />
      </>
    );
  }

  if (name === 'cloud') {
    return <path d="M18 43h28a12 12 0 0 0 0-24 17 17 0 0 0-32-3A14 14 0 0 0 18 43Z" />;
  }

  return (
    <>
      <circle cx="24" cy="25" r="9" />
      <path d="M24 7v5m0 26v5M6 25h5m26 0h5M11.3 12.3l3.5 3.5m18.4 18.4 3.5 3.5m0-25.4-3.5 3.5m-18.4 18.4-3.5 3.5M29 47h20a9 9 0 0 0 0-18 13 13 0 0 0-24-2" />
    </>
  );
}

function WeatherIcon({ name, className = '' }: WeatherIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <IconShape name={name} />
    </svg>
  );
}

export default WeatherIcon;
