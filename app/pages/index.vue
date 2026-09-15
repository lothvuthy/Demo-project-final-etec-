<script setup lang="ts">
import {
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
  MoveRight,
  Heart,
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

const currentSlide = ref(0);

const slides = shopio.slides;
const features = shopio.features;
const categories = shopio.categories;
const products = shopio.products;
const arrivals = shopio.arrivals;
const displayedProducts = computed(() => products.slice(0, 4));

let interval: ReturnType<typeof setInterval>;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  interval = setInterval(nextSlide, 5000);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-show");
          observer?.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  const elements = document.querySelectorAll(".scroll-reveal");

  elements.forEach((element) => {
    observer?.observe(element);
  });
});

onUnmounted(() => {
  clearInterval(interval);
  observer?.disconnect();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="px-4 md:px-8 py-6">
      <div
        class="relative w-full max-w-300 mx-auto h-140 md:h-160 overflow-hidden rounded-3xl"
      >
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="absolute inset-0 transition-opacity duration-700"
          :class="index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'"
        >
          <img
            :src="slide.image"
            :alt="slide.title"
            class="absolute inset-0 w-full h-full object-cover"
          />

          <div class="absolute inset-0 z-10 flex items-center">
            <div class="px-8 md:px-16 max-w-150 text-white">
              <h1 class="text-2xl font-bold">
                {{ slide.title }}
              </h1>

              <h2 class="text-5xl md:text-7xl font-bold leading-tight">
                {{ slide.highlight }}
              </h2>

              <p class="mt-6 text-base md:text-2xl leading-8 max-w-100">
                {{ slide.description }}
              </p>

              <div class="flex flex-wrap gap-4 mt-8">
                <NuxtLink
                  to="/shop"
                  class="px-7 py-4 rounded-2xl bg-black text-white font-semibold hover:scale-105 transition"
                >
                  Shop Deals
                </NuxtLink>

                <NuxtLink
                  to="/deals"
                  class="px-7 py-4 rounded-2xl bg-gray-400/80 text-white font-semibold hover:scale-105 transition"
                >
                  Explore Deals
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-4 left-4 z-20 flex gap-2">
          <button
            v-for="(slide, index) in slides"
            :key="'dot-' + slide.id"
            @click="goToSlide(index)"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/40'
            "
            :aria-label="`Go to slide ${index + 1}`"
          />
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-5 py-10 scroll-reveal">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Categories</h2>

        <NuxtLink
          to="/shop"
          class="flex items-center gap-1 text-white text-sm bg-orange-500 rounded-full px-3 py-2 hover:bg-orange-600 hover:translate-x-1 transition"
        >
          <span>View All</span>
          <MoveRight :size="20" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <NuxtLink
          v-for="(category, index) in categories"
          :key="category.id"
          to="/shop"
          class="group border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-orange-200 hover:-translate-y-2 transition-all duration-300"
          :style="{
            transitionDelay: `${index * 80}ms`,
          }"
        >
          <div
            class="h-28 w-28 bg-gray-50 rounded-lg overflow-hidden mb-3 mx-auto"
          >
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
          </div>

          <h3 class="text-center text-sm font-semibold text-gray-800">
            {{ category.name }}
          </h3>
        </NuxtLink>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-5 py-8 scroll-reveal">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Popular Products</h2>

        <NuxtLink
          to="/shop"
          class="flex items-center gap-1 text-white text-sm bg-orange-500 rounded-full px-3 py-2 hover:bg-orange-600 hover:translate-x-1 transition"
        >
          <span>View All</span>
          <MoveRight :size="20" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div
          v-for="(product, index) in displayedProducts"
          :key="product.id"
          class="scroll-reveal-child"
          :style="{
            transitionDelay: `${index * 100}ms`,
          }"
        >
          <ProductCard :product="product" />
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-5 py-10 scroll-reveal">
      <div
        class="bg-black rounded-2xl overflow-hidden grid md:grid-cols-2 items-center hover:shadow-2xl transition-shadow duration-500"
      >
        <div class="p-8 md:p-12 text-white">
          <p class="text-gray-50 font-semibold">BIG SUMMER SALE</p>

          <h2 class="text-3xl md:text-4xl font-bold">Save Up To 50%</h2>

          <p class="text-gray-400 mt-3">
            Get amazing deals on selected products.
          </p>

          <NuxtLink
            to="/deals"
            class="inline-block text-black bg-amber-50 hover:bg-amber-500 px-6 py-3 rounded-lg mt-6 font-semibold hover:scale-105 transition"
          >
            Shop Now
          </NuxtLink>
        </div>

        <img
          class="w-full h-64 md:h-72 object-cover hover:scale-105 transition duration-700"
          src="https://i.pinimg.com/1200x/53/2f/71/532f71aa6886d0994a5a98d7755fb81c.jpg"
          alt="Summer Sale"
        />
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-5 py-8 scroll-reveal">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">New Arrivals</h2>

        <NuxtLink
          to="/shop"
          class="flex items-center gap-1 text-white text-sm bg-orange-500 rounded-full px-3 py-2 hover:bg-orange-600 hover:translate-x-1 transition"
        >
          <span>View All</span>
          <MoveRight :size="20" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        <div
          v-for="(item, index) in arrivals"
          :key="item.id"
          class="group scroll-reveal-child"
          :style="{
            transitionDelay: `${index * 100}ms`,
          }"
        >
          <div class="relative bg-gray-500 rounded-2xl overflow-hidden">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
            />

            <button
              class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:scale-110 transition"
            >
              <Heart :size="20" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-5 py-10 scroll-reveal">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="(feature, index) in features"
          :key="feature.id"
          class="flex items-center gap-3 scroll-reveal-child"
          :style="{
            transitionDelay: `${index * 120}ms`,
          }"
        >
          <div
            class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0 hover:scale-110 hover:rotate-6 transition"
          >
            <component
              :is="icons[feature.icon as keyof typeof icons]"
              :size="24"
              class="text-white"
            />
          </div>

          <div>
            <h3 class="font-semibold text-gray-900">
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

<style scoped>
.scroll-reveal {
  opacity: 0;
  transform: translateY(60px);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;
}

.scroll-reveal.reveal-show {
  opacity: 1;
  transform: translateY(0);
}

.scroll-reveal-child {
  opacity: 0;
  transform: translateY(40px) scale(0.96);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}

.reveal-show .scroll-reveal-child {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-reveal,
  .scroll-reveal-child {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>