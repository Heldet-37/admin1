import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, RefreshCw, AlertTriangle, Search, Calendar } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/formatters';
import Pagination from '../components/Pagination';
import ReviewAdvertisement from '../components/ReviewAdvertisement';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'lucide-react';

export default function Advertisements() {
  const navigate = useNavigate();
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAd, setSelectedAd] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 9;
  const filteredAds = anuncios.filter(ad => 
    ad.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedAds = filteredAds.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredAds.length / ITEMS_PER_PAGE);

  useEffect(() => {
    carregarAnuncios();
  }, []);

  const carregarAnuncios = async () => {
    try {
      const response = await api.get('/admin/anuncios/');
      setAnuncios(response.data);
      setLoading(false);
    } catch (error) {
      setErro('Erro ao carregar anúncios');
      setLoading(false);
      console.error('Erro:', error);
    }
  };

  const formatarData = (data) => {
    return format(new Date(data), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  };

  const isExpired = (date) => {
    return new Date(date) < new Date();
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar ao Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Anúncios Aprovados ({anuncios.length})
        </h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar anúncios..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset para primeira página ao buscar
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedAds.map((anuncio) => (
          <div 
            key={anuncio.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {anuncio.imagem && (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={`https://skyvendamz.up.railway.app/anuncio/${anuncio.imagem}`}
                  alt={anuncio.nome || 'Anúncio'}
                  className="object-cover w-full h-48"
                />
              </div>
            )}
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">
                {anuncio.nome || 'Sem título'}
              </h3>
              
              <p className="text-gray-600 text-sm mb-2">
                {anuncio.descricao || 'Sem descrição'}
              </p>
              
              <p className="text-indigo-600 font-medium mb-2">
                {anuncio.preco || 'Preço não informado'}
              </p>

              <div className="text-xs text-gray-500 space-y-1">
                <p>Criado em: {formatarData(anuncio.criado_em)}</p>
                <p>Expira em: {formatarData(anuncio.expira_em)}</p>
              </div>

              {anuncio.link && (
                <a
                  href={anuncio.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Ver anúncio
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAds.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">Nenhum anúncio encontrado</p>
        </div>
      )}

      {filteredAds.length > ITEMS_PER_PAGE && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo(0, 0);
            }}
          />
        </div>
      )}

      {selectedAd && (
        <ReviewAdvertisement
          ad={selectedAd}
          onClose={() => setSelectedAd(null)}
          onSuccess={() => {
            carregarAnuncios();
            setSelectedAd(null);
          }}
        />
      )}
    </div>
  );
} 