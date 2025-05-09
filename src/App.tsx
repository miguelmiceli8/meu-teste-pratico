// ... existing imports
import { useState, useEffect } from 'react';
import { Cliente, Conta, Agencia } from './types';
import { fetchClientes, fetchContas, fetchAgencias } from './services/csvService';
import { ClientList } from './components/ClientList';
import { ClientDetails } from './components/ClientDetails';
import "./styles/main.css"; // Caminho relativo correto

function App() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [accounts, setAccounts] = useState<Conta[]>([]);
  const [agencies, setAgencies] = useState<Agencia[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // Added searchQuery state

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [clientsData, accountsData, agenciesData] = await Promise.all([
          fetchClientes(),
          fetchContas(),
          fetchAgencias()
        ]);
        
        setClients(clientsData);
        setAccounts(accountsData);
        setAgencies(agenciesData);
      } catch (err) {
        setError('Falha ao carregar dados. Por favor, tente novamente mais tarde.');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleReset = () => {
    setSearchQuery(''); // Reset the search query
    setSelectedClient(null); // Optionally reset selected client
  };

  // Determine the accounts and agency for the selected client
  const clientAccounts = selectedClient ? accounts.filter(account => account.cpfCnpjCliente === selectedClient.cpfCnpj) : [];
  const clientAgency = selectedClient ? agencies.find(agency => agency.codigo === selectedClient.codigoAgencia) || null : null;

  if (loading) {
    return <div className="loading">Carregando dados...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app-container">
      <header>
        <h1>Sistema de Gerenciamento de Clientes</h1>
      </header>
      
      <main>
        <div className="content-container">
          <section className="client-list-section">
            <ClientList 
              clients={clients} 
              onSelectClient={setSelectedClient} 
              selectedClientId={selectedClient?.id || null}
              onReset={handleReset} // Pass the reset function
              searchQuery={searchQuery} // Pass the search query
            />
          </section>
          
          <section className="client-details-section">
            <ClientDetails 
              client={selectedClient} 
              accounts={clientAccounts} 
              agency={clientAgency}
            />
          </section>
        </div>
      </main>
      
      <footer>
        <p>Sistema de Gerenciamento de Clientes &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;