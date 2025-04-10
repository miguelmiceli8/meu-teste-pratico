import { useState, useEffect } from 'react';
import { Cliente } from '../types';
import { SearchBar } from './SearchBar';
import { Pagination } from './Pagination';

interface ClientListProps {
  clients: Cliente[];
  onSelectClient: (client: Cliente) => void;
  selectedClientId: string | null;
  onReset: () => void;
}

export function ClientList({ clients, onSelectClient, selectedClientId, onReset }: ClientListProps) {
  const [filteredClients, setFilteredClients] = useState<Cliente[]>(clients);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  useEffect(() => {
    setFilteredClients(clients);
  }, [clients]);

  const handleSearch = (query: string, field: 'nome' | 'cpfCnpj') => {
    if (!query.trim()) {
      setFilteredClients(clients);
      return;
    }
    
    const filtered = clients.filter(client => {
      const fieldValue = client[field];
      return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(query.toLowerCase());
    });
    
    setFilteredClients(filtered);
    setCurrentPage(1);
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  return (
    <div className="client-list">
      <h2>Clientes</h2>
      <SearchBar onSearch={handleSearch} onReset={onReset} />
      
      <div className="clients-table" role="region" aria-label="Lista de clientes">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map(client => (
              <tr 
                key={client.id} 
                className={selectedClientId === client.id ? 'selected' : ''}
              >
                <td>{client.nome}</td>
                <td>{client.cpfCnpj}</td>
                <td>
                  <button 
                    onClick={() => onSelectClient(client)}
                    aria-label={`Ver detalhes de ${client.nome}`}
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredClients.length === 0 && (
          <p className="no-results">Nenhum cliente encontrado</p>
        )}
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
}
