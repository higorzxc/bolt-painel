import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Substitua pela URL DO SEU BACKEND NO RENDER
const socket = io("https://venom-backend-pftc.onrender.com", {
  transports: ["websocket"],
});

export default function QRCodeDisplay() {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🔌 Conectado ao backend");
    });

    socket.on("qr", (data) => {
      console.log("📲 QR Code recebido:", data.qr);
      setQrCode(data.qr);
    });

    socket.on("disconnect", () => {
      console.log("❌ Desconectado do backend");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Escaneie o QR Code</h2>
      {qrCode ? (
        <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
      ) : (
        <p>Aguardando QR Code...</p>
      )}
    </div>
  );
}
