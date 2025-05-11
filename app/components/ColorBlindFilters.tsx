'use client';

export const ColorBlindFilters = () => {
  return (
    <svg 
      aria-hidden="true"
      style={{ 
        position: 'absolute', 
        height: '0',
        width: '0',
        overflow: 'hidden'
      }}
    >
      <defs>
        {/* Filtro per protanopia (deficit del rosso) */}
        <filter id="protanopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.567, 0.433, 0, 0, 0
                    0.558, 0.442, 0, 0, 0
                    0, 0.242, 0.758, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
        
        {/* Filtro per deuteranopia (deficit del verde) */}
        <filter id="deuteranopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.625, 0.375, 0, 0, 0
                    0.7, 0.3, 0, 0, 0
                    0, 0.3, 0.7, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
        
        {/* Filtro per tritanopia (deficit del blu) */}
        <filter id="tritanopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.95, 0.05, 0, 0, 0
                    0, 0.433, 0.567, 0, 0
                    0, 0.475, 0.525, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
      </defs>
    </svg>
  );
}; 