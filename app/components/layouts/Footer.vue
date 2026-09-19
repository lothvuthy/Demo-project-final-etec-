<script setup>
const year = new Date().getFullYear();

const shopLinks = [
  { label: "All products", to: "/shop" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Cart", to: "/cart" },
];

const companyLinks = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Sign in", to: "/auth/login" },
];
</script>

<template>
  <footer class="mt-24 bg-ink text-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <NuxtLink to="/" class="font-display text-3xl font-extrabold tracking-tight">
            Shopi<span class="text-orange-400">O</span>
          </NuxtLink>
          <p class="mt-4 max-w-xs text-sm leading-6 text-slate-300">
            Electronics, fashion, shoes, bags and watches, delivered from Phnom Penh.
          </p>
        </div>

        <nav aria-label="Shop">
          <h3 class="text-sm font-semibold text-white">Shop</h3>
          <ul class="mt-4 space-y-3 text-sm text-slate-300">
            <li v-for="link in shopLinks" :key="link.to">
              <NuxtLink :to="link.to" class="transition hover:text-orange-300">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 class="text-sm font-semibold text-white">Company</h3>
          <ul class="mt-4 space-y-3 text-sm text-slate-300">
            <li v-for="link in companyLinks" :key="link.to">
              <NuxtLink :to="link.to" class="transition hover:text-orange-300">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div>
          <h3 class="text-sm font-semibold text-white">Contact</h3>
          <ul class="mt-4 space-y-3 text-sm text-slate-300">
            <li>
              <a href="mailto:info@ShopiO.com" class="transition hover:text-orange-300">
                info@ShopiO.com
              </a>
            </li>
            <li>
              <a href="tel:+855123456789" class="transition hover:text-orange-300">
                +855 123456789
              </a>
            </li>
            <li>Telegram: Team2</li>
            <li>Street 168, ETEC Center, Phnom Penh, Cambodia</li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} ShopiO. All rights reserved.</p>
        <p>Phnom Penh, Cambodia</p>
      </div>
    </div>
  </footer>
</template>