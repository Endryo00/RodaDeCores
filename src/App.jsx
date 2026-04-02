import { useState } from 'react'

function App() {
  // Estados para armazenar os valores de H (Matiz), S (Saturação) e L (Luminosidade)
  const [h, setH] = useState(0)
  const [s, setS] = useState(100)
  const [l, setL] = useState(50)

  // Função matemática para converter HSL para RGB
  const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));

    return `${r}, ${g}, ${b}`;
  };

  const rgbColor = hslToRgb(h, s, l);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '40px' }}>
      <h1>Roda de Cores HSL</h1>
      
      {/* Mostruário da Cor (formato circular simulando a roda) */}
      <div 
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: `hsl(${h}, ${s}%, ${l}%)`,
          margin: '0 auto 30px',
          border: '4px solid #333',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      ></div>

      {/* Saída da cor apenas no formato RGB, como exigido na Versão 1 */}
      <h2>RGB ({rgbColor})</h2>

      {/* Controles Deslizantes para simular a seleção */}
      <div style={{ maxWidth: '300px', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <label><strong>Matiz (Hue):</strong> {h}°</label>
          <input 
            type="range" 
            min="0" max="360" 
            value={h} 
            onChange={(e) => setH(e.target.value)} 
            style={{ width: '100%' }} 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label><strong>Saturação:</strong> {s}%</label>
          <input 
            type="range" 
            min="0" max="100" 
            value={s} 
            onChange={(e) => setS(e.target.value)} 
            style={{ width: '100%' }} 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label><strong>Luminosidade:</strong> {l}%</label>
          <input 
            type="range" 
            min="0" max="100" 
            value={l} 
            onChange={(e) => setL(e.target.value)} 
            style={{ width: '100%' }} 
          />
        </div>
      </div>
    </div>
  )
}

export default App