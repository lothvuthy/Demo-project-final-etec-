<script setup>
import {
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
  MoveRight,
} from "lucide-vue-next";

import { ref, onMounted, onUnmounted } from "vue";
import shopio from "~/data/shopio.json";

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
const arrivals = shopio.arrivals;
const polaProducts = shopio.polaproducts;
const products = shopio.products;
const featuredProducts = products.slice(0, 4);
let interval = null;
let observer = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const initScrollAnimation = () => {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
};

onMounted(() => {
  interval = setInterval(nextSlide, 5000);

  setTimeout(() => {
    initScrollAnimation();
  }, 100);
});

onUnmounted(() => {
  clearInterval(interval);

  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <div class="min-h-screen bg-white overflow-hidden">
    <section class="px-4 md:px-8 py-6">
      <div
        class="relative max-w-7xl w-full mx-auto h-140 md:h-160 overflow-hidden rounded-3xl shadow-2xl"
      >
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="absolute inset-0 transition-all duration-1000 ease-out"
          :class="
            index === currentSlide
              ? 'opacity-100 scale-100 z-10'
              : 'opacity-0 scale-105 z-0'
          "
        >
          <img
            :src="slide.image"
            :alt="slide.title"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            :loading="index === 0 ? 'eager' : 'lazy'"
            decoding="async"
            class="absolute inset-0 w-full h-full object-cover"
          />

          <div
            class="absolute inset-0 from-black/80 via-black/40 to-transparent"
          ></div>

          <div class="absolute inset-0 z-10 flex items-center">
            <div
              class="px-8 md:px-16 max-w-2xl text-white"
              :class="index === currentSlide ? 'hero-content-active' : ''"
            >
              <p
                class="text-sm md:text-lg font-semibold tracking-[0.25em] uppercase"
              >
                {{ slide.title }}
              </p>

              <h1 class="mt-3 text-5xl md:text-7xl font-black leading-[0.95]">
                {{ slide.highlight }}
              </h1>

              <p
                class="mt-6 text-base md:text-xl text-gray-200 leading-8 max-w-xl"
              >
                {{ slide.description }}
              </p>

              <div class="flex flex-wrap gap-4 mt-8">
                <NuxtLink to="/shop">
                  <button
                    class="group px-7 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    Shop Deals

                    <MoveRight
                      :size="18"
                      class="inline ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </NuxtLink>

                <NuxtLink to="/shop">
                  <button
                    class="px-7 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white hover:text-black text-white font-semibold transition-all duration-300 hover:-translate-y-1"
                  >
                    Explore Deals
                  </button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div
          class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2"
        >
          <button
            v-for="(slide, index) in slides"
            :key="'dot-' + slide.id"
            @click="goToSlide(index)"
            class="h-2 rounded-full transition-all duration-500"
            :class="
              index === currentSlide
                ? 'w-10 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/70'
            "
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-5 py-16">
      <div class="reveal reveal-up flex justify-between items-center mb-8">
        <div>
          <p
            class="text-orange-500 font-semibold text-sm uppercase tracking-widest"
          >
            Explore
          </p>

          <h2 class="text-3xl md:text-4xl font-bold mt-1">Categories</h2>
        </div>

        <NuxtLink
          to="/shop"
          class="hidden sm:flex items-center gap-1 text-white text-sm bg-orange-500 rounded-full px-5 py-3 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-orange-500/20"
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
          class="reveal reveal-up group border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-2xl hover:border-orange-200 transition-all duration-500 hover:-translate-y-2"
          :style="{ transitionDelay: `${index * 80}ms` }"
        >
          <div
            class="w-full h-36 md:h-40 lg:h-44 bg-gray-50 rounded-xl overflow-hidden mb-4"
          >
            <img
              :src="category.image"
              :alt="category.name"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>

          <h3 class="text-center text-sm font-semibold text-gray-800">
            {{ category.name }}
          </h3>

          <p class="text-center text-xs text-gray-500 mt-1">
            {{ category.items }} items
          </p>
        </NuxtLink>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-5 py-16">
      <div class="reveal reveal-up flex justify-between items-center mb-8">
        <div>
          <p
            class="text-orange-500 font-semibold text-sm uppercase tracking-widest"
          >
            Featured
          </p>

          <h2 class="text-3xl md:text-4xl font-bold mt-1">Pola Products</h2>
        </div>

        <NuxtLink
          to="/shop"
          class="hidden sm:flex items-center gap-1 text-white text-sm bg-orange-500 rounded-full px-5 py-3 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300"
        >
          <span>View All</span>
          <MoveRight :size="20" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        <NuxtLink
          v-for="(product, index) in polaProducts"
          :key="product.id"
          to="/shop"
          class="reveal reveal-up group border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-2xl hover:border-orange-200 transition-all duration-500 hover:-translate-y-2"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <div class="w-full h-52 bg-gray-50 rounded-xl overflow-hidden mb-4">
            <img
              :src="product.image"
              :alt="product.name"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>

          <h3
            class="text-center text-sm font-semibold text-gray-800 line-clamp-2"
          >
            {{ product.name }}
          </h3>

          <p class="text-center text-lg font-bold text-orange-500 mt-2">
            ${{ product.price }}
          </p>
        </NuxtLink>
      </div>
    </section>
    <section class="max-w-7xl mx-auto px-5 py-16">
      <div
        class="reveal reveal-scale bg-black rounded-3xl overflow-hidden grid md:grid-cols-2 items-center shadow-2xl"
      >
        <div class="p-8 md:p-14 text-white">
          <p
            class="text-orange-400 font-semibold tracking-[0.2em] text-sm uppercase"
          >
            Big Summer Sale
          </p>

          <h2 class="text-4xl md:text-6xl font-black mt-3 leading-tight">
            Save Up To
            <span class="text-orange-500"> 50% </span>
          </h2>

          <p class="text-gray-400 mt-5 text-lg">
            Get amazing deals on selected products.
          </p>

          <NuxtLink
            to="/shop"
            class="inline-flex items-center gap-2 text-black bg-white hover:bg-orange-500 hover:text-white px-7 py-4 rounded-full mt-7 font-semibold transition-all duration-300 hover:-translate-y-1"
          >
            Shop Now
            <MoveRight :size="18" />
          </NuxtLink>
        </div>

        <div class="overflow-hidden">
          <img
            class="w-full h-72 md:h-100 object-cover hover:scale-105 transition-transform duration-1000"
            src="https://i.pinimg.com/1200x/53/2f/71/532f71aa6886d0994a5a98d7755fb81c.jpg"
            alt="Summer sale"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-5 py-16">
      <div class="reveal reveal-up flex justify-between items-center mb-8">
        <div>
          <p
            class="text-orange-500 font-semibold text-sm uppercase tracking-widest"
          >
            Just In
          </p>

          <h2 class="text-3xl md:text-4xl font-bold mt-1">New Arrivals</h2>
        </div>

        <NuxtLink
          to="/shop"
          class="hidden sm:flex items-center gap-1 text-white text-sm bg-orange-500 rounded-full px-5 py-3 hover:bg-orange-600 transition-all duration-300"
        >
          <span>View All</span>
          <MoveRight :size="20" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        <div
          v-for="(item, index) in arrivals"
          :key="item.id"
          class="reveal reveal-up group"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <NuxtLink to="/shop">
            <div
              class="relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                :src="item.image"
                :alt="item.name"
                loading="lazy"
                decoding="async"
                class="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"
              ></div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-5 py-16">
      <div
        class="reveal reveal-up grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-12"
      >
        <div
          v-for="(feature, index) in features"
          :key="feature.id"
          class="flex items-center gap-4 group"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <div
            class="w-14 h-14 shrink-0 rounded-full bg-orange-500 flex items-center justify-center group-hover:bg-black group-hover:scale-110 transition-all duration-300"
          >
            <component
              :is="icons[feature.icon]"
              :size="24"
              class="text-white"
            />
          </div>

          <div>
            <h3 class="font-semibold text-gray-900">
              {{ feature.title }}
            </h3>

            <p class="text-sm text-gray-500 mt-1">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transition:
    opacity 0.8s ease,
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal-up {
  transform: translateY(60px);
}

.reveal-scale {
  transform: scale(0.94);
}

.reveal.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hero-content-active {
  animation: heroContent 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes heroContent {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .hero-content-active,
  * {
    animation: none !important;
    transition: none !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
</style>
