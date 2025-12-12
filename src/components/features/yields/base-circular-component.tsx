import Frame from "./imports/Frame";
import { Ribbon } from "./imports/Frame";

export function BaseCircularComponent() {
  return (
    <div className="relative flex items-end justify-center" style={{ marginTop: "250px" }}>
      <div 
        className="absolute"
        style={{ 
          left: '50%',
          top: '65px',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          width: '650px',
          height: '650px',
        }}
      >
        <svg 
          className="w-full h-full"
          viewBox="0 0 650 650"
        >
          <defs>
            <linearGradient id="yieldCircleGradient" gradientUnits="userSpaceOnUse" x1="325" y1="5" x2="325" y2="325">
              <stop offset="0%" stopColor="#9071fb" stopOpacity="1" />
              <stop offset="15%" stopColor="#9071fb" stopOpacity="0.8" />
              <stop offset="20%" stopColor="#9071fb" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#5433c7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 5 325 A 320 320 0 0 1 645 325"
            fill="none"
            stroke="url(#yieldCircleGradient)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <Frame />
      <div className="absolute top-[-265px] left-1/2 -translate-x-1/2" style={{ zIndex: 20 }}>
        <Ribbon />
      </div>
    </div>
  );
}
