import Header from "./components/AppHeader";
import { TestQuery } from "./components/influxdb";
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <TestQuery />
      </main>
    </div>
  );
}

export default App;
