import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertTriangle, X } from 'lucide-react';
import axios from 'axios';

function FotoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [fotos, setFotos] = useState({
    foto_retrato: null,
    foto_bi_frente: null,
    foto_bi_verso: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError('Não autorizado. Por favor, faça login novamente.');
          return;
        }

        const response = await axios.get('https://https://skyvendamz-production.up.railway.app/admin/usuarios/verificados/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }); 
        
        const usuarioEncontrado = response.data.find(user => user.id === parseInt(id));
        if (usuarioEncontrado) {
          setUsuario(usuarioEncontrado);
          setFotos({
            foto_retrato: usuarioEncontrado.info_usuario?.foto_retrato,
            foto_bi_frente: usuarioEncontrado.info_usuario?.foto_bi_frente,
            foto_bi_verso: usuarioEncontrado.info_usuario?.foto_bi_verso
          });
        } else {
          setError('Usuário não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchFotos();
  }, [id]);

  // Função para ativar usuário
  const handleActivate = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('access_token');
      await axios.put(`https://skyvendamz-production.up.railway.app/admin/usuario/${id}/ativar`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Atualiza o estado do usuário após ativar
      setUsuario(prevUser => ({
        ...prevUser,
        ativo: true
      }));
      alert('Usuário ativado com sucesso!');
    } catch (err) {
      console.error('Erro ao ativar:', err);
      alert('Erro ao ativar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para desativar usuário
  const handleDeactivate = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('access_token');
      await axios.put(`https://skyvendamz-production.up.railway.app/admin/usuario/${id}/desativar`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Atualiza o estado do usuário após desativar
      setUsuario(prevUser => ({
        ...prevUser,
        ativo: false
      }));
      alert('Usuário desativado com sucesso!');
    } catch (err) {
      console.error('Erro ao desativar:', err);
      alert('Erro ao desativar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para deletar usuário
  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('access_token');
      
      // Usando axios diretamente com configurações CORS
      await axios({
        method: 'DELETE',
        url: `https://skyvendamz-production.up.railway.app/admin/delete/user/${id}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false // Importante para CORS
      });

      alert('Usuário deletado com sucesso!');
      navigate('/usuarios/verificados');
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar usuário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Carregando fotos...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link 
            to="/verifiedUsers"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para Usuários Verificados
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
        </div>
      </div>

      {/* Grid de Fotos */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Foto de Retrato */}
          {fotos.foto_retrato && (
            <div 
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedImage({
                url: `https://skyvendamz-production.up.railway.app/documentos/${fotos.foto_retrato}`,
                title: 'Foto de Retrato'
              })}
            >
              <div className="p-3 bg-gray-50 border-b">
                <h3 className="font-medium">Foto de Retrato</h3>
              </div>
              <div className="aspect-square">
                <img
                  src={`https://skyvendamz-production.up.railway.app/documentos/${fotos.foto_retrato}`}
                  alt="Retrato"
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </div>
            </div>
          )}

          {/* BI Frente */}
          {fotos.foto_bi_frente && (
            <div 
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedImage({
                url: `https://skyvendamz-production.up.railway.app/documentos/${fotos.foto_bi_frente}`,
                title: 'BI - Frente'
              })}
            >
              <div className="p-3 bg-gray-50 border-b">
                <h3 className="font-medium">BI - Frente</h3>
              </div>
              <div className="aspect-square">
                <img
                  src={`https://skyvendamz-production.up.railway.app/documentos/${fotos.foto_bi_frente}`}
                  alt="BI Frente"
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </div>
            </div>
          )}

          {/* BI Verso */}
          {fotos.foto_bi_verso && (
            <div 
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedImage({
                url: `https://skyvendamz-production.up.railway.app/documentos/${fotos.foto_bi_verso}`,
                title: 'BI - Verso'
              })}
            >
              <div className="p-3 bg-gray-50 border-b">
                <h3 className="font-medium">BI - Verso</h3>
              </div>
              <div className="aspect-square">
                <img
                  src={`https://skyvendamz-production.up.railway.app/documentos/${fotos.foto_bi_verso}`}
                  alt="BI Verso"
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-end gap-4">
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Deletar Usuário</span>
          </button>
          
          {/* Botão Desativar - habilitado quando usuário está ativo */}
          <button
            onClick={handleDeactivate}
            disabled={isSubmitting || !usuario?.ativo}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
            <span>Desativar Usuário</span>
          </button>
          
          {/* Botão Ativar - habilitado quando usuário está inativo */}
          <button
            onClick={handleActivate}
            disabled={isSubmitting || usuario?.ativo}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Ativar Usuário</span>
          </button>
        </div>
      </div>

      {/* Modal de Visualização */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium">{selectedImage.title}</h3>
              </div>
              <div className="relative">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FotoDetalhes; 