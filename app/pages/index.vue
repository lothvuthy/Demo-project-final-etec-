<script setup lang="ts">
import {
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
  ArrowRight,
} from "lucide-vue-next";

import { ref, computed, onMounted, onUnmounted } from "vue";

import shopio from "~/data/shopio.json";
import ProductCard from "~/components/users/product/ProductCard.vue";

const icons = {
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
};

const SLIDE_MS = 5000;

const slides = shopio.slides;
const features = shopio.features;
const categories = shopio.categories;
const products = shopio.products;
const arrivals = shopio.arrivals;
const displayedProducts = computed(() => products.slice(0, 4));

const currentSlide = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

// "TRENDING NOW" -> "Trending now"
const sentence = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const startTimer = () => {
  clearInterval(timer);
  timer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, SLIDE_MS);
};

// Restarting the timer on every manual pick keeps the progress bar in sync.
const goToSlide = (index: number) => {
  currentSlide.value = index;
  startTimer();
};

onMounted(startTimer);
onUnmounted(() => clearInterval(timer));
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="px-4 pt-5 md:px-8">
      <div
        class="mx-auto grid max-w-7xl overflow-hidden rounded-4xl bg-ink text-white lg:grid-cols-[1fr_1.05fr]"
      >
        <div class="order-2 flex flex-col justify-between gap-10 p-6 sm:p-10 lg:order-1 lg:p-14">
          <div>
            <!-- All slide texts share one grid cell so the height never jumps -->
            <div class="grid">
              <div
                v-for="(slide, index) in slides"
                :key="slide.id"
                class="col-start-1 row-start-1 transition-opacity duration-500"
                :class="index === currentSlide ? 'opacity-100' : 'pointer-events-none opacity-0'"
                :aria-hidden="index !== currentSlide"
              >
                <p
                  class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-orange-200"
                >
                  <span class="h-2 w-2 rounded-full bg-orange-400"></span>
                  {{ sentence(slide.highlight) }}
                </p>

                <component
                  :is="index === 0 ? 'h1' : 'h2'"
                  class="mt-5 font-display text-5xl font-bold leading-[1.02] sm:text-6xl xl:text-7xl"
                >
                  {{ slide.title }}
                </component>

                <p class="mt-5 max-w-md text-lg leading-8 text-slate-300">
                  {{ slide.description }}
                </p>
              </div>
            </div>

            <div class="mt-9 flex flex-wrap gap-3">
  <NuxtLink
    to="/shop"
    class="inline-flex items-center gap-2 rounded-full bg-orange-600 px-7 py-3.5 font-semibold text-white transition hover:bg-orange-500"
  >
    Shop now
    <ArrowRight :size="18" />
  </NuxtLink>
  <NuxtLink
    to="#categories"
    class="inline-flex items-center rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
  >
    Browse categories
  </NuxtLink>
</div>
          </div>

          <!-- Slide picker: each tab is a slide, the bar shows time left -->
          <div class="grid grid-cols-3 gap-3 sm:gap-4" role="tablist" aria-label="Featured products">
            <button
              v-for="(slide, index) in slides"
              :key="'tab-' + slide.id"
              type="button"
              role="tab"
              :aria-selected="index === currentSlide"
              class="group text-left"
              @click="goToSlide(index)"
            >
              <span class="block h-1 overflow-hidden rounded-full bg-white/20">
                <span
                  class="block h-full origin-left rounded-full bg-orange-400"
                  :class="index === currentSlide ? 'hero-fill' : 'scale-x-0'"
                ></span>
              </span>
              <span
                class="mt-2.5 block truncate text-sm font-semibold transition"
                :class="index === currentSlide ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'"
              >
                {{ slide.title }}
              </span>
            </button>
          </div>
        </div>

        <div class="relative order-1 aspect-4/3 lg:order-2 lg:aspect-auto lg:min-h-136">
          <img
            v-for="(slide, index) in slides"
            :key="'img-' + slide.id"
            :src="slide.image"
            :alt="index === currentSlide ? slide.title : ''"
            class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            :class="index === currentSlide ? 'opacity-100' : 'opacity-0'"
          />
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section id="categories" class="reveal-section mx-auto max-w-7xl scroll-mt-28 px-5 pt-20">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="text-3xl font-bold sm:text-4xl">Shop by category</h2>
        <NuxtLink
          to="/shop"
          class="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          All products
          <ArrowRight :size="16" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="{ path: '/shop', query: { category: category.value } }"
          class="group flex flex-col gap-3"
        >
          <span class="aspect-square overflow-hidden rounded-3xl bg-mist">
            <img
              :src="category.image"
              :alt="category.name"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </span>
          <span class="text-center font-display text-base font-semibold text-ink transition group-hover:text-orange-600">
            {{ category.name }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Popular products -->
    <section class="reveal-section mx-auto max-w-7xl px-5 pt-20">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="text-3xl font-bold sm:text-4xl">Popular products</h2>
        <NuxtLink
          to="/shop"
          class="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          View all
          <ArrowRight :size="16" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        <ProductCard
          v-for="product in displayedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <!-- Sale banner -->
    <section class="reveal-section mx-auto max-w-7xl px-5 pt-20">
      <div
        class="grid overflow-hidden rounded-4xl bg-orange-600 text-white md:grid-cols-2"
      >
        <div class="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <p class="text-lg font-semibold text-orange-100">Summer sale</p>
          <h2 class="mt-2 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Save up to 50%
          </h2>
          <p class="mt-4 max-w-sm text-lg text-orange-50">
            Great deals on selected products.
          </p>
          <NuxtLink
            to="/shop"
            class="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-ink"
          >
            Shop the sale
            <ArrowRight :size="18" />
          </NuxtLink>
        </div>

        <img
          class="h-64 w-full object-cover md:h-full md:min-h-80"
          src="https://i.pinimg.com/1200x/53/2f/71/532f71aa6886d0994a5a98d7755fb81c.jpg"
          alt="Summer sale"
          loading="lazy"
        />
      </div>
    </section>

    <!-- New arrivals -->
    <section class="reveal-section mx-auto max-w-7xl px-5 pt-20">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="text-3xl font-bold sm:text-4xl">New arrivals</h2>
        <NuxtLink
          to="/shop"
          class="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          View all
          <ArrowRight :size="16" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
        <NuxtLink
          v-for="item in arrivals"
          :key="item.id"
          to="/shop"
          class="group block"
        >
          <div class="aspect-square overflow-hidden rounded-2xl bg-mist">
            <img
              :src="item.image"
              :alt="item.name"
              loading="lazy"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <h3 class="mt-3 line-clamp-1 font-display text-base font-semibold text-ink transition group-hover:text-orange-600">
            {{ item.name }}
          </h3>
          <p class="mt-0.5 text-sm font-semibold text-gray-600">${{ item.price }}</p>
        </NuxtLink>
      </div>
    </section>

    <!-- Store promises -->
    <section class="reveal-section mx-auto max-w-7xl px-5 pt-20">
      <div
        class="grid grid-cols-1 gap-6 rounded-3xl border border-line p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4"
      >
        <div
          v-for="feature in features"
          :key="feature.id"
          class="flex items-center gap-4"
        >
          <div
            class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600"
          >
            <component
              :is="icons[feature.icon as keyof typeof icons]"
              :size="24"
            />
          </div>

          <div>
            <h3 class="font-display font-semibold text-ink">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>