import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Conecta com o backend via socket
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"]
});

export default function QRCodeDisplay() {
  const [qrCode, setQrCode] = useState("");
  const [status, setStatus] = useState("Conectando ao bot...");

  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Conectado ao backend");
      setStatus("Aguardando QR Code...");
    };

    const handleQr = (data) => {
      console.log("📲 QR Code recebido:", data.qr);
      setQrCode(data.qr);
      setStatus("Escaneie o QR Code abaixo:");
    };

    const handleDisconnect = () => {
      console.log("❌ Desconectado do backend");
      setStatus("Desconectado do bot");
    };

    socket.on("connect", handleConnect);
    socket.on("qr", handleQr);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("qr", handleQr);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>{status}</h2>
      {qrCode ? (
        <img
          src={`data:image/png;base64,${qrCode}`}
          alt="QR Code"
          style={{ width: 300, height: 300 }}
        />
      ) : (
        <p>Carregando QR Code...</p>
      )}
    </div>
  );
}
