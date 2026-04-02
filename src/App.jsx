import { useState, useEffect } from 'react';

function App() {
  // O Estado principal (Fonte da verdade) será o HSL
  const [h, setH] = useState(180);
  const [s, setS] = useState(100);
  const [l, setL] = useState(50);

  // Estados derivados para os inputs de texto (permite digitação suave)
  const [rgbInput, setRgbInput] = useState({ r: 0, g: 255, b: 255 });
  const [hexInput, setHexInput] = useState('00FFFF');

  // --- FUNÇÕES DE CONVERSÃO MATEMÁTICA ---
  const hslToRgb = (h, s, l) => {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToHex = (r, g, b) => {
    return [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  };

  // --- ATUALIZAÇÕES EM TEMPO REAL ---
  // Sempre que HSL mudar pelos sliders, atualiza os textos de RGB e Hex
  useEffect(() => {
    const { r, g, b } = hslToRgb(h, s, l);
    setRgbInput({ r, g, b });
    setHexInput(rgbToHex(r, g, b));
  }, [h, s, l]);

  // --- HANDLERS DOS INPUTS MANUAIS ---
  const handleHexChange = (e) => {
    const newHex = e.target.value.replace('#', '');
    setHexInput(newHex);
    if (newHex.length === 6) {
      const rgb = hexToRgb(newHex);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        setH(hsl.h); setS(hsl.s); setL(hsl.l);
      }
    }
  };

  const handleRgbChange = (color, value) => {
    const val = Math.max(0, Math.min(255, Number(value)));
    const newRgb = { ...rgbInput, [color]: val };
    setRgbInput(newRgb);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setH(hsl.h); setS(hsl.s); setL(hsl.l);
  };

  return (
    <div style={{ backgroundColor: '#1e1e1e', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      
      <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Lado Esquerdo: Representação Visual (Roda e Cores) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: `#${hexInput}`, border: '2px solid #555', borderRadius: '4px', marginBottom: '20px' }}></div>
          
          {/* Roda de Cores simulada com Conic Gradient */}
          <div style={{
            width: '200px', height: '200px', borderRadius: '50%', border: '2px solid #555', position: 'relative', cursor: 'pointer',
            background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)'
          }}>
            {/* Ponto indicador da cor atual na roda */}
            <div style={{
              width: '12px', height: '12px', border: '2px solid white', borderRadius: '50%', position: 'absolute',
              top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${h}deg) translateY(-90px)`, pointerEvents: 'none'
            }}></div>
          </div>
        </div>

        {/* Lado Direito: Controles e Inputs Manuais */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '220px' }}>
          
          {/* Sessão RGB */}
          <fieldset style={{ border: '1px solid #555', padding: '10px', borderRadius: '5px' }}>
            <legend style={{ fontSize: '12px', color: '#aaa' }}>RGB</legend>
            {['r', 'g', 'b'].map((color) => (
              <div key={color} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ textTransform: 'uppercase', width: '20px' }}>{color}:</span>
                <input type="number" min="0" max="255" value={rgbInput[color]} onChange={(e) => handleRgbChange(color, e.target.value)}
                  style={{ width: '60px', background: '#111', color: '#fff', border: '1px solid #444', padding: '3px 5px', borderRadius: '3px' }} />
              </div>
            ))}
          </fieldset>

          {/* Sessão HEX */}
          <fieldset style={{ border: '1px solid #555', padding: '10px', borderRadius: '5px' }}>
            <legend style={{ fontSize: '12px', color: '#aaa' }}>Hexadecimal</legend>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Hex:</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '5px' }}>#</span>
                <input type="text" maxLength="6" value={hexInput} onChange={handleHexChange}
                  style={{ width: '60px', background: '#111', color: '#fff', border: '1px solid #444', padding: '3px 5px', borderRadius: '3px', textTransform: 'uppercase' }} />
              </div>
            </div>
          </fieldset>

          {/* Sessão HSL (Sliders e Inputs) */}
          <fieldset style={{ border: '1px solid #555', padding: '10px', borderRadius: '5px' }}>
            <legend style={{ fontSize: '12px', color: '#aaa' }}>HSL (Matiz, Sat, Luz)</legend>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <span>H:</span>
              <input type="range" min="0" max="360" value={h} onChange={(e) => setH(Number(e.target.value))} style={{ flex: 1 }} />
              <input type="number" min="0" max="360" value={h} onChange={(e) => setH(Number(e.target.value))} style={{ width: '45px', background: '#111', color: '#fff', border: '1px solid #444' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <span>S:</span>
              <input type="range" min="0" max="100" value={s} onChange={(e) => setS(Number(e.target.value))} style={{ flex: 1 }} />
              <input type="number" min="0" max="100" value={s} onChange={(e) => setS(Number(e.target.value))} style={{ width: '45px', background: '#111', color: '#fff', border: '1px solid #444' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>L:</span>
              <input type="range" min="0" max="100" value={l} onChange={(e) => setL(Number(e.target.value))} style={{ flex: 1 }} />
              <input type="number" min="0" max="100" value={l} onChange={(e) => setL(Number(e.target.value))} style={{ width: '45px', background: '#111', color: '#fff', border: '1px solid #444' }} />
            </div>
          </fieldset>

        </div>
      </div>
    </div>
  );
}

export default App;