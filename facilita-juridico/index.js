
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [clients, setClients] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await axios.get('/clients', {
          headers: {
            Authorization: token,
          },
        });
        setClients(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (isLoggedIn) {
      fetchClients();
    }
  }, [isLoggedIn, token]);

  const login = async () => {
    try {
      const response = await axios.post('/login', { email, password });
      setToken(response.data.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const optimizeRoute = async () => {
    try {
      const response = await axios.get('/optimize-route', {
        headers: {
          Authorization: token,
        },
      });
      setOptimizedRoute(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Clientes</h1>
          <button onClick={optimizeRoute}>Otimizar Rota</button>
          <ul>
            {clients.map((client) => (
              <li key={client.id}>
                {client.name} - {client.email} - {client.phone}
              </li>
            ))}
          </ul>
          <h2>Rota Otimizada</h2>
          <ol>
            {optimizedRoute.map((client) => (
              <li key={client.id}>
                {client.name} - {client.email} - {client.phone}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
