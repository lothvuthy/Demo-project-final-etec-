<script setup>
definePageMeta({ middleware: "auth" });

import { onMounted } from "vue";
import { Heart, ShoppingCart, Trash2, Zap } from "lucide-vue-next";
import { useProducts } from "~/composables/useProducts";
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";

const { wishlistIds, toggle } = useWishlist();
const { products, loadProducts } = useProducts();
const { add } = useCart();
const router = useRouter();

onMounted(() => loadProducts());

const wishlistProducts = computed(() =>
  products.value.filter((p) => wishlistIds.value.includes(String(p.id)))
);

const remove = async (product) => {
  await toggle(product);
};

const movingId = ref(null);
const addToCart = async (product) => {
  movingId.value = product.id;
  const ok = await add(product, 1);
  movingId.value = null;
  if (!ok) router.push("/auth/login");
};

const buyingId = ref(null);
const buyNow = async (product) => {
  buyingId.value = product.id;
  const ok = await add(product, 1);
  buyingId.value = null;
  if (!ok) {
    router.push("/auth/login");
    return;
  }
  router.push("/checkout");
};
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <div class="mb-8">
      <p class="uppercase tracking-widest text-orange-500 text-xs font-semibold mb-2">
        Saved Items
      </p>
      <h1 class="text-3xl font-black text-gray-900">Your Wishlist</h1>
    </div>

    <div
      v-if="wishlistProducts.length"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="product in wishlistProducts"
        :key="product.id"
        class="group relative"
      >
        <NuxtLink :to="`/product/${product.id}`" class="block">
          <div class="relative bg-gray-50 rounded-2xl overflow-hidden">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
          <h3 class="font-semibold mt-3 hover:text-orange-500 transition">
            {{ product.name }}
          </h3>
          <p class="font-bold text-gray-900 mt-1">${{ product.price.toFixed(2) }}</p>
        </NuxtLink>

        <div class="flex items-center gap-2 mt-3">
          <button
            type="button"
            class="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-100 text-gray-900 text-sm font-semibold px-3 py-2 rounded-full hover:bg-gray-200 transition disabled:opacity-70"
            :disabled="movingId === product.id"
            @click="addToCart(product)"
          >
            <ShoppingCart :size="16" />
            {{ movingId === product.id ? "Adding..." : "Add" }}
          </button>
          <button
            type="button"
            class="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-900 text-white text-sm font-semibold px-3 py-2 rounded-full hover:bg-orange-500 transition disabled:opacity-70"
            :disabled="buyingId === product.id"
            @click="buyNow(product)"
          >
            <Zap :size="15" />
            {{ buyingId === product.id ? "..." : "Buy Now" }}
          </button>
          <button
            type="button"
            aria-label="Remove from wishlist"
            class="w-9 h-9 shrink-0 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition"
            @click="remove(product)"
          >
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <Heart :size="40" class="mb-4 text-gray-300" />
      <h3 class="text-xl font-bold text-gray-900">Your wishlist is empty</h3>
      <p class="mt-2 text-sm text-gray-500">
        Tap the heart on any product to save it here.
      </p>
      <NuxtLink
        to="/shop"
        class="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition"
      >
        Browse Shop
      </NuxtLink>
    </div>
  </div>
</template>
