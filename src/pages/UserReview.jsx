import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function UserReview() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    try {
      setIsSubmitting(true);
      const response = await api.put(`/admin/usuario/${userId}/revisao?nova_revisao=sim`);
      console.log('Resposta da aprovação:', response.data);
      alert('Usuário aprovado com sucesso!');
      navigate('/pending-reviews');
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('Erro ao aprovar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Por favor, insira um motivo para a rejeição');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.put(`/admin/usuario/${userId}/revisao?nova_revisao=nao&motivo=${encodeURIComponent(rejectReason)}`);
      console.log('Resposta da rejeição:', response.data);
      alert('Usuário rejeitado com sucesso!');
      setShowRejectModal(false);
      navigate('/pending-reviews');
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      alert('Erro ao rejeitar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Revisão de Documentos</h1>
          <p className="text-gray-600 mt-1">ID do usuário: {userId}</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* Área de exemplo para documentos */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-gray-500">Área para visualização de documentos</p>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Recusar</span>
              </button>
              <button
                onClick={handleAccept}
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Aprovar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Rejeição */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Motivo da Rejeição</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Digite o motivo da rejeição..."
              className="w-full h-32 p-3 border rounded-lg mb-4 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 