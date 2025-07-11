
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Users, MessageSquare, BarChart3, PieChart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import {
  mockOccupancyData,
  mockUserClusters,
  mockSentimentData,
} from "@/data/mockData";

export function Insights() {
  // Données pour les prédictions d'occupation
  const occupancyForecast = mockOccupancyData.slice(3, 10);
  
  // Données de sentiment consolidées
  const avgSentiment = mockSentimentData.reduce(
    (acc, day) => ({
      positive: acc.positive + day.positive,
      neutral: acc.neutral + day.neutral,
      negative: acc.negative + day.negative,
    }),
    { positive: 0, neutral: 0, negative: 0 }
  );

  const totalResponses = mockSentimentData.length;
  const sentimentAvg = {
    positive: Math.round(avgSentiment.positive / totalResponses),
    neutral: Math.round(avgSentiment.neutral / totalResponses),
    negative: Math.round(avgSentiment.negative / totalResponses),
  };

  const recommendations = [
    {
      title: "Optimisation des créneaux",
      description: "Les mardis et jeudis affichent une forte demande. Considérez l'ouverture d'espaces supplémentaires.",
      priority: "high",
      impact: "Augmentation prévue de 15% des réservations"
    },
    {
      title: "Amélioration de l'expérience",
      description: "Les entrepreneurs préfèrent les espaces ouverts avec plus de prises électriques.",
      priority: "medium",
      impact: "Score de satisfaction +0.3"
    },
    {
      title: "Nouveau service",
      description: "Forte demande pour des espaces de créativité avec matériel de brainstorming.",
      priority: "low",
      impact: "Nouveau segment de marché potentiel"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-white-100 text-white-800 border-white-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header avec titre */}
      <Card className="gradient-card border-0 text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 gradient-primary rounded-full">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-cowork-blue-600 to-cowork-purple-600 bg-clip-text text-transparent">
              Insights Intelligence Artificielle
            </CardTitle>
          </div>
          <p className="text-muted-foreground">
            Analyses et prédictions basées sur l'IA pour optimiser votre espace de coworking
          </p>
        </CardHeader>
      </Card>

      {/* Prédictions d'occupation */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cowork-blue-600" />
            Prédictions d'occupation (7 prochains jours)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Algorithme basé sur l'historique et les tendances saisonnières
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={occupancyForecast}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { 
                  weekday: 'short',
                  day: 'numeric' 
                })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
                formatter={(value: number) => [`${value}%`, 'Taux d\'occupation prévu']}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#occupancyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {Math.max(...occupancyForecast.map(d => d.predicted))}%
              </div>
              <div className="text-xs text-muted-foreground">Pic prévu</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {Math.round(occupancyForecast.reduce((sum, d) => sum + d.predicted, 0) / occupancyForecast.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Moyenne</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">Mardi</div>
              <div className="text-xs text-muted-foreground">Jour le plus chargé</div>
            </div>
            <div className="text-center p-3 bg-white-50 rounded-lg">
              <div className="text-lg font-bold text-white-600">92%</div>
              <div className="text-xs text-muted-foreground">Précision IA</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clustering des utilisateurs */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cowork-purple-600" />
              Profils utilisateurs (IA Clustering)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Segmentation automatique basée sur les comportements de réservation
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  dataKey="count"
                  data={mockUserClusters}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                >
                  {mockUserClusters.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Utilisateurs']} />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {mockUserClusters.map((cluster) => (
                <div key={cluster.type} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cluster.color }}
                    ></div>
                    <span className="text-sm font-medium">{cluster.type}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {cluster.count} ({cluster.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analyse de sentiment */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Analyse de sentiment
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Traitement automatique des retours clients par IA
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-green-600">{sentimentAvg.positive}%</div>
                  <div className="text-sm text-muted-foreground">Retours positifs</div>
                </div>
                <div className="text-green-600">😊</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-gray-600">{sentimentAvg.neutral}%</div>
                  <div className="text-sm text-muted-foreground">Retours neutres</div>
                </div>
                <div className="text-gray-600">😐</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-red-600">{sentimentAvg.negative}%</div>
                  <div className="text-sm text-muted-foreground">Retours négatifs</div>
                </div>
                <div className="text-red-600">😞</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Évolution du sentiment</h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={mockSentimentData.slice(-7)}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: 'numeric' })}
                  />
                  <YAxis hide />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                  />
                  <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommandations IA */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-white-600" />
            Recommandations IA
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Suggestions d'amélioration basées sur l'analyse des données
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:scale-[1.02] transition-transform bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority === 'high' ? 'Priorité haute' : 
                     rec.priority === 'medium' ? 'Priorité moyenne' : 'Priorité faible'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                <div className="text-xs text-blue-600 font-medium">
                  Impact prévu : {rec.impact}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
