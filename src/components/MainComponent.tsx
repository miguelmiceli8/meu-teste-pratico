import { RefreshButton } from './RefreshButton';
import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { ClientList } from './ClientList';
import { Cliente } from '../types';

export function MainComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Cliente[]>([]);

  const handleReset = () => {
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Sistema de Gerenciamento de Clientes</h1>
        <RefreshButton onReset={handleReset} />
      </header>
      <main>
        <SearchBar onSearch={handleSearch} onReset={handleReset} />
        <ClientList 
          clients={clients} 
          searchQuery={searchQuery}
          onSelectClient={() => {}}
          selectedClientId={null}
          onReset={handleReset}
        />
      </main>
      <footer>
        {/* Rodapé da aplicação */}
      </footer>
    </div>
  );
}