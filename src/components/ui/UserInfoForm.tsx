import React, { useState } from "react";

interface UserInfoData {
  profession: string;
  secteur: string;
  frequences: string;
  espacesUtilises: string[];
  equipementsPref: string[];
  suggestions: string;
}

interface Props {
  onSubmit: (data: UserInfoData) => void;
}

const coworkingSpaces = [
  "Salle de réunion",
  "Bureau privé",
  "Espace ouvert",
  "Salle de présentation",
  "Espace créatif",
  "Cabine téléphonique",
  "Salon détente",
];

const equipementsOptions = [
  "Wifi",
  "Prises électriques",
  "Café",
  "Imprimante",
];

const UserInfoFormModalWithButton: React.FC<Props> = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [profession, setProfession] = useState("");
  const [secteur, setSecteur] = useState("");
  const [frequences, setFrequences] = useState("");
  const [espacesUtilises, setEspacesUtilises] = useState<string[]>([]);
  const [equipementsPref, setEquipementsPref] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState("");

  const toggleCheckbox = (
    val: string,
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (arr.includes(val)) setArr(arr.filter((v) => v !== val));
    else setArr([...arr, val]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profession || !secteur || !frequences) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }
    onSubmit({ profession, secteur, frequences, espacesUtilises, equipementsPref, suggestions });
    setSubmitted(true);
    // Ne pas fermer le modal pour afficher le message ici
  };

  return (
    <>
      {/* Bouton visible au départ */}
      {!open && !submitted && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full px-6 py-3 shadow-lg animate-pulse focus:outline-none focus:ring-4 focus:ring-red-400"
            title="Remplis-moi pour améliorer ton espace coworking !"
          >
            N&apos;oublie pas de me remplir pour améliorer ton espace coworking 😊
          </button>
        </div>
      )}

      {/* Modal formulaire ou message */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-3xl w-full p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
            >
              &times;
            </button>

            {!submitted ? (
              <>
                <h3 className="text-2xl font-bold mb-6 text-red-700">Ton expérience dans coWorky</h3>
                <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
                  <div>
                    <label className="block font-semibold mb-1" htmlFor="profession">
                      Profession <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="profession"
                      type="text"
                      required
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="Ex: Entrepreneur, Freelance, Consultant"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1" htmlFor="secteur">
                      Secteur d&apos;activité <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="secteur"
                      type="text"
                      required
                      value={secteur}
                      onChange={(e) => setSecteur(e.target.value)}
                      placeholder="Ex: Tech, Marketing, Design..."
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1" htmlFor="frequences">
                      Fréquence de visite (hebdomadaire, mensuelle...) <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="frequences"
                      type="text"
                      required
                      value={frequences}
                      onChange={(e) => setFrequences(e.target.value)}
                      placeholder="Ex: 3 fois par semaine, 1 fois par mois"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <p className="block font-semibold mb-2">Espaces utilisés (plusieurs choix possibles)</p>
                    <div className="flex flex-wrap gap-3">
                      {coworkingSpaces.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center space-x-2 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={espacesUtilises.includes(opt)}
                            onChange={() => toggleCheckbox(opt, espacesUtilises, setEspacesUtilises)}
                            className="form-checkbox h-5 w-5 text-red-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="block font-semibold mb-2">Équipements préférés (plusieurs choix possibles)</p>
                    <div className="flex flex-wrap gap-3">
                      {equipementsOptions.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center space-x-2 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={equipementsPref.includes(opt)}
                            onChange={() => toggleCheckbox(opt, equipementsPref, setEquipementsPref)}
                            className="form-checkbox h-5 w-5 text-red-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1" htmlFor="suggestions">
                      Suggestions d&apos;amélioration (optionnel)
                    </label>
                    <textarea
                      id="suggestions"
                      rows={4}
                      value={suggestions}
                      onChange={(e) => setSuggestions(e.target.value)}
                      placeholder="Nous aimerions connaître vos idées ou remarques..."
                      className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-extrabold rounded-lg shadow-lg transition"
                  >
                    Envoyer mes infos
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center text-gray-900">
                <h3 className="text-2xl font-bold mb-4 text-red-700">Merci !</h3>
                <p>
                  Les informations sont bien enregistrées.<br />
                  Merci pour votre aide pour une expérience plus enrichissante.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 py-2 px-6 bg-red-700 text-white rounded hover:bg-red-800 transition"
                >
                  Modifier mes infos
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </>
  );
};

export default UserInfoFormModalWithButton;
