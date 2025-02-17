import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Save, X, Upload } from 'lucide-react';

export default function RevisarAnuncio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [formData, setFormData] = useState({
    status: '',
    dias_para_expirar: 0,
    nome: '',
    descricao: '',
    preco: 0,
    link: '',
    foto: null
  });

  useEffect(() => {
    carregarAnuncio();
  }, [id]);

  const carregarAnuncio = async () => {
    try {
      const response = await api.get(`/admin/anuncios/listar/${id}`);
      const anuncio = response.data;
      
      setFormData({
        status: anuncio.status || '',
        dias_para_expirar: anuncio.dias_para_expirar || 0,
        nome: anuncio.nome || '',
        descricao: anuncio.descricao || '',
        preco: anuncio.preco || 0,
        link: anuncio.link || '',
        foto: null
      });
      
      setPreviewImage(`https://skyvendamz.up.railway.app/anuncio/${anuncio.imagem}`);
      setLoading(false);
    } catch (error) {
      setErro('Erro ao carregar anúncio');
      setLoading(false);
      console.error('Erro:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        foto: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      await api.put(`/admin/anuncios/revisar/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/lista-anuncios');
    } catch (error) {
      setErro('Erro ao revisar anúncio');
      setLoading(false);
      console.error('Erro:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Revisar Anúncio</h1>
        <p className="text-gray-600">Atualize as informações do anúncio</p>
      </div>

      {erro && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecione um status</option>
              <option value="aprovado">Aprovado</option>
              <option value="pendente">Pendente</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dias para Expirar
            </label>
            <input
              type="number"
              name="dias_para_expirar"
              value={formData.dias_para_expirar}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço
            </label>
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
              step="0.01"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows="3"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto
            </label>
            <div className="flex items-center space-x-4">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg"
                />
              )}
              <label className="cursor-pointer bg-gray-50 px-4 py-2 border rounded-md hover:bg-gray-100">
                <Upload className="w-5 h-5 inline-block mr-2" />
                Escolher Nova Foto
                <input
                  type="file"
                  name="foto"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/lista-anuncios')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
          >
            <X className="w-5 h-5 mr-2" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
} 