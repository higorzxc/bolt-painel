export default async function handler(req, res) {
  if (req.method === 'GET') {  // Mudamos para GET, pois queremos buscar o QR Code
    try {
      // Fazendo a requisição para o Venom-Backend através da URL gerada pelo Cloudflare Tunnel
      const response = await fetch('https://dispatched-objects-informational-camcorder.trycloudflare.com/qr');  // URL do Cloudflare Tunnel

      // Verifica se a resposta é válida
      if (response.ok) {
        const data = await response.json();  // Pega o QR Code da resposta JSON
        res.status(200).json({ qrCode: data.qrCode });  // Retorna o QR Code para o painel
      } else {
        res.status(500).json({ error: 'Erro ao buscar QR Code do Venom-Backend' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro na requisição ao Venom-Backend' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });  // Se não for GET, retorna erro de método não permitido
  }
}
