import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Entorno Frontend Inicializado</h2>
        <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
          Arquitectura base de React + Vite lista para integración de modelos.
        </p>
      </main>
    </div>
  );
}

export default App;