import Header from "./components/AppHeader";
import ProfileContent from "./components/ProfileContent";
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <ProfileContent />
      </main>
    </div>
  );
}

export default App;
