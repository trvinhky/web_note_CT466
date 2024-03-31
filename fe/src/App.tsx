import './App.css'
import { BrowserRouter } from "react-router-dom";
import RouteApp from './router';
import { LoadingProvider } from './utils/loadingContext';

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <RouteApp />
      </BrowserRouter>
    </LoadingProvider>
  )
}

export default App
