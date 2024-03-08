
import React, { useState } from 'react';
import axios from 'axios';

function OptimizeRoute({ token }) {
  const [optimizedRoute, setOptimizedRoute] = useState([]);

  const handleOptimizeRoute = async () => {
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
      <h2>Otimizar Rota</h2>
      <button onClick={handleOptimizeRoute}>Otimizar Rota</button>
      <ol>
        {optimizedRoute.map((client) => (
          <li key={client.id}>
            {client.name} - {client.email} - {client.phone}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default OptimizeRoute;
