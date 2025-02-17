import { useState, useEffect } from "react";
import api from '../utils/api';
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import { Users as UsersIcon, Search, RefreshCw, AlertTriangle, ExternalLink, Wallet, Package } from 'lucide-react';

function UserList() {
  const [data, setData] = useState({
    total_usuarios: 0,
    usuarios: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/usuarios/', {
          params: {
            page: currentPage,
            per_page: itemsPerPage
          }
        });
        setData({
          total_usuarios: response.data.total_usuarios || 0,
          usuarios: Array.isArray(response.data.usuarios) ? response.data.usuarios : [],
        });
      } catch (err) {
        setError(err.response?.data?.detail || 'Erro ao carregar usuários');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, itemsPerPage]);

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
            <UsersIcon className="w-7 h-7 mr-2 text-blue-500" />
            Usuários
          </h2>
          <p className="mt-1 text-gray-600">
            Gerencie todos os usuários cadastrados no sistema
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

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-lg font-medium opacity-90">Total de Usuários</p>
              <h3 className="text-3xl font-bold mt-1">{data.total_usuarios}</h3>
            </div>
            <UsersIcon className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-lg font-medium opacity-90">Total de Produtos</p>
              <h3 className="text-3xl font-bold mt-1">
                {data.usuarios.reduce((acc, user) => acc + (user.total_produtos || 0), 0)}
              </h3>
            </div>
            <Package className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-lg font-medium opacity-90">Saldo Total</p>
              <h3 className="text-3xl font-bold mt-1">
                MT {data.usuarios.reduce((acc, user) => acc + parseFloat(user.saldo || 0), 0).toFixed(2)}
              </h3>
            </div>
            <Wallet className="w-12 h-12 opacity-80" />
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Produtos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{user.total_produtos || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      MT {parseFloat(user.saldo || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      to={`/user/${user.id}`}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                    >
                      <span>Ver Detalhes</span>
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há usuários cadastrados ou sua busca não retornou resultados.
            </p>
          </div>
        )}
      </div>

      {/* Paginação */}
      {filteredUsers.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(data.total_usuarios / itemsPerPage)}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <p className="mt-4 text-sm text-gray-600 text-center">
            Mostrando {filteredUsers.length} de {data.total_usuarios} usuários
          </p>
        </div>
      )}
    </div>
  );
}

export default function Users() {
  return (
    <div>
      <UserList />
    </div>
  );
}