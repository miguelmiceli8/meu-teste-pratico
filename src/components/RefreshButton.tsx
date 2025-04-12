import { useNavigate } from 'react-router-dom';

interface RefreshButtonProps {
  onReset: () => void; // Função para resetar a busca
}

// Componente do botão de atualizar
export function RefreshButton({ onReset }: RefreshButtonProps) {
  const navigate = useNavigate(); // Hook para navegação

  // Função para redirecionar para a página inicial e resetar a busca
  const handleRefresh = () => {
    onReset(); // Chama a função para resetar a busca
    navigate('/'); // Redireciona para a página inicial
  };

  return (
    <button onClick={handleRefresh} className="refresh-button">
      Atualizar
    </button>
  );
}