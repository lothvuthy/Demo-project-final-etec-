# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


## Run the store + API

This project uses JSON Server for users, products, messages, carts, wishlists, and orders. Start the API in a second terminal:

```bash
npm run api
```

Then start Nuxt:

```bash
npm run dev
```

### Admin demo account

- Email: `lothvuthy@gmail.com`
- Password: `123456`
- Admin page: `/admin`

The admin dashboard includes a left sidebar for Dashboard, Products, Users, Messages, and Orders. Products added from the dashboard are written to the JSON Server API and then appear in the storefront after refresh.

> This project is a demo using JSON Server and stores passwords in the JSON database. Do not use this authentication setup for a production site; use a real backend with hashed passwords and server-side authorization.
