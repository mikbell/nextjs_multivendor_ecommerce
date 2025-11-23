# Configurazione Stripe per il Checkout

Questa guida ti aiuterà a configurare Stripe per gestire i pagamenti nel tuo e-commerce multivendor.

## Prerequisiti

1. Un account Stripe (gratuito): https://dashboard.stripe.com/register
2. Le tue chiavi API di Stripe (test mode)

## Passo 1: Ottieni le chiavi API di Stripe

1. Vai su https://dashboard.stripe.com/test/apikeys
2. Copia la **Publishable key** (inizia con `pk_test_`)
3. Copia la **Secret key** (inizia con `sk_test_`)

## Passo 2: Configura le variabili d'ambiente

Apri il file `.env` e aggiorna le seguenti variabili con le tue chiavi:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_tua_chiave_segreta_qui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tua_chiave_pubblica_qui
STRIPE_WEBHOOK_SECRET=whsec_tuo_webhook_secret_qui
```

**Nota:** Per ora puoi lasciare `STRIPE_WEBHOOK_SECRET` con il placeholder. Lo configureremo nel Passo 4.

## Passo 3: Configura l'URL dell'applicazione

Nel file `.env`, verifica che `NEXT_PUBLIC_APP_URL` sia configurato correttamente:

```env
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (quando fai il deploy)
NEXT_PUBLIC_APP_URL=https://tuo-dominio.com
```

## Passo 4: Configura il Webhook Stripe

I webhook permettono a Stripe di notificare la tua applicazione quando un pagamento viene completato.

### In Development (con Stripe CLI)

1. Installa Stripe CLI: https://stripe.com/docs/stripe-cli
2. Accedi con `stripe login`
3. Avvia il webhook listener:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```
4. Copia il webhook signing secret (inizia con `whsec_`) e aggiornalo nel file `.env`

### In Production

1. Vai su https://dashboard.stripe.com/webhooks
2. Clicca su "Add endpoint"
3. Inserisci l'URL: `https://tuo-dominio.com/api/stripe-webhook`
4. Seleziona gli eventi da ascoltare:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copia il webhook signing secret e aggiornalo nel file `.env` di produzione

## Passo 5: Testa il flusso di checkout

1. Avvia l'applicazione in development:
   ```bash
   npm run dev
   ```

2. Aggiungi alcuni prodotti al carrello

3. Vai al checkout e clicca su "Procedi al pagamento"

4. Usa una carta di test Stripe:
   - Numero: `4242 4242 4242 4242`
   - Data di scadenza: qualsiasi data futura (es. `12/34`)
   - CVC: qualsiasi 3 cifre (es. `123`)
   - CAP: qualsiasi 5 cifre (es. `12345`)

5. Completa il pagamento e verifica il reindirizzamento alla pagina di successo

## Eventi Gestiti

L'applicazione gestisce i seguenti eventi Stripe:

- **checkout.session.completed**: Quando un pagamento viene completato con successo
  - Crea l'ordine nel database
  - Crea i gruppi ordine per ogni store
  - Crea gli item dell'ordine
  - Aggiorna l'inventario
  - Svuota il carrello

- **payment_intent.succeeded**: Quando un pagamento ha successo (log)

- **payment_intent.payment_failed**: Quando un pagamento fallisce (log)

## Gestione degli Indirizzi di Spedizione

Al momento, il sistema utilizza automaticamente l'indirizzo di spedizione predefinito dell'utente.

Per configurare o modificare gli indirizzi di spedizione:

1. Vai al tuo profilo utente
2. Gestisci gli indirizzi di spedizione
3. Imposta un indirizzo come predefinito

**Nota:** Prima di completare il checkout, assicurati di avere un indirizzo di spedizione predefinito configurato.

## Modalità Test vs Produzione

### Test Mode (Development)
- Usa chiavi che iniziano con `pk_test_` e `sk_test_`
- Nessun pagamento reale viene effettuato
- Usa carte di test: https://stripe.com/docs/testing

### Production Mode
- Usa chiavi che iniziano con `pk_live_` e `sk_live_`
- I pagamenti sono reali
- Richiede verifica dell'account Stripe
- Configura i webhook in produzione

## Sicurezza

- ✅ **MAI** committare il file `.env` nel repository
- ✅ Le chiavi segrete sono utilizzate solo lato server
- ✅ Le chiavi pubbliche sono safe per il client
- ✅ Il webhook è firmato e verificato
- ✅ Tutti i pagamenti sono elaborati da Stripe (PCI compliant)

## Troubleshooting

### Il webhook non funziona in development
- Verifica che Stripe CLI sia in esecuzione: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- Controlla che `STRIPE_WEBHOOK_SECRET` sia configurato correttamente

### Errore "Cart is empty"
- Assicurati di avere prodotti nel carrello prima di procedere al checkout

### Errore "No default shipping address found"
- Configura un indirizzo di spedizione predefinito nel tuo profilo

### Il pagamento viene completato ma l'ordine non viene creato
- Controlla i log del webhook: `stripe listen --print-secret`
- Verifica che il webhook stia ricevendo l'evento `checkout.session.completed`
- Controlla i log del server per eventuali errori

## Link Utili

- Dashboard Stripe: https://dashboard.stripe.com
- Documentazione Stripe Checkout: https://stripe.com/docs/payments/checkout
- Carte di test Stripe: https://stripe.com/docs/testing
- Stripe CLI: https://stripe.com/docs/stripe-cli
