<template>
  <div class="min-h-screen bg-white">
    <!-- ===== 🎨 Hero Banner — Orange → Blue Gradient ===== -->
    <section
      class="relative h-64 sm:h-80 lg:h-96 flex items-center justify-center overflow-hidden"
    >
      <!-- Orange to Blue Gradient Background -->
      <div
        class="absolute inset-0 bg-linear-to-r from-orange-500 to-blue-600"
      ></div>
      <!-- Optional: Soft overlay for better text readability -->
      <div class="absolute inset-0 bg-black/10"></div>
      <h1
        class="relative text-4xl sm:text-5xl font-bold text-white z-10 tracking-wide drop-shadow-md"
      >
        Our Story
      </h1>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
      <!-- ===== Journey Section ===== -->
      <section class="text-center mb-16">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
          The Journey So Far
        </h2>
        <p
          class="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed"
        >
          {{
            shopInfo.journey ||
            "SHopiO began with a simple idea: to make quality products accessible to everyone, effortlessly. From our humble beginnings in a small startup garage, we've grown into a global destination for curated goods. We believe in the power of good design and reliable service to simplify your daily life."
          }}
        </p>
      </section>
      <!-- ===== Mission & Vision ===== -->
      <section class="grid md:grid-cols-2 gap-6 mb-16">
        <!-- Our Mission -->
        <div class="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
          <div
            class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Our Mission</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{
              shopInfo.mission ||
              "To curate and deliver thoughtfully designed products that enhance the everyday lives of our customers, fostering a community built on trust and exceptional quality."
            }}
          </p>
        </div>

        <!-- Our Vision -->
        <div class="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-400">
          <div
            class="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Our Vision</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{
              shopInfo.vision ||
              "To be the world's most reliable and inspiring marketplace, setting the standard for modern minimalism, sustainable practices, and effortless customer experiences."
            }}
          </p>
        </div>
      </section>

      <!-- ===== Core Values ===== -->
      <section class="text-center mb-16">
        <h2 class="text-lg font-semibold text-gray-900 mb-8">Core Values</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="flex flex-col items-center">
            <div
              class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3"
            >
              <svg
                class="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700"
              >Sustainability</span
            >
          </div>
          <div class="flex flex-col items-center">
            <div
              class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3"
            >
              <svg
                class="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700">Customer Love</span>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3"
            >
              <svg
                class="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700">Fast Shipping</span>
          </div>
          <div class="flex flex-col items-center">
            <div
              class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3"
            >
              <svg
                class="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700"
              >Premium Quality</span
            >
          </div>
        </div>
      </section>

      <hr class="border-orange-100 mb-12" />

      <!-- ===== Stats Section ===== -->
      <section class="text-center mb-16">
        <h2 class="text-lg font-semibold text-gray-900 mb-8">Our Growth</h2>
        <div class="grid grid-cols-3 gap-2 sm:gap-4 md:gap-10 max-w-3xl mx-auto">
          <div
            class="min-w-0 p-3 sm:p-4 rounded-xl bg-linear-to-b from-orange-50 to-white border border-orange-100 shadow-sm"
          >
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-2 leading-tight break-words">
              {{ stats.customers || "50K+" }}
            </p>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 leading-snug">Happy Customers</p>
          </div>
          <div
            class="min-w-0 p-3 sm:p-4 rounded-xl bg-linear-to-b from-orange-50 to-white border border-orange-100 shadow-sm"
          >
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-2 leading-tight break-words">
              {{ stats.products || "1,000+" }}
            </p>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 leading-snug">Products Available</p>
          </div>
          <div
            class="min-w-0 p-3 sm:p-4 rounded-xl bg-linear-to-b from-orange-50 to-white border border-orange-100 shadow-sm"
          >
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-2 leading-tight break-words">
              {{ stats.cities || "100+" }}
            </p>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 leading-snug">Cities Served</p>
          </div>
        </div>
      </section>
    </div>

    <!-- ===== Call to Action Section ===== -->


    <!-- ===== Footer ===== -->
    <footer class="bg-orange-50 py-8 text-center border-t border-orange-100">
      <p class="font-bold text-orange-500 text-lg mb-3">SHopiO</p>
      <div class="flex justify-center gap-4 mb-3">
        <NuxtLink
          to="#"
          class="text-xs text-gray-500 hover:text-orange-500 transition-colors"
          >Privacy Policy</NuxtLink
        >
        <span class="text-gray-300">|</span>
        <NuxtLink
          to="#"
          class="text-xs text-gray-500 hover:text-orange-500 transition-colors"
          >Terms of Service</NuxtLink
        >
        <span class="text-gray-300">|</span>
        <NuxtLink
          to="#"
          class="text-xs text-gray-500 hover:text-orange-500 transition-colors"
          >Shipping Info</NuxtLink
        >
      </div>
      <p class="text-xs text-gray-400">
        © {{ new Date().getFullYear() }} SHopiO. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const API_ABOUT_URL = "/api/about";

const shopInfo = ref({
  journey: "",
  mission: "",
  vision: "",
});



const stats = ref({
  customers: "",
  products: "",
  cities: "",
});

onMounted(async () => {
  try {
    const data = await $fetch(API_ABOUT_URL, { method: "GET" });
    if (data.journey) shopInfo.value.journey = data.journey;
    if (data.mission) shopInfo.value.mission = data.mission;
    if (data.vision) shopInfo.value.vision = data.vision;
    if (data.stats) {
      stats.value.customers = data.stats.customers || "";
      stats.value.products = data.stats.products || "";
      stats.value.cities = data.stats.cities || "";
    }
  } catch (err) {
    console.log("API not connected — showing default content");
  }
});
</script>
