
export interface Reservation {
  id: string;
  spaceType: string;
  spaceName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  attendees: number;
}

export interface OccupancyData {
  date: string;
  predicted: number;
  actual?: number;
}

export interface UserCluster {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface DashboardStats {
  totalReservations: number;
  activeSpaces: number;
  occupancyRate: number;
  satisfaction: number;
}

// Données fictives pour les réservations
export const mockReservations: Reservation[] = [
  {
    id: '1',
    spaceType: 'Salle de réunion',
    spaceName: 'Meeting Room A',
    date: '2024-06-17',
    startTime: '09:00',
    endTime: '11:00',
    status: 'confirmed',
    attendees: 6
  },
  {
    id: '2',
    spaceType: 'Bureau privé',
    spaceName: 'Private Office 3',
    date: '2024-06-18',
    startTime: '14:00',
    endTime: '18:00',
    status: 'confirmed',
    attendees: 2
  },
  {
    id: '3',
    spaceType: 'Espace créatif',
    spaceName: 'Creative Hub',
    date: '2024-06-19',
    startTime: '10:00',
    endTime: '12:00',
    status: 'pending',
    attendees: 4
  },
  {
    id: '4',
    spaceType: 'Salle de présentation',
    spaceName: 'Presentation Hall',
    date: '2024-06-15',
    startTime: '15:00',
    endTime: '17:00',
    status: 'cancelled',
    attendees: 12
  },
  {
    id: '5',
    spaceType: 'Salle de réunion',
    spaceName: 'Meeting Room B',
    date: '2024-06-14',
    startTime: '11:00',
    endTime: '13:00',
    status: 'confirmed',
    attendees: 8
  }
];

// Données de prédiction d'occupation
export const mockOccupancyData: OccupancyData[] = [
  { date: '2024-06-16', predicted: 75, actual: 78 },
  { date: '2024-06-17', predicted: 82, actual: 85 },
  { date: '2024-06-18', predicted: 68, actual: 71 },
  { date: '2024-06-19', predicted: 90 },
  { date: '2024-06-20', predicted: 95 },
  { date: '2024-06-21', predicted: 88 },
  { date: '2024-06-22', predicted: 45 },
  { date: '2024-06-23', predicted: 38 },
  { date: '2024-06-24', predicted: 92 },
  { date: '2024-06-25', predicted: 87 }
];

// Données de clustering des utilisateurs
export const mockUserClusters: UserCluster[] = [
  { type: 'Entrepreneurs', count: 156, percentage: 35, color: '#3b82f6' },
  { type: 'Freelancers', count: 124, percentage: 28, color: '#8b5cf6' },
  { type: 'Équipes startup', count: 89, percentage: 20, color: '#06b6d4' },
  { type: 'Consultants', count: 67, percentage: 15, color: '#10b981' },
  { type: 'Autres', count: 9, percentage: 2, color: '#f59e0b' }
];

// Données d'analyse de sentiment
export const mockSentimentData: SentimentData[] = [
  { date: '2024-06-10', positive: 78, neutral: 18, negative: 4 },
  { date: '2024-06-11', positive: 82, neutral: 15, negative: 3 },
  { date: '2024-06-12', positive: 75, neutral: 20, negative: 5 },
  { date: '2024-06-13', positive: 88, neutral: 10, negative: 2 },
  { date: '2024-06-14', positive: 85, neutral: 12, negative: 3 },
  { date: '2024-06-15', positive: 79, neutral: 16, negative: 5 },
  { date: '2024-06-16', positive: 91, neutral: 8, negative: 1 }
];

// Statistiques du dashboard
export const mockDashboardStats: DashboardStats = {
  totalReservations: 1247,
  activeSpaces: 24,
  occupancyRate: 78,
  satisfaction: 4.6
};

// Types d'espaces disponibles
export const spaceTypes = [
  'Salle de réunion',
  'Bureau privé',
  'Espace ouvert',
  'Salle de présentation',
  'Espace créatif',
  'Cabine téléphonique',
  'Salon détente'
];

// Créneaux horaires
export const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];
