import { useState, useEffect } from 'react';

function App() {
  const [h, setH] = useState(180);
  const [s, setS] = useState(100);
  const [l, setL] = useState(50);

  const [rgbInput, setRgbInput] = useState({ r: 0, g: 255, b: 255 });
  const [hexInput, setHexInput] = useState('00FFFF');
  
  // O Estado das cores salvas está de volta
  const [savedColors, setSavedColors] = useState([]);

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

  // --- HANDLER DE INTERAÇÃO COM A RODA DE CORES ---
  const handleWheelInteraction = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Posição do mouse em relação ao centro do círculo
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calcula o ângulo (Matiz/Hue)
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    // Calcula a distância do centro (Saturação)
    const radius = rect.width / 2;
    const distance = Math.min(Math.sqrt(x * x + y * y), radius);
    const newS = Math.round((distance / radius) * 100);

    setH(Math.round(angle));
    setS(newS);
  };

  // --- HANDLER PARA SALVAR COR ---
  const handleSaveColor = () => {
    const newColor = { 
      hex: `#${hexInput}`, 
      rgb: `${rgbInput.r}, ${rgbInput.g}, ${rgbInput.b}`, 
      hsl: `${h}°, ${s}%, ${l}%` 
    };
    setSavedColors([newColor, ...savedColors]);
  };

  return (
    <div style={{ backgroundColor: '#1e1e1e', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      
      <div style={{ backgroundColor: '#2d2d2d', padding: '25px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', gap: '40px', flexWrap: 'wrap', maxWidth: '800px' }}>
        
        {/* Bloco 1: A Roda e o Mostruário */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px' }}>
          {/* Mostruário da Cor Atual */}
          <div style={{ width: '100px', height: '100px', backgroundColor: `#${hexInput}`, border: '3px solid #555', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}></div>
          
          {/* Roda de Cores Interativa */}
          <div 
            onMouseDown={handleWheelInteraction}
            onMouseMove={(e) => e.buttons === 1 && handleWheelInteraction(e)} // Só atualiza se o botão esquerdo do mouse estiver pressionado
            style={{
              width: '200px', height: '200px', borderRadius: '50%', border: '2px solid #555', position: 'relative', cursor: 'crosshair',
              // Fundo radial para a saturação + conic gradient para a matiz
              background: `radial-gradient(circle closest-side, hsl(0, 0%, ${l}%), transparent), conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)`
            }}>
            {/* Ponto indicador (Crosshair) */}
            <div style={{
              width: '14px', height: '14px', border: '2px solid white', borderRadius: '50%', position: 'absolute', pointerEvents: 'none', boxShadow: '0 0 4px rgba(0,0,0,0.8)',
              // Usa trigonometria para colocar a bolinha no lugar exato baseado no estado atual
              left: `calc(50% + ${Math.sin(h * Math.PI / 180) * (s / 100) * 100}px - 7px)`,
              top: `calc(50% - ${Math.cos(h * Math.PI / 180) * (s / 100) * 100}px - 7px)`,
            }}></div>
          </div>
        </div>

        {/* Bloco 2: Controles Manuais */}
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

          {/* Sessão HSL (Luminosidade afeta a roda) */}
          <fieldset style={{ border: '1px solid #555', padding: '10px', borderRadius: '5px' }}>
            <legend style={{ fontSize: '12px', color: '#aaa' }}>Luminosidade (L)</legend>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="range" min="0" max="100" value={l} onChange={(e) => setL(Number(e.target.value))} style={{ flex: 1 }} />
              <input type="number" min="0" max="100" value={l} onChange={(e) => setL(Number(e.target.value))} style={{ width: '45px', background: '#111', color: '#fff', border: '1px solid #444' }} />
            </div>
          </fieldset>

          {/* Botão de Salvar restaurado */}
          <button 
            onClick={handleSaveColor} 
            style={{ padding: '10px', backgroundColor: '#007acc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px' }}>
            + Salvar Cor
          </button>

        </div>

        {/* Bloco 3: Lista de Cores Salvas */}
        <div style={{ minWidth: '200px', borderLeft: '1px solid #444', paddingLeft: '30px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '10px' }}>Cores Salvas</h3>
          
          {savedColors.length === 0 ? (
            <p style={{ color: '#888', fontSize: '14px' }}>Nenhuma cor salva ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto', paddingRight: '10px' }}>
              {savedColors.map((color, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#222', padding: '8px', borderRadius: '5px' }}>
                  <div style={{ width: '30px', height: '30px', backgroundColor: color.hex, borderRadius: '4px', border: '1px solid #555' }}></div>
                  <div style={{ fontSize: '12px', color: '#ccc' }}>
                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{color.hex}</div>
                    <div>RGB: {color.rgb}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;