# 🛍️ Multivendor E-commerce Platform (Refactored)

Una piattaforma e-commerce multivendor moderna e scalabile costruita con Next.js 15, React 19, e le migliori tecnologie del settore. Questo progetto è stato completamente refactorato seguendo le best practices più recenti per performance, sicurezza e manutenibilità.

## 🚀 Tecnologie Utilizzate

### Frontend
- **Next.js 15** - Framework React con App Router e React Server Components
- **React 19** - Libreria UI con le ultime features
- **TypeScript** - Type safety e migliore esperienza di sviluppo
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Componenti primitivi accessibili
- **Lucide React** - Icone moderne e ottimizzate
- **React Hook Form** - Gestione form performante
- **Zod** - Validazione schema TypeScript-first

### Backend & Database
- **Prisma** - ORM type-safe con schema ottimizzato
- **MySQL** - Database relazionale con indici ottimizzati
- **Clerk** - Autenticazione e gestione utenti
- **Cloudinary** - Gestione e ottimizzazione immagini

### Sviluppo & Tooling
- **ESLint 9** - Linting avanzato con flat config
- **Prettier** - Formattazione codice consistente
- **TypeScript** - Type checking rigoroso
- **Turbo** - Build system ultra-veloce

## 📁 Architettura Refactorata

Il progetto è stato completamente riorganizzato seguendo una architettura modulare e scalabile:

```
src/
├── core/                     # Sistema centrale
│   ├── types/               # Tipi TypeScript centralizzati
│   │   ├── index.ts
│   │   ├── database.types.ts
│   │   ├── business.types.ts
│   │   ├── api.types.ts
│   │   └── auth.types.ts
│   ├── schemas/             # Schemi di validazione Zod
│   │   ├── index.ts
│   │   ├── common.schema.ts
│   │   ├── category.schema.ts
│   │   └── product.schema.ts
│   ├── config/              # Configurazione centralizzata
│   │   ├── index.ts
│   │   ├── app.config.ts
│   │   └── database.config.ts
│   ├── utils/               # Utility functions
│   │   ├── index.ts
│   │   ├── format.utils.ts
│   │   ├── validation.utils.ts
│   │   └── class-names.utils.ts
│   ├── hooks/               # Custom hooks avanzati
│   │   ├── index.ts
│   │   ├── use-async.hook.ts
│   │   └── use-debounce.hook.ts
│   ├── services/            # Logica business
│   │   ├── index.ts
│   │   ├── category.service.ts
│   │   └── product.service.ts
│   ├── middleware/          # Middleware avanzato
│   │   ├── index.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── security.middleware.ts
│   ├── error/               # Gestione errori centralizzata
│   │   ├── index.ts
│   │   ├── error-types.ts
│   │   └── error-handler.ts
│   ├── cache/               # Sistema di caching
│   │   ├── index.ts
│   │   ├── cache-manager.ts
│   │   └── cache-strategies.ts
│   ├── performance/         # Ottimizzazioni performance
│   │   ├── index.ts
│   │   ├── image-optimization.ts
│   │   └── lazy-loading.ts
│   └── design-system/       # Design system
│       ├── index.ts
│       ├── tokens.ts
│       └── components.ts
├── app/                      # Next.js App Router
├── components/               # Componenti React riorganizzati
├── lib/                      # Librerie esistenti (graduale migrazione)
└── middleware.ts             # Middleware Next.js ottimizzato
```

## ✨ Miglioramenti Implementati

### 🏗️ Architettura
- **Separazione delle responsabilità** - Logica business separata dai componenti UI
- **Sistema di tipi centralizzato** - Tipi TypeScript riutilizzabili e type-safe
- **Design system coerente** - Tokens e componenti standardizzati
- **Configurazione modulare** - Config centralizzata e environment-aware

### 🚀 Performance
- **Caching intelligente** - Sistema di cache multi-livello con tag-based invalidation
- **Ottimizzazione immagini** - Lazy loading e formati moderni (WebP, AVIF)
- **Bundle optimization** - Code splitting e dynamic imports
- **Database ottimizzato** - Indici strategici e query ottimizzate

### 🔒 Sicurezza
- **Rate limiting avanzato** - Protezione contro abusi per endpoint specifici
- **Headers di sicurezza** - CSP, HSTS, e altre protezioni
- **Validazione robusta** - Schema validation con Zod
- **Error handling** - Gestione errori sicura senza leak di informazioni

### 🛠️ Developer Experience
- **Hooks personalizzati** - useAsync, useDebounce, e altri per produttività
- **Utilities avanzate** - Funzioni helper per formatting, validation, etc.
- **Error boundaries** - Gestione graceful degli errori React
- **TypeScript rigoroso** - Type safety al 100% con strict mode

### 📱 UI/UX
- **Componenti accessibili** - Basati su Radix UI con ARIA compliant
- **Responsive design** - Mobile-first con breakpoints ottimizzati
- **Loading states** - Skeleton loaders e stati di caricamento
- **Error states** - Fallback UI per errori e stati vuoti

## 🗄️ Database Schema Ottimizzato

Il database è stato completamente ristrutturato con:

- **Relazioni ottimizzate** - Foreign keys e constraint appropriati
- **Indici strategici** - Performance query migliorate
- **Naming consistente** - Convenzioni standardizzate
- **Soft deletes** - Per integrità dei dati
- **Audit fields** - createdAt/updatedAt automatici

## 📊 Monitoraggio e Analytics

- **Performance monitoring** - Core Web Vitals tracking
- **Error tracking** - Centralized error logging
- **Cache metrics** - Hit/miss ratios e performance
- **Security monitoring** - Rate limiting e suspicious activity detection

## 🚀 Getting Started

### Prerequisiti
- Node.js 18+ 
- MySQL 8.0+
- Account Clerk
- Account Cloudinary

### Installazione

1. Clona il repository
```bash
git clone <repository-url>
cd multivendor_ecommerce
```

2. Installa le dipendenze
```bash
npm install
```

3. Configura l'ambiente
```bash
cp .env.example .env.local
```

4. Configura le variabili d'ambiente:
```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
```

5. Setup del database
```bash
npx prisma generate
npx prisma db push
```

6. Avvia il development server
```bash
npm run dev
```

## 📜 Scripts Disponibili

```bash
# Sviluppo
npm run dev                    # Start dev server con Turbo
npm run build                 # Build per produzione
npm run start                 # Start server produzione
npm run lint                  # Lint con ESLint 9
npm run lint:fix             # Fix automatico lint
npm run type-check           # Type checking TypeScript
npm run format               # Format con Prettier

# Database
npm run db:generate          # Genera client Prisma
npm run db:push             # Push schema al database
npm run db:studio           # Apri Prisma Studio

# Analisi
npm run analyze             # Analizza bundle size
```

## 🏛️ Principi Architetturali

### 1. Separation of Concerns
- **Presentazione** - Componenti React puri
- **Logica Business** - Services layer
- **Accesso Dati** - Repository pattern con Prisma

### 2. Type Safety
- **Runtime validation** - Zod schemas
- **Compile-time safety** - TypeScript strict mode
- **API contracts** - Typed request/response

### 3. Performance First
- **Lazy loading** - Code splitting ovunque possibile
- **Caching** - Multi-layer cache strategy
- **Optimization** - Bundle size e runtime performance

### 4. Developer Experience
- **Tooling** - Setup automatico e scripts utility
- **Documentation** - Codice autodocumentato
- **Testing** - Test utilities e helpers

## 🔧 Configurazione Avanzata

### Cache Strategy
```typescript
// Short-term cache (5 min)
shortCache.set('user-preferences', data, ['user', userId]);

// Medium-term cache (30 min) 
mediumCache.set('categories', data, ['categories']);

// Long-term cache (24 hours)
longCache.set('static-content', data, ['static']);
```

### Error Handling
```typescript
try {
  const result = await CategoryService.createCategory(data);
  return { success: true, data: result };
} catch (error) {
  if (error instanceof ValidationError) {
    return { success: false, error: error.toJSON() };
  }
  throw error; // Re-throw unexpected errors
}
```

### Performance Monitoring
```typescript
// Automatic performance tracking
const { execute, loading } = useAsync(fetchProducts, {
  onSuccess: (data) => console.log('Products loaded:', data.length),
  onError: (error) => console.error('Failed to load products:', error)
});
```

## 🤝 Contributi

1. Fork il progetto
2. Crea il tuo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT - vedi il file [LICENSE](LICENSE) per i dettagli.

## 🙏 Riconoscimenti

- [Next.js Team](https://nextjs.org/) per il framework eccezionale
- [Vercel](https://vercel.com/) per l'hosting e i tools
- [Radix UI](https://www.radix-ui.com/) per i componenti primitivi
- [Clerk](https://clerk.com/) per l'autenticazione
- [Prisma](https://www.prisma.io/) per l'ORM

---

**Nota**: Questo progetto rappresenta un refactor completo seguendo le best practices moderne. L'architettura è progettata per scalabilità, manutenibilità e performance ottimali.