import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useActionData,
} from "react-router-dom";

import Orders from './pages/Orders';
import Order from './pages/Order';

function App() {
  return (
    <div>
       <Router>
          <Routes>
            <Route path="/" element={<Orders />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<Order />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
