import { Conta } from '../types';

interface AccountListProps {
  accounts: Conta[];
}

export function AccountList({ accounts }: AccountListProps) {
  if (accounts.length === 0) {
    return <p className="no-accounts">Nenhuma conta encontrada para este cliente.</p>;
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const translateAccountType = (type: string): string => {
    return type === 'corrente' ? 'Conta Corrente' : 'Conta Poupança';
  };

  return (
    <div className="account-list">
      <h3>Contas</h3>
      <div className="accounts-table" role="region" aria-label="Contas do cliente">
        <table>
          <thead>
            <tr>
              <th>ID da Conta</th>
              <th>Tipo</th>
              <th>Saldo</th>
              <th>Limite de Crédito</th>
              <th>Crédito Disponível</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>{translateAccountType(account.tipo)}</td>
                <td>{formatCurrency(account.saldo)}</td>
                <td>{formatCurrency(account.limiteCredito)}</td>
                <td>{formatCurrency(account.creditoDisponivel)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}