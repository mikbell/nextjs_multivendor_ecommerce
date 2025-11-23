# Configurazione Webhook Clerk

Questo documento spiega come configurare il webhook di Clerk per assicurarsi che tutti i nuovi utenti abbiano il ruolo `USER` impostato nei loro `privateMetadata`.

## 🎯 Obiettivo

Quando un utente si registra su GoShop, deve automaticamente ricevere il ruolo `USER` in Clerk, che viene poi sincronizzato con il database.

## 📋 Prerequisiti

- Account Clerk configurato
- Progetto Next.js in esecuzione
- Variabili d'ambiente configurate nel file `.env`

## 🔧 Configurazione del Webhook su Clerk Dashboard

### 1. Accedi a Clerk Dashboard

Vai su [https://dashboard.clerk.com](https://dashboard.clerk.com) e seleziona il tuo progetto.

### 2. Naviga alla sezione Webhooks

1. Nel menu laterale, clicca su **Webhooks**
2. Clicca su **Add Endpoint**

### 3. Configura l'Endpoint

**URL dell'Endpoint:**
- **Sviluppo locale**: Usa [ngrok](https://ngrok.com) o [localtunnel](https://localtunnel.github.io/www/) per esporre il tuo localhost
  ```
  https://your-ngrok-url.ngrok.io/api/webhooks
  ```

- **Produzione**:
  ```
  https://your-domain.com/api/webhooks
  ```

**Eventi da sottoscrivere:**
- ✅ `user.created` (OBBLIGATORIO)
- ✅ `user.updated` (CONSIGLIATO)
- ✅ `user.deleted` (OPZIONALE)

### 4. Copia il Signing Secret

1. Dopo aver creato l'endpoint, Clerk genererà un **Signing Secret**
2. Copialo e aggiungilo al file `.env`:
   ```env
   CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxxxxxxxxxxxxxxx
   ```

## 🧪 Test del Webhook

### Test Locale con ngrok

1. Installa ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

3. In un altro terminale, esponi la porta locale:
   ```bash
   ngrok http 3000
   ```

4. Copia l'URL HTTPS generato da ngrok (es: `https://abc123.ngrok.io`)

5. Vai su Clerk Dashboard → Webhooks → Il tuo endpoint

6. Aggiorna l'URL con: `https://abc123.ngrok.io/api/webhooks`

7. Clicca su **Send Test Event** → Seleziona `user.created`

8. Verifica i log della tua applicazione per confermare la ricezione

### Test Manuale

1. Registra un nuovo utente tramite l'interfaccia di sign-up

2. Verifica nei log del server:
   ```
   New user created with role USER: user_xxxxxxxxxxxxx
   ```

3. Verifica nel database che l'utente sia stato creato con `role: "USER"`

4. Verifica su Clerk Dashboard → Users → Seleziona l'utente → Metadata che contenga:
   ```json
   {
     "privateMetadata": {
       "role": "USER"
     }
   }
   ```

## 🔍 Verifica della Configurazione

### Controlla le Variabili d'Ambiente

Assicurati che il file `.env` contenga:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxxxxxxxxxx

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Verifica il Database

Controlla che la tabella `users` abbia il campo `role` con il tipo corretto:

```sql
SELECT id, email, role FROM users ORDER BY "createdAt" DESC LIMIT 5;
```

Tutti i nuovi utenti dovrebbero avere `role = 'USER'`.

## 🐛 Troubleshooting

### Il webhook non viene ricevuto

1. **Verifica l'URL dell'endpoint**: Deve essere accessibile pubblicamente
2. **Controlla i log di Clerk**: Dashboard → Webhooks → Il tuo endpoint → Delivery Logs
3. **Verifica il Signing Secret**: Deve corrispondere tra `.env` e Clerk Dashboard
4. **Controlla i firewall**: Assicurati che non blocchino le richieste da Clerk

### L'utente viene creato senza ruolo

1. **Verifica che il webhook `user.created` sia attivo**
2. **Controlla i log del server** per errori
3. **Verifica che `CLERK_WEBHOOK_SIGNING_SECRET` sia configurato correttamente**

### Errore "Invalid webhook signature"

1. **Rigenera il Signing Secret** su Clerk Dashboard
2. **Aggiorna il valore in `.env`**
3. **Riavvia il server**

### L'utente ha role null in Clerk

1. Il webhook potrebbe non essere stato processato correttamente
2. Usa la funzione `initializeNewUserRole()` manualmente:
   ```typescript
   import { initializeNewUserRole } from '@/lib/clerk-utils';

   await initializeNewUserRole(userId);
   ```

## 📚 Risorse Utili

- [Clerk Webhooks Documentation](https://clerk.com/docs/integrations/webhooks)
- [Clerk User Metadata](https://clerk.com/docs/users/metadata)
- [ngrok Documentation](https://ngrok.com/docs)

## ✅ Checklist di Configurazione

- [ ] Webhook creato su Clerk Dashboard
- [ ] Eventi `user.created`, `user.updated`, `user.deleted` selezionati
- [ ] `CLERK_WEBHOOK_SIGNING_SECRET` aggiunto a `.env`
- [ ] Server riavviato dopo aver aggiunto la variabile
- [ ] Test effettuato con un nuovo utente
- [ ] Verificato che il ruolo sia `USER` nel database
- [ ] Verificato che `privateMetadata.role` sia `USER` su Clerk

## 🔐 Sicurezza

Il webhook utilizza **Svix** per la verifica della firma. Non modificare il codice di verifica senza comprenderne le implicazioni di sicurezza.

**IMPORTANTE**: Il `CLERK_WEBHOOK_SIGNING_SECRET` deve essere mantenuto segreto e non deve essere committato nel repository.

## 📝 Note Aggiuntive

- Il ruolo predefinito per tutti i nuovi utenti è `USER`
- Solo gli admin possono modificare i ruoli tramite l'admin dashboard
- I venditori ottengono il ruolo `SELLER` dopo aver completato il processo di richiesta seller
