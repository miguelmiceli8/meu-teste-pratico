import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string, field: 'nome' | 'cpfCnpj') => void;
  onReset: () => void;
}

export function SearchBar({ onSearch, onReset }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [field, setField] = useState<'nome' | 'cpfCnpj'>('nome');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [field, query]);

  const handleSearch = () => {
    if (validateInput()) {
      onSearch(query, field);
    }
  };

  const validateInput = (): boolean => {
    if (field === 'nome' && query.trim() !== '') {
      const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s.',-]+$/;
      if (!nameRegex.test(query)) {
        setError("Este campo (nome) só aceita letras");
        return false;
      }
    }

    if (field === 'cpfCnpj' && query.trim() !== '') {
      const numericQuery = query.replace(/\D/g, ''); 
      if (!/^\d+$/.test(numericQuery)) {
        setError("Este campo (CPF/CNPJ) só aceita números");
        return false;
      }
    }

    return true;
  };

  const handleReset = () => {
    setQuery('');
    setError(null);
    onReset();
  };

  return (
    <div className="search-bar-container">
      <div className="search-field-container">
        <div className="field-selector">
          <button 
            className={`field-button ${field === 'nome' ? 'active' : ''}`}
            onClick={() => setField('nome')}
            aria-pressed={field === 'nome'}
            type="button"
          >
            Nome
          </button>
          <button 
            className={`field-button ${field === 'cpfCnpj' ? 'active' : ''}`}
            onClick={() => setField('cpfCnpj')}
            aria-pressed={field === 'cpfCnpj'}
            type="button"
          >
            CPF/CNPJ
          </button>
        </div>

        <div className="input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={field === 'nome' ? 'Buscar por nome...' : 'Buscar por CPF/CNPJ...'}
            aria-label={`Buscar por ${field === 'nome' ? 'nome' : 'CPF/CNPJ'}`}
            className={error ? 'input-error' : ''}
          />
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      <div className="search-actions">
        <button 
          onClick={handleSearch} 
          className="search-button"
          aria-label="Buscar"
        >
          Buscar
        </button>
        <button 
          onClick={handleReset} 
          className="reset-button"
          aria-label="Atualizar"
        >
          Atualizar
        </button>
      </div>
    </div>
  );
}
