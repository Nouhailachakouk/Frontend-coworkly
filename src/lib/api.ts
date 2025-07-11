// src/lib/api.ts
const API_BASE = 'http://localhost:8080/api';

export async function getSpaces() {
  const res = await fetch(`${API_BASE}/spaces`);
  if (!res.ok) throw new Error('Erreur lors du chargement des espaces');
  return res.json();
}

export async function createReservation(data: any) {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur lors de la création de la réservation');
  return res.json();
}
