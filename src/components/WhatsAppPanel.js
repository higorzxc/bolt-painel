import React, { useState, useEffect } from 'react';

const WhatsAppPanel = () => {
  const [qrCode, setQrCode] = useState(null);

  // UseEffect para buscar o QR Code da API na Vercel
  useEffect(() => {
    // Fazer a requisição para pegar o QR Code
    fetch('/api/qr-code')
      .then((response) => response.json()) // Espera o JSON
      .then((data) => setQrCode(data.qrCode)) // Define o QR Code no estado
      .catch((error) => console.error('Erro ao buscar QR Code:', error)); // Trata o erro
  }, []); // O array vazio significa que isso será executado apenas uma vez, ao carregar o componente

  return (
    <div>
      <h3>WhatsApp - QR Code</h3>
      {qrCode ? (
        // Se o QR Code existir, exibe ele
        <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
      ) : (
        // Se não tiver QR Code, mostra um texto de carregamento
        <p>Aguardando QR Code...</p>
      )}
    </div>
  );
};

export default WhatsAppPanel;
