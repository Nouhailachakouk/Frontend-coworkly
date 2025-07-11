import React, { useState, useEffect } from 'react';
import { Filter, Calendar, Clock, Users } from 'lucide-react';

interface Reservation {
  id: number;
  spaceType: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const History: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/history');
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      const data = await response.json();
      setReservations(data);
      setFilteredReservations(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les réservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    let filtered = reservations;

    if (statusFilter !== 'Tous les statuts') {
      const map: Record<string, string> = {
        "Confirmées": "confirmed",
        "En attente": "pending",
        "Annulées": "cancelled"
      };
      filtered = filtered.filter(r => r.status === map[statusFilter]);
    }

    if (dateFilter) {
      filtered = filtered.filter(r => r.date === dateFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.spaceType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri par date + heure décroissante (dernière réservation en premier)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`);
      const dateB = new Date(`${b.date}T${b.startTime}`);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredReservations(filtered);
  }, [reservations, statusFilter, dateFilter, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 border-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 border-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 border-red-600 bg-red-100';
      default: return 'text-gray-600 border-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return '';
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const totalMinutes = (eh * 60 + em) - (sh * 60 + sm);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h > 0 ? `${h}h` : ''}${m > 0 ? `${m}min` : ''}`;
  };

  const cancelReservation = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8081/reservation/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de l'annulation");
      await fetchReservations();
      alert("Réservation annulée avec succès !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'annulation.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-b-2 border-red-600 rounded-full"></div>
        <span className="ml-4">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
        <div className="text-red-600 mb-4">❌ {error}</div>
        <button
          onClick={fetchReservations}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const stats = {
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
    total: reservations.length
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in bg-gray-50 min-h-screen">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-5 text-center">
          <div className="text-3xl font-extrabold text-green-600">{stats.confirmed}</div>
          <div className="text-gray-600 mt-1 uppercase tracking-wide">Confirmées</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 text-center">
          <div className="text-3xl font-extrabold text-yellow-600">{stats.pending}</div>
          <div className="text-gray-600 mt-1 uppercase tracking-wide">En attente</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 text-center">
          <div className="text-3xl font-extrabold text-red-600">{stats.cancelled}</div>
          <div className="text-gray-600 mt-1 uppercase tracking-wide">Annulées</div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 text-center">
          <div className="text-3xl font-extrabold text-blue-600">{stats.total}</div>
          <div className="text-gray-600 mt-1 uppercase tracking-wide">Total réservations</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-blue-600">
          <Filter className="w-5 h-5" />
          <span>Filtres et recherche</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par type d'espace"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full md:w-48 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option>Tous les statuts</option>
            <option>Confirmées</option>
            <option>En attente</option>
            <option>Annulées</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="w-full md:w-48 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="grid gap-4">
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
            <Calendar className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <p className="text-lg font-semibold">Aucune réservation trouvée</p>
            <p className="mt-2">
              {searchTerm || statusFilter !== 'Tous les statuts'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Vous n\'avez pas encore effectué de réservation'}
            </p>
          </div>
        ) : filteredReservations.map((r, i) => (
          <div
            key={r.id}
            className={`rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:scale-[1.02] transition-transform duration-200
              ${r.status === 'cancelled' ? 'border-l-4 border-red-600 bg-red-100 text-red-700 line-through' : 'bg-white'}
            `}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`flex items-center justify-center rounded-full w-10 h-10 border ${getStatusColor(r.status)} shrink-0`}>
                <span className="text-xs font-semibold">
                  {getStatusText(r.status).charAt(0)}
                </span>
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-semibold truncate">{r.spaceType}</h3>
                <div className="flex flex-wrap text-sm gap-4 mt-1" style={{ color: r.status === 'cancelled' ? '#b91c1c' : '#6b7280' }}>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>{r.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>{r.startTime} - {r.endTime} ({calculateDuration(r.startTime, r.endTime)})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-yellow-600" />
                    <span>{r.attendees} participant(s)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton Annuler uniquement si pas annulée */}
            <div className="flex gap-2 shrink-0">
              {r.status !== 'cancelled' && (
                <button
                  onClick={() => cancelReservation(r.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
