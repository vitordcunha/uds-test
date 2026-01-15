import { Route, Switch, useLocation } from "wouter";
import BoardList from "./components/BoardList";
import { BoardView } from "./features/boards/components/BoardView";
import { ArrowLeft } from "lucide-react";
import { Button } from "./shared/components/ui/Button";

function Header() {
  const [location, setLocation] = useLocation();
  const isBoardPage = location.startsWith("/boards/");

  const handleBackToList = () => {
    setLocation("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {isBoardPage && (
            <Button onClick={handleBackToList} variant="ghost" size="sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">Mini-Kanban</h1>
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
