import { Cliente, Conta, Agencia } from '../types';
import { AccountList } from './AccountList';
import { AgencyDetails } from './AgencyDetails';

interface ClientDetailsProps {
  client: Cliente | null;
  accounts: Conta[];
  agency: Agencia | null;
}

export function ClientDetails({ client, accounts, agency }: ClientDetailsProps) {
  if (!client) {
    return <div className="client-details-placeholder">Selecione um cliente para ver detalhes</div>;
  }

  const formatDate = (date: Date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const translateMaritalStatus = (status: string): string => {
    return status;
  };

  const formatCpfCnpj = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return value;
  };

  return (
    <div className="client-details">
      <h2>Detalhes do Cliente</h2>
      <div className="client-info">
        <div className="client-header">
          <h3>{client.nome}</h3>
          {client.nomeSocial && <p className="social-name">Nome social: {client.nomeSocial}</p>}
        </div>
        
        <div className="client-data-grid">
          <div className="data-group">
            <h4>Informações Pessoais</h4>
            <p><strong>CPF/CNPJ:</strong> {formatCpfCnpj(client.cpfCnpj)}</p>
            {client.rg && <p><strong>RG:</strong> {client.rg}</p>}
            <p><strong>Data de Nascimento:</strong> {formatDate(client.dataNascimento)}</p>
            <p><strong>Estado Civil:</strong> {translateMaritalStatus(client.estadoCivil)}</p>
          </div>
          
          <div className="data-group">
            <h4>Informações de Contato</h4>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Endereço:</strong> {client.endereco}</p>
          </div>
          
          <div className="data-group">
            <h4>Informações Financeiras</h4>
            <p><strong>Renda Anual:</strong> {formatCurrency(client.rendaAnual)}</p>
            <p><strong>Patrimônio:</strong> {formatCurrency(client.patrimonio)}</p>
            <p><strong>Código da Agência:</strong> {client.codigoAgencia}</p>
          </div>
        </div>
      </div>
      
      <AccountList accounts={accounts} />
      <AgencyDetails agency={agency} />
    </div>
  );
}
