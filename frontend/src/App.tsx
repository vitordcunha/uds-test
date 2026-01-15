import { Route, Switch, useLocation } from 'wouter';
import BoardList from './components/BoardList';
import { BoardView } from './features/boards/components/BoardView';

function Header() {
  const [location, setLocation] = useLocation();
  const isBoardPage = location.startsWith('/boards/');

  const handleBackToList = () => {
    setLocation('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Mini-Kanban</h1>
          {isBoardPage && (
            <button
              onClick={handleBackToList}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voltar para Quadros
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Switch>
          <Route path="/" component={BoardList} />
          <Route path="/boards/:boardId">
            {(params) => <BoardView boardId={params.boardId} />}
          </Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
