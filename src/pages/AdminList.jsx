import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

export default function AdminList() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, adminIds } = useAuthStore();

  useEffect(() => {
    const fetchAllAdmins = async () => {
      const storedToken = localStorage.getItem('access_token');
      
      if (!storedToken) {
        navigate('/login');
        return;
      }

      try {
        const tokenParts = storedToken.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const loggedAdminId = payload.sub;

        const allAdminIds = [...new Set([loggedAdminId, ...adminIds])];
        
        const adminPromises = allAdminIds.map(id => 
          api.get(`/admin/${id}`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          })
          .then(response => response.data)
          .catch(() => null)
        );

        const results = await Promise.all(adminPromises);
        const validAdmins = results.filter(admin => admin !== null);
        setAdmins(validAdmins);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Erro ao carregar dados dos administradores');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllAdmins();
  }, [navigate, adminIds]);

  const handleDelete = async (adminId) => {
    if (!window.confirm('Tem certeza que deseja excluir este administrador?')) {
      return;
    }

    try {
      await api.delete(`/admin/delete/${adminId}`);
      alert('Administrador excluído com sucesso!');
      const loggedAdminId = localStorage.getItem('adminId');
      if (loggedAdminId) {
        fetchAllAdmins();
      }
    } catch (err) {
      console.error('Erro ao deletar:', err.response?.data);
      alert('Erro ao excluir administrador');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando dados dos administradores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Lista de Administradores</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Link
          to="/create-admin"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Adicionar Administrador
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{admin.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{admin.nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{admin.email}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {admins.length === 0 && !loading && !error && (
          <div className="text-center py-8 text-gray-500">
            Nenhum administrador encontrado
          </div>
        )}
      </div>
    </div>
  );
} 