<script setup>
import { ref, computed, onMounted } from "vue";
import { Search, X, ChevronDown } from "lucide-vue-next";

import ProductCard from "~/components/users/product/ProductCard.vue";
import { useProducts } from "~/composables/useProducts";

const { products, loadProducts } = useProducts();
const search = ref("");
const sortBy = ref("default");

const sorters = {
  "price-low": (a, b) => a.price - b.price,
  "price-high": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  discount: (a, b) => b.discount - a.discount,
};

const filteredProducts = computed(() => {
  let list = [...products.value];
  const keyword = search.value.trim().toLowerCase();
  if (keyword) {
    list = list.filter((product) =>
      product.name.toLowerCase().includes(keyword),
    );
  }
  const sorter = sorters[sortBy.value];
  if (sorter) {
    list.sort(sorter);
  }
  return list;
});
const clearSearch = () => {
  search.value = "";
};
onMounted(() => loadProducts());
</script>
<template>
  <div class="min-h-screen bg-white">
    <section class="bg-white px-6 py-14">
      <div class="mx-auto max-w-7xl text-center">
        <p
          class="mb-3 text-sm font-bold uppercase tracking-widest text-orange-500"
        >
          Shop Everything
        </p>

        <h1 class="text-4xl font-black text-gray-900 md:text-6xl">
          Find Your
          <span class="text-orange-500"> Style. </span>
        </h1>
        <p class="mx-auto mt-4 max-w-xl text-gray-500">
          Discover trending products, amazing deals, and everything you need in
          one place.
        </p>
        <div class="mx-auto mt-8 max-w-2xl">
          <label for="product-search" class="sr-only"> Search products </label>

          <div
            class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-orange-400"
          >
            <Search :size="20" class="text-gray-400" />

            <input
              id="product-search"
              v-model="search"
              type="text"
              placeholder="Search products..."
              class="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />

            <button
              v-if="search"
              type="button"
              aria-label="Clear search"
              class="text-gray-400 hover:text-orange-500"
              @click="clearSearch"
            >
              <X :size="18" />
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="mx-auto max-w-7xl px-6 py-10 bg-white">
      <div
        class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 class="text-2xl font-bold text-gray-900">All Products</h2>

          <p class="mt-1 text-sm text-gray-500">
            {{ filteredProducts.length }} products found
          </p>
        </div>
        <div class="relative">
          <label for="sort-select" class="sr-only"> Sort products </label>
          <select
            id="sort-select"
            v-model="sortBy"
            class="appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-gray-700 outline-none focus:border-orange-400"
          >
            <option value="default">Sort by</option>

            <option value="price-low">Price: Low to High</option>

            <option value="price-high">Price: High to Low</option>

            <option value="rating">Highest Rating</option>

            <option value="discount">Biggest Discount</option>
          </select>

          <ChevronDown
            :size="16"
            class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      <div
        v-if="filteredProducts.length > 0"
        class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
      <div
        v-else
        class="flex min-h-100 flex-col items-center justify-center rounded-3xl bg-white text-center"
      >
        <Search :size="40" class="mb-4 text-gray-300" />

        <h3 class="text-xl font-bold text-gray-900">No products found</h3>

        <p class="mt-2 text-sm text-gray-500">
          Try searching for another product.
        </p>

        <button
          type="button"
          class="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500"
          @click="clearSearch">
          Clear Search
        </button>
      </div>
    </section>
  </div>
</template>
