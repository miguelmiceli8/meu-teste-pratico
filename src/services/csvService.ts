import * as Papa from 'papaparse';
import { Cliente, Conta, Agencia } from '../types';

// Placeholder URLs - replace with actual Google Sheets CSV URLs
const CSV_URLS = {
    clientes: 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes',
    contas: 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas',
    agencias: 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias',
  };
  

// Type guard functions to validate enum values
function isValidEstadoCivil(value: string): value is Cliente['estadoCivil'] {
  return ['Solteiro', 'Casado', 'Viúvo', 'Divorciado'].includes(value);
}

function isValidTipoConta(value: string): value is Conta['tipo'] {
  return ['corrente', 'poupanca'].includes(value);
}

// Helper function to parse date strings (assuming format DD/MM/YYYY)
function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  // Handle different date formats
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  } else if (dateStr.includes('-')) {
    return new Date(dateStr);
  } else {
    // Try to parse as ISO string or timestamp
    return new Date(dateStr);
  }
}

// Process client data to ensure correct types
function processClientData(data: Record<string, any>[]): Cliente[] {
  return data.map(item => ({
    id: String(item.id || ''),
    cpfCnpj: String(item.cpfCnpj || ''),
    rg: item.rg ? String(item.rg) : undefined,
    dataNascimento: parseDate(item.dataNascimento),
    nome: String(item.nome || ''),
    nomeSocial: item.nomeSocial ? String(item.nomeSocial) : undefined,
    email: String(item.email || ''),
    endereco: String(item.endereco || ''),
    rendaAnual: Number(item.rendaAnual || 0),
    patrimonio: Number(item.patrimonio || 0),
    estadoCivil: isValidEstadoCivil(item.estadoCivil) ? item.estadoCivil : 'Solteiro',
    codigoAgencia: Number(item.codigoAgencia || 0)
  }));
}

// Process account data to ensure correct types
function processAccountData(data: Record<string, any>[]): Conta[] {
  return data.map(item => ({
    id: String(item.id || ''),
    cpfCnpjCliente: String(item.cpfCnpjCliente || ''),
    tipo: isValidTipoConta(item.tipo) ? item.tipo : 'corrente',
    saldo: Number(item.saldo || 0),
    limiteCredito: Number(item.limiteCredito || 0),
    creditoDisponivel: Number(item.creditoDisponivel || 0)
  }));
}

// Process agency data to ensure correct types
function processAgencyData(data: Record<string, any>[]): Agencia[] {
  return data.map(item => ({
    id: String(item.id || ''),
    codigo: Number(item.codigo || 0),
    nome: String(item.nome || ''),
    endereco: String(item.endereco || '')
  }));
}

// Generic function to fetch and parse CSV data
export async function fetchCSV<T>(
  url: string, 
  processor: (data: Record<string, any>[]) => T[]
): Promise<T[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    return new Promise<T[]>((resolve, reject) => {
      Papa.parse<Record<string, any>>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<Record<string, any>>) => {
          try {
            // Filter out rows where all values are empty or undefined
            const validData = results.data.filter((row: Record<string, any>) => 
              Object.keys(row).length > 0 && 
              !Object.values(row).every(val => val === '' || val === undefined)
            );
            
            // Process the data to ensure correct types
            const processedData = processor(validData);
            resolve(processedData);
          } catch (error) {
            reject(new Error(`Error processing CSV data: ${error instanceof Error ? error.message : String(error)}`));
          }
        },
        error : (error: Papa.ParseError) => {
          reject(new Error(`Error parsing CSV: ${error.message}`));
        }
      });
    });
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    throw error;
  }
}

// Specific functions for each data type
export const fetchClientes = (): Promise<Cliente[]> => 
  fetchCSV<Cliente>(CSV_URLS.clientes, processClientData);

export const fetchContas = (): Promise<Conta[]> => 
  fetchCSV<Conta>(CSV_URLS.contas, processAccountData);

export const fetchAgencias = (): Promise<Agencia[]> => 
  fetchCSV<Agencia>(CSV_URLS.agencias, processAgencyData);
