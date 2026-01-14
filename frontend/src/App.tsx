import { useState } from 'react';
import './App.css';

function App() {
  const [selectedBoard] = useState<string | null>(null);
  // setSelectedBoard será usado quando implementarmos a seleção de quadros

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mini-Kanban</h1>
      </header>
      <main className="app-main">
        {!selectedBoard ? (
          <div className="board-selection">
            <h2>Selecione um Quadro</h2>
            <p>Lista de quadros será exibida aqui</p>
          </div>
        ) : (
          <div className="kanban-board">
            <h2>Quadro selecionado</h2>
            <p>Visualização Kanban será exibida aqui</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
