
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Clients({ token }) {
  const [clients, setClients] = useState([]);

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

    fetchClients();
  }, [token]);

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - {client.email} - {client.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clients;
