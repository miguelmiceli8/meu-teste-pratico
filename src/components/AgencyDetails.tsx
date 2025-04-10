import { Agencia } from '../types';

interface AgencyDetailsProps {
  agency: Agencia | null;
}

export function AgencyDetails({ agency }: AgencyDetailsProps) {
  if (!agency) {
    return <p className="no-agency">Informações da agência não disponíveis.</p>;
  }

  return (
    <div className="agency-details">
      <h3>Informações da Agência</h3>
      <div className="agency-info">
        <p><strong>Nome:</strong> {agency.nome}</p>
        <p><strong>Código:</strong> {agency.codigo}</p>
        <p><strong>Endereço:</strong> {agency.endereco}</p>
      </div>
    </div>
  );
}
