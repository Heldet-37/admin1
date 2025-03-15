import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function PendingReviews() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const response = await api.get('https://skyvendamz-production.up.railway.app/admin/usuarios/pendetes/');
        console.log('Dados recebidos:', response.data); // Debug
        setUsers(response.data);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar usuários pendentes');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReviews();
  }, []);

  // Componente Modal
  const ImageModal = ({ imageUrl, title, onClose }) => {
    if (!imageUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="max-w-4xl w-full bg-white rounded-lg overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-red-500">
      {error}
    </div>
  );

  if (users.length === 0) return (
    <div className="p-6 text-center text-gray-500">
      Nenhuma revisão pendente
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Revisões Pendentes</h2>
        <div className="text-sm text-gray-500">
          Total: {users.length} usuários
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg" />
              
              {/* Foto do usuário */}
              <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                <img 
                  src={`https://skyvendamz-production.up.railway.app/documentos/${user.info_usuario.foto_retrato}`}
                  alt={user.nome}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white cursor-pointer"
                  onClick={() => setSelectedImage({
                    url: `https://skyvendamz-production.up.railway.app/documentos/${user.info_usuario.foto_retrato}`,
                    title: 'Foto de Retrato'
                  })}
                />
              </div>
            </div>

            <div className="p-6 pt-14">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">{user.nome}</h3>
                <p className="text-gray-600">@{user.username}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-24">Tipo:</span>
                  <span className="capitalize font-medium">{user.tipo}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-24">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-24">Província:</span>
                  <span className="font-medium">{user.info_usuario.provincia}</span>
                </div>
              </div>

              {/* Documentos */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Documentos:</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* BI Frente */}
                  <div 
                    className="cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => setSelectedImage({
                      url: `https://skyvendamz-production.up.railway.app/documentos/${user.info_usuario.foto_bi_frente}`,
                      title: 'BI - Frente'
                    })}
                  >
                    <img 
                      src={`https://skyvendamz-production.up.railway.app/documentos/${user.info_usuario.foto_bi_frente}`}
                      alt="BI Frente"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-xs text-center mt-1 text-gray-600">BI - Frente</p>
                  </div>

                  {/* BI Verso */}
                  <div 
                    className="cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => setSelectedImage({
                      url: `https://skyvendamz-production.up.railway.app/documentos/${user.info_usuario.foto_bi_verso}`,
                      title: 'BI - Verso'
                    })}
                  >
                    <img 
                      src={`https://skyvendamz-production.up.railway.app/documentos/${user.info_usuario.foto_bi_verso}`}
                      alt="BI Verso"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <p className="text-xs text-center mt-1 text-gray-600">BI - Verso</p>
                  </div>
                </div>
              </div>

              {/* Botão de revisão */}
              <div className="flex justify-end mt-4">
                <Link
                  to={`/user/${user.id}/review`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm font-medium flex items-center gap-2"
                >
                  <span>Revisar Documentos</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de visualização de imagem */}
      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage.url}
          title={selectedImage.title}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
} 