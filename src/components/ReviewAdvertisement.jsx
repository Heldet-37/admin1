import { useState, useRef } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { formatCurrency } from '../utils/formatters';

export default function ReviewAdvertisement({ ad, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    status: ad.status || 'PENDENTE',
    dias_para_expirar: 30,
    nome: ad.nome || '',
    descricao: ad.descricao || '',
    preco: ad.preco || 0,
    link: ad.link || '',
    foto: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, foto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      });

      await api.put(`/admin/anuncios/revisar/${ad.id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao atualizar anúncio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Revisar Anúncio #{ad.id}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="REJEITADO">Rejeitado</option>
                </select>
              </div>

              {/* Dias para Expirar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dias para Expirar
                </label>
                <input
                  type="number"
                  name="dias_para_expirar"
                  value={formData.dias_para_expirar}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                  min="1"
                />
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço
                </label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Link */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Descrição */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Foto */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Escolher Imagem
                  </button>
                </div>
                {(preview || ad.imagem) && (
                  <div className="mt-2">
                    <img
                      src={preview || `https://skyvendamz.up.railway.app/images/${ad.imagem}`}
                      alt="Preview"
                      className="max-h-48 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 