// ReporteIA.jsx
import { useRef, useState } from 'react';

export default function ReporteIA() {
  const [pregunta, setPregunta] = useState('');
  const [resumen, setResumen] = useState('');
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvUrl, setCsvUrl] = useState('');
  const [historial, setHistorial] = useState([]);
  const inputRef = useRef(null);

  const generar = async () => {
    if (!pregunta.trim()) return;

    setLoading(true);
    setResumen('');
    setDatos([]);
    setCsvUrl('');

    try {
      const res = await fetch('https://ezojnzrongulnxcyoewy.supabase.co/functions/v1/erp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6b2puenJvbmd1bG54Y3lvZXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NTk2OTUsImV4cCI6MjA3ODEzNTY5NX0.vB9o6u8J06rcDM8YUmMesC9KTKMpOZYhQ_Ne13uveZc'
        },
        body: JSON.stringify({ pregunta, historial })
      });

      if (!res.ok) throw new Error('Error en la función');

      const result = await res.json();

      setResumen(result.resumen || 'Sin resumen');
      setDatos(result.datos || []);
      setHistorial(result.historial || []);

      if (result.csv) {
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        setCsvUrl(url);
      }

      // Limpiar input
      setPregunta('');
      inputRef.current?.focus();

    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Reporte IA Boutique
        </h1>

        {/* Input + Botón */}
        <div className="flex gap-3 mb-6">
          <input
            ref={inputRef}
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && generar()}
            placeholder="Ej: ¿Cuál es mi producto más vendido?"
            className="flex-1 p-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={generar}
            disabled={loading || !pregunta.trim()}
            className={`px-8 py-4 rounded-xl font-medium transition-all ${
              loading || !pregunta.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generando...
              </span>
            ) : (
              'Consultar'
            )}
          </button>
        </div>

        {/* Resumen */}
        {resumen && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-6 border-l-4 border-blue-500">
            <p className="text-lg font-medium text-gray-800" dangerouslySetInnerHTML={{ __html: resumen.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-700">$1</strong>') }} />
          </div>
        )}

        {/* Tabla + CSV */}
        {datos.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Datos del Reporte</h3>
              {csvUrl && (
                <a
                  href={csvUrl}
                  download={`reporte_${new Date().toISOString().split('T')[0]}.csv`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar CSV
                </a>
              )}
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    {Object.keys(datos[0]).map((key) => (
                      <th key={key} className="text-left p-3 font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datos.slice(0, 50).map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50 transition">
                      {Object.values(row).map((value, j) => (
                        <td key={j} className="p-3 text-gray-600">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {datos.length > 50 && (
              <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
                Mostrando 50 de {datos.length} filas
              </div>
            )}
          </div>
        )}

        {/* Historial (opcional) */}
        {historial.length > 1 && (
          <details className="mt-6 text-sm text-gray-500">
            <summary className="cursor-pointer font-medium">Historial de consultas</summary>
            <ul className="mt-2 space-y-1">
              {historial.slice(0, -1).map((h, i) => (
                <li key={i} className="text-gray-600">• {h.pregunta}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}