import { useState, useEffect } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Link as LinkIcon, Clock, Calendar, Edit, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Anuncios() {
  const navigate = useNavigate();
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarAnuncios();
  }, []);

  const carregarAnuncios = async () => {
    try {
      const response = await api.get('/admin/anuncios/listar');
      setAnuncios(response.data);
      setLoading(false);
    } catch (error) {
      setErro('Erro ao carregar lista de anúncios');
      setLoading(false);
      console.error('Erro:', error);
    }
  };

  const formatarData = (data) => {
    return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'MZN'
    }).format(preco);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lista de Anúncios</h1>
          <p className="text-gray-600">Visualize todos os anúncios do sistema</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anúncio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalhes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {anuncios.map((anuncio) => (
              <tr key={anuncio.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-20 w-20 flex-shrink-0">
                      <img
                        className="h-20 w-20 rounded-lg object-cover"
                        src={`https://skyvendamz.up.railway.app/anuncios/${anuncio.imagem}`}
                        alt={anuncio.nome}
                        onError={(e) => {
                          e.target.src = 'https://skyvendamz.up.railway.app/anuncios/${anuncio.imagem}';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {anuncio.nome || 'Sem título'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {anuncio.descricao || 'Sem descrição'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatarPreco(anuncio.preco)}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <LinkIcon className="w-4 h-4 mr-1" />
                    {anuncio.link || 'Sem link'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatarData(anuncio.criado_em)}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Expira: {formatarData(anuncio.expira_em)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <a
                      href={anuncio.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizar
                    </a>
                    <Link
                      to={`/anuncio/${anuncio.id}/revisar`}
                      className="text-green-600 hover:text-green-900 text-sm font-medium flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Revisar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {anuncios.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Nenhum anúncio encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
} 