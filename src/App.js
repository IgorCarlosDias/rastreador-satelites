import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const App = () => {
  const [posicaoIss, setPosicaoIss] = useState(null);
  const [infoIss, setInfoIss] = useState(null);
  const [progresso, setProgresso] = useState(0);
  const [seguindoIss, setSeguindoIss] = useState(true); // Estado para controlar o rastreamento
  const intervaloAtualizacao = 2; // segundos

  const buscarPosicaoIss = async () => {
    try {
      const resposta = await axios.get('http://api.open-notify.org/iss-now.json');
      const { latitude: lat, longitude: lon } = resposta.data.iss_position;
      setPosicaoIss({ lat, lon });
    } catch (error) {
      console.error('Erro ao buscar a posição da ISS:', error);
    }
  };

  const buscarInfoIss = async () => {
    try {
      const resposta = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
      setInfoIss(resposta.data);
    } catch (error) {
      console.error('Erro ao buscar info da ISS:', error);
    }
  };

  useEffect(() => {
    buscarInfoIss(); // Buscar informações da ISS inicialmente
    const interval = setInterval(() => {
      buscarPosicaoIss();
      setProgresso((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / intervaloAtualizacao);
      });
    }, 1000);

    return () => clearInterval(interval); // Limpar o intervalo ao desmontar o componente
  }, []);

  const issIcon = new L.Icon({
    iconUrl: '/iss-icon.png', // Imagem do ícone
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  function FollowIss() {
    const map = useMap(); // Acesso ao mapa
    useEffect(() => {
      if (seguindoIss && posicaoIss) {
        map.setView([posicaoIss.lat, posicaoIss.lon], map.getZoom(), {
          animate: true, // Faz a transição suave
        });
      }
    }, [posicaoIss, map, seguindoIss]);

    return null;
  }

  return (
    <div>
      <h1>Rastreador de Satélites - ISS</h1>

      {/* Barra de progresso */}
      <div className="barra-container">
        <div className="barra-progresso" style={{ width: `${progresso}%` }}></div>
      </div>

      {posicaoIss && (
        <MapContainer
          center={[posicaoIss.lat, posicaoIss.lon]}
          zoom={3}
          style={{ width: '100%', height: '500px' }}
          whenCreated={map => map.invalidateSize()} // Ajusta o tamanho do mapa após a renderização
          scrollWheelZoom={false}  // Desativa o zoom do mouse
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; <a href='https://www.esri.com/en-us/arcgis/products/arcgis-online'>Esri</a>"
          />
          <FollowIss />
          <Marker position={[posicaoIss.lat, posicaoIss.lon]} icon={issIcon}>
            <Popup>A ISS está aqui!</Popup>
          </Marker>
        </MapContainer>
      )}

      {/* Botão para ativar/desativar o rastreamento */}
      <button 
        onClick={() => setSeguindoIss(prev => !prev)} 
        style={{ marginTop: '20px', padding: '10px', backgroundColor: '#00c6ff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {seguindoIss ? 'Desativar Rastreamento' : 'Ativar Rastreamento'}
      </button>

      <footer style={{ marginTop: '20px', color: '#fff' }}>
        {infoIss && (
          <div className="footer-info">
            <p><strong>Altitude:</strong> {infoIss.altitude.toFixed(2)} km</p>
            <p><strong>Velocidade:</strong> {infoIss.velocity.toFixed(2)} km/h</p>
            <p><strong>Coordenadas:</strong> Lat {infoIss.latitude.toFixed(2)}, Lon {infoIss.longitude.toFixed(2)}</p>
            <p><strong>Visibilidade:</strong> {infoIss.visibility}</p>
            <p><strong>Timestamp:</strong> {new Date(infoIss.timestamp * 1000).toLocaleString()}</p>
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;
