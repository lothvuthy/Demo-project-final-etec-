<script setup>
import { ref } from "vue";
import { Heart, ShoppingCart, Menu, X, User, LogOut, ShoppingBag } from "lucide-vue-next";
import { useAuth } from "~/composables/useAuth";
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";

const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);

const route = useRoute();
const router = useRouter();

const { user, isLoggedIn, logout } = useAuth();
const { wishlistIds } = useWishlist();
const { count: cartCount } = useCart();

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const isActive = (path) => route.path === path;

const handleLogout = () => {
  logout();
  isUserMenuOpen.value = false;
  router.push("/");
};
</script>

<template>
  <header class="sticky top-0 z-50 px-3 sm:px-5 pt-3 sm:pt-4">
    <nav
      class="max-w-7xl mx-auto rounded-2xl border border-line bg-white/85 px-3 sm:px-5 shadow-[0_8px_30px_-12px_rgba(21,23,28,0.18)] backdrop-blur-md"
      aria-label="Main"
    >
      <div class="h-16 lg:h-18 flex items-center justify-between gap-4">
        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0" aria-label="ShopiO home">
          <span
            class="grid h-9 w-9 place-items-center rounded-xl bg-orange-500 text-white"
          >
            <ShoppingBag :size="20" />
          </span>
          <span class="font-display text-2xl font-extrabold tracking-tight text-ink">
            ShopiO
          </span>
        </NuxtLink>

        <!-- Desktop links -->
        <div class="hidden lg:flex items-center gap-1 text-sm font-semibold">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-4 py-2 transition"
            :class="
              isActive(link.to)
                ? 'bg-orange-50 text-orange-600'
                : 'text-gray-600 hover:bg-mist hover:text-ink'
            "
            :aria-current="isActive(link.to) ? 'page' : undefined"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 sm:gap-1.5">
          <!-- Wishlist -->
          <NuxtLink
            to="/wishlist"
            class="relative grid h-10 w-10 place-items-center rounded-full text-gray-700 transition hover:bg-mist hover:text-orange-600"
            aria-label="Wishlist"
          >
            <Heart :size="20" />
            <span
              v-if="wishlistIds.length"
              class="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white ring-2 ring-white"
            >
              {{ wishlistIds.length }}
            </span>
          </NuxtLink>

          <!-- Cart -->
          <NuxtLink
            to="/cart"
            class="relative grid h-10 w-10 place-items-center rounded-full text-gray-700 transition hover:bg-mist hover:text-orange-600"
            aria-label="Cart"
          >
            <ShoppingCart :size="20" />
            <span
              v-if="cartCount"
              class="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white ring-2 ring-white"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>

                    <!-- Auth: sign in or user menu -->
          <NuxtLink
            v-if="!isLoggedIn"
            to="/auth/login"
            class="ml-1 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-orange-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 sm:px-4"
          >
            <User :size="16" />
            <span class="hidden sm:inline">Sign in</span>
          </NuxtLink>
          <div v-else class="relative ml-1">
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-orange-500 text-sm font-semibold text-white ring-2 ring-white transition hover:ring-orange-200"
              :title="user?.name"
              :aria-expanded="isUserMenuOpen"
              aria-haspopup="menu"
              @click="isUserMenuOpen = !isUserMenuOpen"
            >
              <img
                v-if="user?.avatar"
                :src="user.avatar"
                alt="Profile"
                class="h-full w-full object-cover"
              />
              <span v-else>{{ (user?.name || "?").charAt(0).toUpperCase() }}</span>
            </button>
            <Transition name="menu">
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-line bg-white py-2 text-sm shadow-xl"
                role="menu"
              >
                <p class="truncate px-4 py-2 font-semibold text-ink">{{ user?.name }}</p>
                <div class="my-1 border-t border-line"></div>
                <NuxtLink
                  to="/profile"
                  class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  role="menuitem"
                  @click="isUserMenuOpen = false"
                >
                  <User :size="16" /> Profile
                </NuxtLink>
                <NuxtLink
                  v-if="user?.role === 'admin'"
                  to="/admin"
                  class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  role="menuitem"
                  @click="isUserMenuOpen = false"
                >
                  <ShoppingBag :size="16" /> Admin panel
                </NuxtLink>
                <button
                  type="button"
                  class="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  role="menuitem"
                  @click="handleLogout"
                >
                  <LogOut :size="16" /> Sign out
                </button>
              </div>
            </Transition>
          </div>

          <!-- Mobile menu toggle -->
          <button
            type="button"
            class="grid h-10 w-10 place-items-center rounded-full text-gray-700 transition hover:bg-mist lg:hidden"
            :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="isMenuOpen"
            @click="isMenuOpen = !isMenuOpen"
          >
            <X v-if="isMenuOpen" :size="22" />
            <Menu v-else :size="22" />
          </button>
        </div>
      </div>

      <!-- Mobile links -->
      <Transition name="menu">
        <div v-if="isMenuOpen" class="border-t border-line py-3 lg:hidden">
          <div class="flex flex-col gap-1 text-sm font-semibold">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="rounded-xl px-4 py-3 transition"
              :class="
                isActive(link.to)
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-700 hover:bg-mist'
              "
              :aria-current="isActive(link.to) ? 'page' : undefined"
              @click="isMenuOpen = false"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>