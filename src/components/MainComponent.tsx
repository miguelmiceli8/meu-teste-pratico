import { RefreshButton } from './RefreshButton';
import { useState } from 'react';

// Componente principal da aplicação
export function MainComponent() {
  const [searchQuery, setSearchQuery] = useState(''); // Estado para armazenar a consulta de busca

  // Função para resetar a busca
  const handleReset = () => {
    setSearchQuery(''); // Limpa a consulta de busca
    // Aqui você pode adicionar lógica para resetar os resultados da busca, se necessário
  };

  return (
    <div className="app-container">
      <header>
        <h1>Sistema de Gerenciamento de Clientes</h1>
        <RefreshButton onReset={handleReset} /> {/* Botão de atualizar */}
      </header>
      <main>
        {/* Conteúdo principal da aplicação */}
        {/* Aqui você pode adicionar o componente de busca e a tabela de clientes */}
      </main>
      <footer>
        {/* Rodapé da aplicação */}
      </footer>
    </div>
  );
}
