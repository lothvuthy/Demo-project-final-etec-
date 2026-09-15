<script setup>
import { ref, computed } from "vue";
import { Search, X, ChevronDown } from "lucide-vue-next";

import shopio from "~/data/shopio.json";
import ProductCard from "~/components/users/product/ProductCard.vue";

const search = ref("");
const sortBy = ref("default");
const selectedCategory = ref("all");

const categories = computed(() => {
  const allCategory = {
    id: "all",
    name: "All Products",
    value: "all",
    items: shopio.products.length,
  };

  const productCategories = shopio.categories.map((category) => ({
    ...category,
    items: shopio.products.filter(
      (product) => product.category === category.value,
    ).length,
  }));

  return [allCategory, ...productCategories];
});

const sorters = {
  "price-low": (a, b) => a.price - b.price,
  "price-high": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  discount: (a, b) => b.discount - a.discount,
};

const filteredProducts = computed(() => {
  let products = [...shopio.products];

  if (selectedCategory.value !== "all") {
    products = products.filter(
      (product) => product.category === selectedCategory.value,
    );
  }

  const keyword = search.value.trim().toLowerCase();

  if (keyword) {
    products = products.filter((product) =>
      product.name.toLowerCase().includes(keyword),
    );
  }

  const sorter = sorters[sortBy.value];

  if (sorter) {
    products.sort(sorter);
  }

  return products;
});

const clearSearch = () => {
  search.value = "";
};

const selectCategory = (category) => {
  selectedCategory.value = category;
};

const pageTitle = computed(() => {
  if (selectedCategory.value === "all") {
    return "All Products";
  }

  return selectedCategory.value;
});
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
            class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
          >
            <Search :size="20" class="shrink-0 text-gray-400" />

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
              class="shrink-0 text-gray-400 transition hover:text-orange-500"
              @click="clearSearch"
            >
              <X :size="18" />
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="mx-auto max-w-7xl px-6 py-10">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="rounded-2xl border border-gray-100 bg-white p-4">
            <h3 class="mb-4 px-3 text-lg font-bold text-gray-900">
              Categories
            </h3>

            <nav class="flex flex-col gap-1">
              <button
                v-for="category in categories"
                :key="category.value"
                type="button"
                @click="selectCategory(category.value)"
                :class="[
                  'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all',

                  selectedCategory === category.value
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500',
                ]"
              >
                <span>
                  {{ category.name }}
                </span>

                <!-- Product count -->
                <span
                  :class="[
                    'text-xs',

                    selectedCategory === category.value
                      ? 'text-orange-100'
                      : 'text-gray-400',
                  ]"
                >
                  {{
                    category.value === "all"
                      ? shopio.products.length
                      : shopio.products.filter(
                          (product) => product.category === category.value,
                        ).length
                  }}
                </span>
              </button>
            </nav>
          </div>
        </aside>
        <div class="min-w-0">
          <div
            class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                {{ pageTitle }}
              </h2>

              <p class="mt-1 text-sm text-gray-500">
                {{ filteredProducts.length }} products found
              </p>
            </div>
            <div class="relative shrink-0">
              <label for="sort-select" class="sr-only"> Sort products </label>
              <select
                id="sort-select"
                v-model="sortBy"
                class="appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm font-semibold text-gray-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
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
            class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-6"
          >
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
            />
          </div>
          <div
            v-else
            class="flex min-h-100 flex-col items-center justify-center rounded-3xl bg-gray-50 px-6 text-center"
          >
            <Search :size="40" class="mb-4 text-gray-300" />

            <h3 class="text-xl font-bold text-gray-900">No products found</h3>

            <p class="mt-2 text-sm text-gray-500">
              Try searching for another product or choose another category.
            </p>

            <div class="mt-5 flex gap-3">
              <!-- Clear Search -->
              <button
                v-if="search"
                type="button"
                class="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
                @click="clearSearch"
              >
                Clear Search
              </button>
              <button
                v-if="selectedCategory !== 'all'"
                type="button"
                class="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-400 hover:text-orange-500"
                @click="selectCategory('all')"
              >
                All Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
