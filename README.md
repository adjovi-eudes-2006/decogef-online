# 🎟️ Billet Gala — Application de Billetterie pour Soirée de Gala

Application web autonome de billetterie avec validation manuelle MTN MoMo, dashboard administrateur et scanner QR avec retour sonore.

**Stack :** Next.js 14, TypeScript, Prisma, PostgreSQL, Tailwind CSS, Zod, Web Audio API

---

## 🚀 Déploiement sur Vercel

### 1. Base de données (Supabase — gratuit)

1. Crée un compte sur [supabase.com](https://supabase.com)
2. Clique sur **"New project"**, choisis un nom et un mot de passe de base de données
3. Une fois le projet créé, va dans **Project Settings → Database → Connection string**
4. Copie la chaîne de connexion **URI** (commence par `postgresql://...`)
5. Remplace `[YOUR-PASSWORD]` par le mot depline de la base de données

### 2. Code source (GitHub)

```bash
# Initialiser le dépôt
git init
git add .
git commit -m "Initial commit"

# Créer un dépôt sur GitHub puis :
git remote add origin https://github.com/<ton-utilisateur>/billet-gala.git
git push -u origin main
```

### 3. Déploiement (Vercel)

1. Va sur [vercel.com](https://vercel.com) et connecte-toi avec GitHub
2. Clique sur **"Add New → Project"**
3. Importe le dépôt `billet-gala`
4. Dans **"Environment Variables"**, ajoute :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:...@db.xxx.supabase.co:5432/postgres` |
| `ADMIN_SECRET_TOKEN` | `GILIO` (ou un mot de passe sécurisé de ton choix) |

5. Clique sur **"Deploy"**

### 4. Synchronisation de la base de données

Une fois le déploiement terminé, depuis ton terminal local :

```bash
# Installer les dépendances
npm install

# Pousser le schéma vers la base de données Supabase (en production)
DATABASE_URL="<URL_SUPABASE>" npx prisma db push

# Peupler avec les données de test
DATABASE_URL="<URL_SUPABASE>" npx prisma db seed
```

### 5. Vérification

- **Page publique :** `https://ton-app.vercel.app/` — Voit l'événement de test
- **Checkout :** `https://ton-app.vercel.app/checkout/<eventId>` — Achète des tickets
- **Admin :** `https://ton-app.vercel.app/admin` — Connecte-toi avec le mot de passe `GILIO`
  - **Dashboard :** Valide ou rejette les commandes PENDING
  - **Scanner :** Scanne les QR codes avec retour sonore et flash

---

## 🛠 Commandes locales

```bash
npm run dev          # Serveur de développement (http://localhost:3000)
npm run build        # Build de production
npm run start        # Serveur de production
npm run db:push      # Pousser le schéma Prisma vers la base
npm run db:seed      # Peupler la base avec des données de test
npm run db:studio    # Interface d'administration Prisma
```

## 🔐 Variables d'environnement

| Variable | Obligatoire | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | URL de connexion PostgreSQL |
| `ADMIN_SECRET_TOKEN` | ✅ | Mot de passe de l'espace administrateur |

## 📦 Fonctionnalités

- **Scan QR avec retour sonore** — Bip aigu (vert) pour accès autorisé, double bip grave (rouge) pour erreur
- **Flash intégré** — Activation du flash du smartphone pour les environnements sombres
- **Design mobile-first** — Interface optimisée pour les contrôleurs sur le terrain
- **Validation MTN MoMo** — Saisie et vérification manuelle des références de paiement
- **Anti-brute-force** — Délai de 2 secondes après un échec de connexion admin
- **Validation Zod** — Tous les inputs sont validés côté serveur
- **Atomic QR scan** — `updateMany` pour éviter les race conditions (double scan)
- **Cookie HttpOnly sécurisé** — Session admin protégée
