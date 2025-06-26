import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Conecta com o backend no Render via socket
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
});

export default function QRCodeDisplay() {
  const [qrCode, setQrCode] = useState("");
  const [status, setStatus] = useState("Conectando ao bot...");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🔌 Conectado ao backend");
      setStatus("Aguardando QR Code...");
    });

    socket.on("qr", (data) => {
      console.log("📲 QR Code recebido:", data.qr);
      setQrCode(data.qr);
      setStatus("Escaneie o QR Code abaixo:");
    });

    socket.on("disconnect", () => {
      console.log("❌ Desconectado do backend");
      setStatus("Desconectado do bot");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>{status}</h2>
      {qrCode ? (
        <img
          src={`data:image/png;base64,${qrCode}`}
          alt="QR Code"
          style={{ width: 300, height: 300 }}
        />
      ) : (
        <p>...</p>
      )}
    </div>
  );
}
