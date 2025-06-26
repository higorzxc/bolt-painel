import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Message, BotFlow, RemarketingFlow, Campaign, BotConfig, Statistics } from '../types';
import toast from 'react-hot-toast';

interface AppContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;  // Alterado para Promise<boolean>
  logout: () => void;
  isWhatsAppConnected: boolean;
  qrCode: string | null;
  connectWhatsApp: () => Promise<void>;
  disconnectWhatsApp: () => void;
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  moveClientToCategory: (clientId: string, category: Client['category']) => void;
  messages: Message[];
  sendMessage: (clientId: string, content: string, type: Message['type'], mediaUrl?: string) => void;
  botFlows: BotFlow[];
  addBotFlow: (flow: Omit<BotFlow, 'id'>) => void;
  updateBotFlow: (id: string, updates: Partial<BotFlow>) => void;
  deleteBotFlow: (id: string) => void;
  remarketingFlows: RemarketingFlow[];
  addRemarketingFlow: (flow: Omit<RemarketingFlow, 'id'>) => void;
  updateRemarketingFlow: (id: string, updates: Partial<RemarketingFlow>) => void;
  deleteRemarketingFlow: (id: string) => void;
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  botConfig: BotConfig;
  updateBotConfig: (updates: Partial<BotConfig>) => void;
  statistics: Statistics;
  updateStatistics: () => void;
  publicChatUrl: string;
  updatePublicChatUrl: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (undefined === context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '+5511999887766',
    category: 'not_bought',
    lastMessage: 'Olá, tenho interesse no produto',
    lastActivity: new Date(),
    status: 'active',
    campaignSource: 'Facebook Ads'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [messages, setMessages] = useState<Message[]>([]);
  const [botFlows, setBotFlows] = useState<BotFlow[]>([]);
  const [remarketingFlows, setRemarketingFlows] = useState<RemarketingFlow[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [publicChatUrl, setPublicChatUrl] = useState<string>('');
  const [botConfig, setBotConfig] = useState<BotConfig>({
    attendantName: 'Assistente Virtual',
    welcomeAudio: true,
    autoResponse: true,
    allowClientAudio: true,
    allowClientVideo: true,
    allowClientImages: true
  });
  const [statistics, setStatistics] = useState<Statistics>({
    totalConversations: 0,
    activeConversations: 0,
    abandonedConversations: 0,
    responseRate: 0,
    conversionRate: 0,
    dailyMessages: 0
  });

  useEffect(() => {
    const auth = localStorage.getItem('zapbot_auth');
    if (auth === 'true') setIsAuthenticated(true);
    const savedConfig = localStorage.getItem('zapbot_config');
    if (savedConfig) setBotConfig(JSON.parse(savedConfig));
    const savedChatUrl = localStorage.getItem('zapbot_public_chat_url');
    if (savedChatUrl) setPublicChatUrl(savedChatUrl);
    const savedWhatsAppConnection = localStorage.getItem('zapbot_whatsapp_connected');
    if (savedWhatsAppConnection === 'true') setIsWhatsAppConnected(true);
    updateStatistics();
  }, []);

  // Login corrigido para chamar o backend
  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        toast.error('Senha incorreta ou erro no servidor!');
        return false;
      }

      setIsAuthenticated(true);
      localStorage.setItem('zapbot_auth', 'true');
      toast.success('Login realizado com sucesso!');
      return true;

    } catch (error) {
      console.error('Erro na comunicação com o backend:', error);
      toast.error('Erro ao conectar com o servidor!');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('zapbot_auth');
    toast.success('Logout realizado com sucesso!');
  };

  const connectWhatsApp = async (): Promise<void> => {
    try {
      setQrCode('loading');
      toast.loading('Conectando ao servidor do bot...', { id: 'qr' });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/qr`);
      const data = await response.json();

      if (data.qrCode) {
        setQrCode(data.qrCode);
        toast.success('QR Code recebido com sucesso!', { id: 'qr' });
      } else {
        throw new Error("QR Code não recebido");
      }
    } catch (error) {
      console.error("Erro ao conectar com o backend:", error);
      toast.error('Erro ao conectar com o bot', { id: 'qr' });
      setQrCode(null);
    }
  };

  const disconnectWhatsApp = () => {
    setIsWhatsAppConnected(false);
    setQrCode(null);
    localStorage.removeItem('zapbot_whatsapp_connected');
    toast.success('WhatsApp Business desconectado');
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: generateId() };
    setClients(prev => [...prev, newClient]);
    toast.success('Cliente adicionado com sucesso!');
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => client.id === id ? { ...client, ...updates } : client));
    toast.success('Cliente atualizado com sucesso!');
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    setMessages(prev => prev.filter(message => message.clientId !== id));
    toast.success('Cliente removido com sucesso!');
  };

  const moveClientToCategory = (clientId: string, category: Client['category']) => {
    updateClient(clientId, { category });
  };

  const sendMessage = (clientId: string, content: string, type: Message['type'], mediaUrl?: string) => {
    const newMessage: Message = {
      id: generateId(),
      clientId,
      content,
      type,
      sender: 'admin',
      timestamp: new Date(),
      mediaUrl,
      isRead: false
    };
    setMessages(prev => [...prev, newMessage]);
    toast.success('Mensagem enviada!');
  };

  const addBotFlow = (flow: Omit<BotFlow, 'id'>) => {
    const newFlow = { ...flow, id: generateId() };
    setBotFlows(prev => [...prev, newFlow]);
    toast.success('Fluxo criado com sucesso!');
  };

  const updateBotFlow = (id: string, updates: Partial<BotFlow>) => {
    setBotFlows(prev => prev.map(flow => flow.id === id ? { ...flow, ...updates } : flow));
    toast.success('Fluxo atualizado com sucesso!');
  };

  const deleteBotFlow = (id: string) => {
    setBotFlows(prev => prev.filter(flow => flow.id !== id));
    toast.success('Fluxo removido com sucesso!');
  };

  const addRemarketingFlow = (flow: Omit<RemarketingFlow, 'id'>) => {
    const newFlow = { ...flow, id: generateId() };
    setRemarketingFlows(prev => [...prev, newFlow]);
    if (flow.campaignId) updateCampaign(flow.campaignId, { remarketingFlowId: newFlow.id });
    toast.success('Fluxo de remarketing criado com sucesso!');
  };

  const updateRemarketingFlow = (id: string, updates: Partial<RemarketingFlow>) => {
    setRemarketingFlows(prev => prev.map(flow => flow.id === id ? { ...flow, ...updates } : flow));
    toast.success('Fluxo de remarketing atualizado com sucesso!');
  };

  const deleteRemarketingFlow = (id: string) => {
    const flow = remarketingFlows.find(f => f.id === id);
    if (flow && flow.campaignId) updateCampaign(flow.campaignId, { remarketingFlowId: undefined });
    setRemarketingFlows(prev => prev.filter(flow => flow.id !== id));
    toast.success('Fluxo de remarketing removido com sucesso!');
  };

  const addCampaign = (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign = {
      ...campaign,
      id: generateId(),
      sentCount: 0,
      openCount: 0,
      status: 'draft' as const
    };
    setCampaigns(prev => [...prev, newCampaign]);
    toast.success('Campanha criada com sucesso!');
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(campaign => campaign.id === id ? { ...campaign, ...updates } : campaign));
    if (!updates.remarketingFlowId && updates.remarketingFlowId !== undefined) {
      toast.success('Campanha atualizada com sucesso!');
    }
  };

  const deleteCampaign = (id: string) => {
    const associatedFlows = remarketingFlows.filter(flow => flow.campaignId === id);
    associatedFlows.forEach(flow => {
      setRemarketingFlows(prev => prev.filter(f => f.id !== flow.id));
    });
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    toast.success('Campanha removida com sucesso!');
  };

  const updateBotConfig = (updates: Partial<BotConfig>) => {
    const newConfig = { ...botConfig, ...updates };
    setBotConfig(newConfig);
    localStorage.setItem('zapbot_config', JSON.stringify(newConfig));
    toast.success('Configuração salva com sucesso!');
  };

  const updatePublicChatUrl = (url: string) => {
    setPublicChatUrl(url);
    localStorage.setItem('zapbot_public_chat_url', url);
    toast.success('URL do chat público salva com sucesso!');
  };

  const updateStatistics = () => {
    const totalConversations = clients.length;
    const activeConversations = clients.filter(c => c.status === 'active').length;
    const abandonedConversations = clients.filter(c => c.status === 'abandoned').length;
    const responseRate = totalConversations > 0 ? (activeConversations / totalConversations) * 100 : 0;
    const conversionRate = totalConversations > 0 ? (clients.filter(c => c.category !== 'not_bought').length / totalConversations) * 100 : 0;

    setStatistics({
      totalConversations,
      activeConversations,
      abandonedConversations,
      responseRate,
      conversionRate,
      dailyMessages: messages.filter(m =>
        new Date(m.timestamp).toDateString() === new Date().toDateString()
      ).length
    });
  };

  useEffect(() => {
    updateStatistics();
  }, [clients, messages]);

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      isWhatsAppConnected,
      qrCode,
      connectWhatsApp,
      disconnectWhatsApp,
      clients,
      addClient,
      updateClient,
      deleteClient,
      moveClientToCategory,
      messages,
      sendMessage,
      botFlows,
      addBotFlow,
      updateBotFlow,
      deleteBotFlow,
      remarketingFlows,
      addRemarketingFlow,
      updateRemarketingFlow,
      deleteRemarketingFlow,
      campaigns,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      botConfig,
      updateBotConfig,
      statistics,
      updateStatistics,
      publicChatUrl,
      updatePublicChatUrl
    }}>
      {children}
    </AppContext.Provider>
  );
};
