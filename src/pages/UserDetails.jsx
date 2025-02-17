import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../utils/api';
import Pagination from '../components/Pagination';
import { 
  User, Package, Clock, CreditCard, RefreshCw, AlertTriangle,
  ChevronLeft, LayoutList, History, Filter
} from 'lucide-react';

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState({
    total: 0,
    produtos: [],
    total_pages: 0
  });
  const [transactions, setTransactions] = useState({
    total: 0,
    transacoes: [],
    total_pages: 0
  });
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }

      // Formata a data e hora no padrão brasileiro
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Usa formato 24h
        timeZone: 'Africa/Maputo' // Timezone correto de Moçambique
      }).format(date);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'MZN'
    }).format(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'products') {
          const response = await api.get(`/admin/${userId}/produtos/`, {
            params: {
              page: currentProductPage,
              limit: 10
            }
          });
          
          setProducts({
            total: response.data.total || 0,
            produtos: response.data.produtos || [],
            total_pages: Math.ceil((response.data.total || 0) / response.data.limit)
          });
        } else {
          const response = await api.get(`/admin/${userId}/transacoes/`);
          setTransactions({
            total: response.data.total || 0,
            transacoes: response.data.transacoes || [],
            total_pages: Math.ceil((response.data.total || 0) / 10)
          });
        }
      } catch (err) {
        setError(err.response?.data?.detail || `Erro ao carregar ${activeTab === 'products' ? 'produtos' : 'transações'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, activeTab, currentProductPage, currentTransactionPage]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Carregando informações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg max-w-2xl w-full">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-4" />
            <div>
              <h3 className="text-red-800 font-medium mb-1">Erro ao carregar dados</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredProducts = products.produtos.filter(product => {
    if (filterStatus === 'all') return true;
    return filterStatus === 'active' ? product.ativo : !product.ativo;
  });

  const filteredTransactions = transactions.transacoes.filter(transaction => {
    if (filterStatus === 'all') return true;
    return filterStatus === transaction.status;
  });

  // Função para renderizar produto
  const renderProduct = (product) => (
    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {product.capa ? (
              <img 
                src={`https://skyvendamz.up.railway.app/produto/${product.capa}`} 
                alt={product.nome}
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.nome}</div>
            <div className="text-sm text-gray-500">
              {product.categoria} • {product.provincia}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(product.preco)}
        </div>
        {product.negociavel && (
          <span className="text-xs text-gray-500">Negociável</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          product.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {product.ativo ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(product.data_publicacao)}
      </td>
    </tr>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Voltar
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <User className="w-7 h-7 mr-2 text-blue-500" />
              Detalhes do Usuário
            </h1>
            <p className="mt-1 text-gray-600">ID: {userId}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('products')}
              className={`${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Package className="w-5 h-5 mr-2" />
              Produtos
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <History className="w-5 h-5 mr-2" />
              Transações
            </button>
          </nav>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        <div className="text-sm text-gray-500">
          Total: {activeTab === 'products' ? products.total : transactions.total} registros
        </div>
      </div>

      {/* Conteúdo */}
      {activeTab === 'products' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(renderProduct)}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há produtos que correspondam aos filtros selecionados.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{transaction.tipo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(transaction.valor)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(transaction.data)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'concluido' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <History className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma transação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há transações que correspondam aos filtros selecionados.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Paginação */}
      <div className="mt-6">
        <Pagination
          currentPage={activeTab === 'products' ? currentProductPage : currentTransactionPage}
          totalPages={activeTab === 'products' ? products.total_pages : transactions.total_pages}
          onPageChange={activeTab === 'products' ? setCurrentProductPage : setCurrentTransactionPage}
        />
      </div>
    </div>
  );
}