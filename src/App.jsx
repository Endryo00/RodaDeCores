import { useState } from 'react'

function App() {
  const [h, setH] = useState(0)
  const [s, setS] = useState(100)
  const [l, setL] = useState(50)
  const [savedColors, setSavedColors] = useState([]) // Nova funcionalidade: Lista de cores

  // Função para converter HSL para RGB
  const hslToRgb = (h, s, l) => {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
  };

  // Função para converter RGB para HEX
  const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const [r, g, b] = hslToRgb(h, s, l);
  const hexColor = rgbToHex(r, g, b);
  const hslColor = `hsl(${h}, ${s}%, ${l}%)`;

  const saveColor = () => {
    const newColor = { hex: hexColor, rgb: `${r},${g},${b}`, hsl: hslColor };
    setSavedColors([newColor, ...savedColors]);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
      <h1>Roda de Cores - V2</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        {/* Coluna do Seletor */}
        <div>
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: hslColor, margin: '0 auto 20px', border: '3px solid #333' }}></div>
          
          <div style={{ textAlign: 'left', background: '#f4f4f4', padding: '15px', borderRadius: '8px' }}>
            <p><strong>RGB:</strong> {r}, {g}, {b}</p>
            <p><strong>HEX:</strong> {hexColor}</p>
            <p><strong>HSL:</strong> {h}°, {s}%, {l}%</p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <input type="range" min="0" max="360" value={h} onChange={(e) => setH(e.target.value)} />
            <br />
            <button onClick={saveColor} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>Salvar Cor</button>
          </div>
        </div>

        {/* Coluna das Cores Salvas */}
        <div style={{ minWidth: '200px' }}>
          <h3>Cores Salvas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {savedColors.map((color, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: color.hex, margin: '0 auto', borderRadius: '4px', border: '1px solid #ccc' }}></div>
                <small style={{ fontSize: '10px' }}>{color.hex}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App