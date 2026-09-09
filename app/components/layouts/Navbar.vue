<script setup>
import { ref, computed } from "vue";
import { Heart, ShoppingCart, Menu, X, User, LogOut } from "lucide-vue-next";
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

const isActive = (path) => {
  return route.path === path;
};

const handleLogout = () => {
  logout();
  isUserMenuOpen.value = false;
  router.push("/");
};
</script>

<template>
  <header class="sticky top-0 z-50 bg-white backdrop-blur-sm">
    <nav
      class="max-w-7xl mx-auto mt-3 sm:mt-4 px-3 sm:px-5 lg:px-8 bg-white rounded-2xl shadow-sm"
    >
      <div class="h-16 sm:h-18 lg:h-20 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center shrink-0">
          <div class="text-2xl sm:text-3xl font-extrabold text-orange-500">
            SHopiO
          </div>
        </NuxtLink>
        <div class="hidden lg:flex items-center gap-1 text-sm font-medium">
          <NuxtLink
            to="/"
            class="relative px-4 py-2 transition hover:text-orange-500"
            :class="isActive('/') ? 'text-orange-500' : 'text-gray-700'"
          >
            Home

            <span
              v-if="isActive('/')"
              class="absolute left-4 right-4 -bottom-1 h-1 bg-orange-500 rounded-full"
            ></span>
          </NuxtLink>
          <NuxtLink
            to="/shop"
            class="relative px-4 py-2 transition hover:text-orange-500"
            :class="isActive('/shop') ? 'text-orange-500' : 'text-gray-700'"
          >
            Shop
            <span
              v-if="isActive('/shop')"
              class="absolute left-4 right-4 -bottom-1 h-1 bg-orange-500 rounded-full"
            ></span>
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="relative px-4 py-2 transition hover:text-orange-500"
            :class="isActive('/about') ? 'text-orange-500' : 'text-gray-700'"
          >
            About
            <span
              v-if="isActive('/about')"
              class="absolute left-4 right-4 -bottom-1 h-1 bg-orange-500 rounded-full"
            ></span>
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="relative px-4 py-2 transition hover:text-orange-500"
            :class="isActive('/contact') ? 'text-orange-500' : 'text-gray-700'"
          >
            Contact
            <span
              v-if="isActive('/contact')"
              class="absolute left-4 right-4 -bottom-1 h-1 bg-orange-500 rounded-full"
            ></span>
          </NuxtLink>
        </div>
        <div class="flex items-center gap-1 sm:gap-2">
          <!-- Auth: login link or user menu with logout -->
          <div v-if="!isLoggedIn" class="relative">
            <NuxtLink to="/auth/login">
              <button
                class="p-2 sm:p-2.5 rounded-xl transition hover:bg-orange-50 hover:text-orange-500"
                aria-label="Sign in"
              >
                <User :size="20" />
              </button>
            </NuxtLink>
          </div>
          <div v-else class="relative">
            <button
              class="w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-full bg-orange-500 text-white font-semibold flex items-center justify-center text-sm hover:bg-orange-600 transition"
              :title="user?.name"
              @click="isUserMenuOpen = !isUserMenuOpen"
            >
              <img v-if="user?.avatar" :src="user.avatar" alt="Profile" class="w-full h-full object-cover" />
              <span v-else>{{ (user?.name || "?").charAt(0).toUpperCase() }}</span>
            </button>
            <Transition name="menu">
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 text-sm"
              >
                <p class="px-4 py-1.5 text-gray-500 truncate">{{ user?.name }}</p>
                <NuxtLink
                  to="/profile"
                  class="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                  @click="isUserMenuOpen = false"
                >
                  <User :size="16" /> Profile
                </NuxtLink>
                <NuxtLink
                  v-if="user?.role === 'admin'"
                  to="/admin"
                  class="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                  @click="isUserMenuOpen = false"
                >
                  Admin Panel
                </NuxtLink>
                <button
                  class="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                  @click="handleLogout"
                >
                  <LogOut :size="16" /> Sign out
                </button>
              </div>
            </Transition>
          </div>

          <!-- Wishlist -->
          <NuxtLink
            to="/wishlist"
            class="relative p-2 sm:p-2.5 rounded-xl transition hover:bg-orange-50 hover:text-orange-500"
            aria-label="Wishlist"
          >
            <Heart :size="20" />
            <span
              v-if="wishlistIds.length"
              class="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {{ wishlistIds.length }}
            </span>
          </NuxtLink>

          <!-- Cart -->
          <NuxtLink
            to="/cart"
            class="relative p-2 sm:p-2.5 rounded-xl transition hover:bg-orange-50 hover:text-orange-500"
            aria-label="Cart"
          >
            <ShoppingCart :size="20" />
            <span
              v-if="cartCount"
              class="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {{ cartCount }}
            </span>
          </NuxtLink>

          <button
            @click="isMenuOpen = !isMenuOpen"
            class="lg:hidden p-2 sm:p-2.5 rounded-xl transition hover:bg-orange-50 hover:text-orange-500"
          >
            <X v-if="isMenuOpen" :size="24" />
            <Menu v-else :size="24" />
          </button>
        </div>
      </div>
      <Transition name="menu">
        <div v-if="isMenuOpen" class="lg:hidden border-t border-gray-100 py-4">
          <div
            class="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 text-sm font-medium"
          >
            <NuxtLink
              to="/"
              @click="isMenuOpen = false"
              class="relative px-4 py-3 rounded-xl transition hover:text-orange-500"
              :class="isActive('/') ? 'text-orange-500' : 'text-gray-700'"
            >
              Home
              <span
                v-if="isActive('/')"
                class="absolute left-4 right-4 bottom-0 h-1 bg-orange-500 rounded-full"
              ></span>
            </NuxtLink>

            <NuxtLink
              to="/shop"
              @click="isMenuOpen = false"
              class="relative px-4 py-3 rounded-xl transition hover:text-orange-500"
              :class="isActive('/shop') ? 'text-orange-500' : 'text-gray-700'"
            >
              Shop
              <span
                v-if="isActive('/shop')"
                class="absolute left-4 right-4 bottom-0 h-1 bg-orange-500 rounded-full"
              ></span>
            </NuxtLink>
            <NuxtLink
              to="/about"
              @click="isMenuOpen = false"
              class="relative px-4 py-3 rounded-xl transition hover:text-orange-500"
              :class="isActive('/about') ? 'text-orange-500' : 'text-gray-700'"
            >
              About
              <span
                v-if="isActive('/about')"
                class="absolute left-4 right-4 bottom-0 h-1 bg-orange-500 rounded-full"
              ></span>
            </NuxtLink>
            <NuxtLink
              to="/contact"
              @click="isMenuOpen = false"
              class="relative px-4 py-3 rounded-xl transition hover:text-orange-500"
              :class="isActive('/contact') ? 'text-orange-500' : 'text-gray-700'"
            >
              Contact
              <span
                v-if="isActive('/contact')"
                class="absolute left-4 right-4 bottom-0 h-1 bg-orange-500 rounded-full"
              ></span>
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
  transition: all 0.25s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
