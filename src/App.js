import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const issIcon = new L.Icon({
  iconUrl: '/iss-icon.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const AtualizarMapa = ({ posicao, travar }) => {
  const map = useMap();
  useEffect(() => {
    if (travar) {
      map.setView(posicao, map.getZoom());
    }
  }, [posicao, travar, map]);
  return null;
};

const App = () => {
  const [posicao, setPosicao] = useState(null);
  const [info, setInfo] = useState(null);
  const [progresso, setProgresso] = useState(0);
  const [travar, setTravar] = useState(true);
  const intervaloAtualizacao = 2;

  const buscarDados = async () => {
    try {
      const [pos, dados] = await Promise.all([
        axios.get('https://api.wheretheiss.at/v1/satellites/25544'),
        axios.get('https://api.wheretheiss.at/v1/satellites/25544'),
      ]);
      setPosicao({ lat: pos.data.latitude, lon: pos.data.longitude });
      setInfo(dados.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    buscarDados();
    const interval = setInterval(() => {
      setProgresso((p) => {
        if (p >= 100) {
          buscarDados();
          return 0;
        }
        return p + 100 / intervaloAtualizacao;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Rastreador da ISS</h1>

      <div className="barra-container">
        <div className="barra-progresso" style={{ width: `${progresso}%` }}></div>
      </div>

      <button onClick={() => setTravar((v) => !v)}>
        {travar ? 'Centralizado' : 'Descentralizado'}
      </button>

      {posicao && (
        <MapContainer
          center={[posicao.lat, posicao.lon]}
          zoom={5}
          style={{ height: '500px', width: '100%', marginTop: '10px' }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; <a href='https://www.esri.com/en-us/arcgis/products/arcgis-online'>Esri</a>"
          />
          <Marker position={[posicao.lat, posicao.lon]} icon={issIcon}>
            <Popup>ISS</Popup>
          </Marker>
          <AtualizarMapa posicao={[posicao.lat, posicao.lon]} travar={travar} />
        </MapContainer>
      )}

      {info && (
        <footer className="footer-info">
          <p><strong>Altitude:</strong> {info.altitude.toFixed(2)} km</p>
          <p><strong>Velocidade:</strong> {info.velocity.toFixed(2)} km/h</p>
          <p><strong>Coordenadas:</strong> Lat {info.latitude.toFixed(2)}, Lon {info.longitude.toFixed(2)}</p>
          <p><strong>Visibilidade:</strong> {info.visibility}</p>
          <p><strong>Timestamp:</strong> {new Date(info.timestamp * 1000).toLocaleString()}</p>
  <div class="footer-content">
          <p>Desenvolvido por <a href="https://portfolio-aryb.vercel.app/" target="_blank"><strong>Igor Carlos Dias</strong></a></p>
          <p>Dados fornecidos por <a href="https://wheretheiss.at/" target="_blank"><strong> Where the ISS at?</strong></a></p>
  </div>
        </footer>
      )}
    </div>
  );
};

export default App;
