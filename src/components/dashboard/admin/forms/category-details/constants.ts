// Form validation constants
export const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MIN_LENGTH: 20,
  DESCRIPTION_MAX_LENGTH: 500,
  SLUG_MIN_LENGTH: 2,
  SLUG_MAX_LENGTH: 50,
  URL_MIN_LENGTH: 3,
} as const;

// Progress tracking constants
export const PROGRESS_THRESHOLDS = {
  EXCELLENT: 100,
  GOOD: 80,
  FAIR: 60,
  POOR: 40,
  MINIMAL: 20,
} as const;

// Form step configuration
export const FORM_STEPS = {
  IMAGE: {
    id: 'image',
    title: 'Immagine',
    description: 'Immagine rappresentativa',
    weight: 20,
  },
  BASIC_INFO: {
    id: 'basic-info',
    title: 'Informazioni Base',
    description: 'Nome, slug e URL',
    weight: 30,
  },
  DESCRIPTION: {
    id: 'description',
    title: 'Descrizione',
    description: 'Descrizione dettagliata',
    weight: 30,
  },
  SETTINGS: {
    id: 'settings',
    title: 'Impostazioni',
    description: 'Configurazioni avanzate',
    weight: 20,
  },
} as const;

// UI Constants
export const STYLES = {
  CARD_BASE: "backdrop-blur-sm rounded-3xl shadow-lg border border-border p-8 hover:shadow-xl transition-all duration-300",
  GRADIENT_BLUE: "bg-gradient-to-r from-blue-500 to-indigo-500",
  GRADIENT_PURPLE: "bg-gradient-to-r from-purple-500 to-pink-500",
  GRADIENT_ORANGE: "bg-gradient-to-r from-orange-500 to-red-500",
  GRADIENT_GREEN: "bg-gradient-to-r from-green-500 to-emerald-500",
} as const;

// Messages
export const MESSAGES = {
  VALIDATION: {
    NAME_REQUIRED: "Il nome della categoria è obbligatorio",
    NAME_TOO_SHORT: `Il nome deve essere almeno ${VALIDATION_LIMITS.NAME_MIN_LENGTH} caratteri`,
    NAME_TOO_LONG: `Il nome deve essere massimo ${VALIDATION_LIMITS.NAME_MAX_LENGTH} caratteri`,
    DESCRIPTION_TOO_SHORT: `La descrizione deve essere almeno ${VALIDATION_LIMITS.DESCRIPTION_MIN_LENGTH} caratteri`,
    DESCRIPTION_TOO_LONG: `La descrizione deve essere massimo ${VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH} caratteri`,
    SLUG_REQUIRED: "Lo slug è obbligatorio",
    URL_REQUIRED: "L'URL è obbligatorio",
  },
  PROGRESS: {
    COMPLETE: "Categoria completa e pronta!",
    ALMOST_COMPLETE: "Quasi completata! Mancano pochi dettagli",
    GOOD_PROGRESS: "Buon progresso, continua così",
    MAKING_PROGRESS: "Stai facendo bene, aggiungi altri dettagli",
    GETTING_STARTED: "Hai iniziato bene, continua a compilare",
    JUST_STARTED: "Inizia compilando i campi principali",
  },
  SUCCESS: {
    CATEGORY_CREATED: "Categoria creata con successo",
    CATEGORY_UPDATED: "Categoria aggiornata con successo",
  },
  ERRORS: {
    MISSING_ESSENTIAL: "Completa i campi essenziali",
    MISSING_IMPORTANT: "Aggiungi anche i campi importanti",
    VALIDATION_ERROR: "Controlla i campi evidenziati in rosso",
    SAVE_ERROR: "Errore durante il salvataggio della categoria",
  },
} as const;