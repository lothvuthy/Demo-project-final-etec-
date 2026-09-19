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
      <section class="reveal-section text-center mb-16">
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
      <section class="reveal-section grid md:grid-cols-2 gap-6 mb-16">
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
      <section class="reveal-section text-center mb-16">
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
      <section class="reveal-section text-center mb-16">
        <h2 class="text-lg font-semibold text-gray-900 mb-8">Our Growth</h2>
        <div class="grid grid-cols-3 gap-2 sm:gap-4 md:gap-10 max-w-3xl mx-auto">
          <div
            class="min-w-0 p-3 sm:p-4 rounded-xl bg-linear-to-b from-orange-50 to-white border border-orange-100 shadow-sm"
          >
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-2 leading-tight wrap-break-word">
              {{ stats.customers || "50K+" }}
            </p>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 leading-snug">Happy Customers</p>
          </div>
          <div
            class="min-w-0 p-3 sm:p-4 rounded-xl bg-linear-to-b from-orange-50 to-white border border-orange-100 shadow-sm"
          >
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-2 leading-tight wrap-break-word">
              {{ stats.products || "1,000+" }}
            </p>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 leading-snug">Products Available</p>
          </div>
          <div
            class="min-w-0 p-3 sm:p-4 rounded-xl bg-linear-to-b from-orange-50 to-white border border-orange-100 shadow-sm"
          >
            <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-2 leading-tight wrap-break-word">
              {{ stats.cities || "100+" }}
            </p>
            <p class="text-xs sm:text-sm md:text-base text-gray-600 leading-snug">Cities Served</p>
          </div>
        </div>
      </section>
    </div>

    <!-- ===== Call to Action Section ===== -->


    <!-- ===== Footer ===== -->
        <!-- ===== Footer ===== -->
    <footer class="bg-orange-50 py-8 text-center border-t border-orange-100">
      <p class="font-bold text-orange-500 text-lg mb-3">SHopiO</p>

      <!-- Contact us on social -->
      <p class="text-xs font-semibold text-gray-500 mb-3">Contact us</p>
    <div class="flex justify-center gap-3 mb-4">

  <!-- TikTok -->
  <a
    href="https://tiktok.com/@shopio"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="TikTok"
    class="grid h-11 w-11 place-items-center rounded-full bg-white shadow-md"
  >
    <svg
      class="h-6 w-6"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <!-- TikTok shadow -->
      <path
        fill="#25F4EE"
        d="M15.5 3.2c.3 1.7 1.3 3 2.9 3.7.5.2 1 .3 1.6.3v3.1c-1.4 0-2.8-.4-4-1.1v6.1c0 3.1-2.5 5.7-5.7 5.7S4.6 18.4 4.6 15.3c0-3.1 2.5-5.7 5.7-5.7.4 0 .8 0 1.2.1v3.2c-.4-.1-.8-.2-1.2-.2-1.4 0-2.6 1.1-2.6 2.6s1.1 2.6 2.6 2.6 2.6-1.1 2.6-2.6V3.2h2.6z"
      />

      <!-- TikTok red -->
      <path
        fill="#FE2C55"
        d="M16.5 3.2c.3 1.7 1.3 3 2.9 3.7.5.2 1 .3 1.6.3v2.4c-1.4 0-2.8-.4-4-1.1v6.1c0 3.1-2.5 5.7-5.7 5.7-1.2 0-2.3-.4-3.2-1 1 .2 2 .1 2.9-.4 1.1-.6 1.8-1.8 1.8-3.1V3.2h3.7z"
      />

      <!-- TikTok main -->
      <path
        fill="#111111"
        d="M14.2 2.5v11.9c0 1.7-1.4 3.1-3.1 3.1S8 16.1 8 14.4s1.4-3.1 3.1-3.1c.4 0 .8.1 1.2.2V8.7c-.4-.1-.8-.1-1.2-.1-3.3 0-6 2.6-6 5.8s2.7 5.8 6 5.8 6-2.6 6-5.8V8.3c1.1.6 2.4.9 3.7.9V6.5c-2.2-.1-4-1.8-4.2-4h-2.4z"
      />
    </svg>
  </a>


  <!-- Telegram -->
  <a
    href="https://t.me/shopio"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Telegram"
    class="grid h-11 w-11 place-items-center rounded-full bg-white shadow-md"
  >
    <svg
      class="h-6 w-6"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="12"
        fill="#229ED9"
      />
      <path
        fill="white"
        d="M17.9 6.8L15.2 19c-.2.9-.7 1.1-1.4.7l-3.8-2.8-1.8 1.7c-.2.2-.4.4-.8.4l.3-3.9 7.1-6.4c.3-.3-.1-.4-.5-.1L5.9 14.1l-3.7-1.2c-.8-.3-.8-.8.2-1.2l14.5-5.6c.7-.3 1.3.2 1 1.7z"
      />
    </svg>
  </a>


  <!-- Facebook -->
  <a
    href="https://facebook.com/shopio"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    class="grid h-11 w-11 place-items-center rounded-full bg-white shadow-md"
  >
    <svg
      class="h-6 w-6"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="12"
        fill="#1877F2"
      />
      <path
        fill="white"
        d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.4v3h2.7v8h3.4z"
      />
    </svg>
  </a>

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