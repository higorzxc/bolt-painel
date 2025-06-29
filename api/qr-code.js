export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { qrCode } = req.body; // Pegando o QR Code enviado no corpo da requisição

    // Aqui você pode salvar o QR Code em uma variável, banco de dados ou apenas retornar ele
    console.log("QR Code recebido:", qrCode);

    // Para esse exemplo, vamos apenas retornar o QR Code como resposta
    res.status(200).json({ qrCode });
  } else {
    // Caso o método não seja POST, respondemos com erro
    res.status(405).json({ message: 'Método não permitido' });
  }
}
