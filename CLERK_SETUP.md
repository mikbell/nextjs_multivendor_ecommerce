# Configurazione Clerk + Database

## ✅ Completato

Il progetto ha già la configurazione base per collegare Clerk al database MySQL tramite Prisma. Ecco cosa è stato implementato:

### 1. Webhook Route (`/src/api/webhooks/route.ts`)
- ✅ Gestisce eventi `user.created`, `user.updated`, `user.deleted`
- ✅ Sincronizza automaticamente i dati utente con il database
- ✅ Gestione errori migliorata
- ✅ Logging dettagliato per debug

### 2. Schema Database (`/prisma/schema.prisma`)
- ✅ Modello User con tutti i campi necessari
- ✅ Enum Role (USER, ADMIN, SELLER)
- ✅ Campi per e-commerce (isActive, phone)
- ✅ Preparato per relazioni future (orders, products, reviews)

### 3. Helper di Autenticazione (`/src/lib/auth.ts`)
- ✅ `getCurrentUser()` - Ottiene e sincronizza l'utente corrente
- ✅ `isAdmin()` - Verifica se l'utente è admin
- ✅ `isSeller()` - Verifica se l'utente è venditore
- ✅ `getCurrentUserId()` - Ottiene solo l'ID utente

### 4. Componenti UI
- ✅ `UserProfile` - Componente per il profilo utente
- ✅ `ProtectedRoute` - Protezione delle route
- ✅ `AdminRoute` e `SellerRoute` - Protezione basata sui ruoli

### 5. Middleware (`/src/middleware.ts`)
- ✅ Configurato per proteggere tutte le route necessarie

## 🔧 Passi da Completare

### 1. Variabili d'Ambiente
Assicurati che il tuo file `.env` contenga:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Database Configuration  
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

### 2. Comandi da Eseguire

```bash
# 1. Genera il client Prisma aggiornato
npx prisma generate

# 2. Applica le migrazioni al database
npx prisma db push

# 3. (Opzionale) Visualizza il database
npx prisma studio
```

### 3. Configurazione Clerk Dashboard

1. **Vai su [Clerk Dashboard](https://dashboard.clerk.com)**
2. **Seleziona il tuo progetto**
3. **Vai su "Webhooks" nel menu laterale**
4. **Clicca "Add Endpoint"**
5. **Configura:**
   - **Endpoint URL:** `https://tuodominio.com/api/webhooks`
   - **Eventi da ascoltare:**
     - `user.created`
     - `user.updated` 
     - `user.deleted`
6. **Copia il "Signing Secret" e aggiungilo come `CLERK_WEBHOOK_SIGNING_SECRET` nel tuo `.env`**

### 4. Test della Configurazione

```bash
# Avvia il server di sviluppo
npm run dev

# Testa la registrazione di un nuovo utente
# Controlla i log della console per vedere i webhook
# Verifica nel database che l'utente sia stato creato
```

## 📝 Utilizzo nei Componenti

### Ottenere l'utente corrente
```tsx
import { getCurrentUser } from "@/lib/auth";

export default async function MyPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <div>Non autenticato</div>;
  }
  
  return <div>Ciao {user.firstName}!</div>;
}
```

### Proteggere una route
```tsx
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function PrivatePage() {
  return (
    <ProtectedRoute>
      <div>Contenuto privato</div>
    </ProtectedRoute>
  );
}
```

### Componente profilo utente
```tsx
import { UserProfile } from "@/components/auth/user-profile";

export default function Header() {
  return (
    <header>
      <UserProfile showFullProfile={true} />
    </header>
  );
}
```

## 🚀 Prossimi Passi

1. **Implementa i modelli per prodotti e ordini**
2. **Aggiungi gestione dei ruoli utente**
3. **Crea dashboard admin/venditore**
4. **Implementa sistema di notifiche**

## 🐛 Troubleshooting

### Errore "Webhook verification failed"
- Verifica che `CLERK_WEBHOOK_SIGNING_SECRET` sia corretto
- Controlla che l'URL del webhook sia accessibile pubblicamente

### Errore database connection
- Verifica che `DATABASE_URL` sia corretto
- Assicurati che il database MySQL sia in esecuzione
- Controlla le credenziali di accesso

### TypeScript errors su Prisma
- Esegui `npx prisma generate` per rigenerare il client
- Riavvia il server TypeScript nell'IDE
