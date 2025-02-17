import { useState, useEffect } from "react";
import api from '../utils/api';
import Pagination from '../components/Pagination';
import { UserX, AlertTriangle, Search, RefreshCw } from 'lucide-react';

function UnverifiedUserList() {
  const [data, setData] = useState({
    total_usuarios: 0,
    usuarios: [],
    total_pages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/usuarios/nao_verificados/', {
          params: {
            page: currentPage,
            per_page: 10,
          }
        });
        
        setData({
          total_usuarios: response.data.total_usuarios || 0,
          usuarios: Array.isArray(response.data.usuarios) ? response.data.usuarios : [],
          total_pages: Math.ceil((response.data.total_usuarios || 0) / 10),
        });
      } catch (err) {
        setError(err.response?.data?.detail || 'Erro ao carregar usuários não verificados');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setLoading(true);
    setCurrentPage(1);
  };

  const filteredUsers = data.usuarios.filter(user => 
    user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Carregando usuários...</p>
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
          <button 
            onClick={handleRefresh}
            className="mt-4 flex items-center text-red-600 hover:text-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserX className="w-7 h-7 mr-2 text-red-500" />
            Usuários Não Verificados
          </h2>
          <p className="mt-1 text-gray-600">
            Gerencie os usuários que ainda precisam passar pelo processo de verificação
          </p>
        </div>

        {/* Barra de pesquisa */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
          />
        </div>
      </div>

      {/* Card de estatísticas */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-lg font-medium opacity-90">Total de Usuários Não Verificados</p>
            <h3 className="text-3xl font-bold mt-1">{data.total_usuarios}</h3>
          </div>
          <UserX className="w-12 h-12 opacity-80" />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Cadastro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.data_cadastro).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendente
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserX className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há usuários não verificados no momento ou sua busca não retornou resultados.
            </p>
          </div>
        )}
      </div>

      {/* Paginação */}
      {filteredUsers.length > 0 && (
        <div className="mt-6">
          <Pagination 
            currentPage={currentPage}
            totalPages={data.total_pages}
            onPageChange={handlePageChange}
          />
          <p className="mt-4 text-sm text-gray-600 text-center">
            Mostrando {filteredUsers.length} de {data.total_usuarios} usuários
          </p>
        </div>
      )}
    </div>
  );
}

export default function UnverifiedUsers() {
  return (
    <div>
      <UnverifiedUserList />
    </div>
  );
}