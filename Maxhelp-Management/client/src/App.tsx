import React, { useState } from "react";
import SignIn from './signin'
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import './globals.css'
import Dashboard from "./dashboard";
import Register from "./register";
function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const [code, setCode] = useState(0);


  return (
    <>
      <Router>
        <div className="App">
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/signin" />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App
