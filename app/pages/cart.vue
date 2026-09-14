<script setup>
definePageMeta({ middleware: "auth" });

import { ref, computed } from "vue";
import { Trash2, Minus, Plus, ArrowRight, Tag, ShoppingBag } from "lucide-vue-next";
import { useCart } from "~/composables/useCart";
import { usePayment } from "~/composables/usePayment";

const { items, subtotal, originalSubtotal, discountTotal, remove, updateQty } = useCart();
const { openPayment } = usePayment();

// Simple flat delivery fee, free above $150 — presentation only, not a
// real shipping calculation.
const deliveryFee = computed(() => (subtotal.value === 0 || subtotal.value >= 150 ? 0 : 15));

// Demo promo code (client-side only — no backend for real codes)
const promoCode = ref("");
const promoApplied = ref(false);
const promoError = ref("");
const promoDiscount = computed(() =>
  promoApplied.value ? Math.round(subtotal.value * 0.1 * 100) / 100 : 0
);

const applyPromo = () => {
  if (promoCode.value.trim().toUpperCase() === "SAVE10") {
    promoApplied.value = true;
    promoError.value = "";
  } else {
    promoApplied.value = false;
    promoError.value = "Invalid promo code";
  }
};

const total = computed(() =>
  Math.max(0, subtotal.value - promoDiscount.value + deliveryFee.value)
);

const goToCheckout = () => {
  openPayment();
};
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <NuxtLink to="/" class="hover:text-orange-500">Home</NuxtLink>
      <span>›</span>
      <span class="text-gray-900 font-medium">Cart</span>
    </div>

    <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-8">
      YOUR CART
    </h1>

    <div v-if="items.length" class="grid lg:grid-cols-3 gap-6">
      <!-- Items -->
      <div class="lg:col-span-2 border border-gray-200 rounded-2xl divide-y divide-gray-100">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-start gap-4 p-5"
        >
          <NuxtLink :to="`/product/${item.id}`" class="shrink-0">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-100"
            />
          </NuxtLink>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <NuxtLink
                :to="`/product/${item.id}`"
                class="font-semibold text-gray-900 hover:text-orange-500 transition"
              >
                {{ item.name }}
              </NuxtLink>
              <button
                type="button"
                aria-label="Remove item"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition shrink-0"
                @click="remove(item.id)"
              >
                <Trash2 :size="15" />
              </button>
            </div>

            <p v-if="item.oldPrice" class="text-xs text-gray-400 mt-1">
              Was <span class="line-through">${{ item.oldPrice.toFixed(2) }}</span>
            </p>

            <div class="flex items-end justify-between mt-3">
              <p class="text-lg font-bold text-gray-900">${{ item.price.toFixed(2) }}</p>
              <div class="flex items-center border border-gray-200 rounded-full bg-white">
                <button
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-500"
                  aria-label="Decrease quantity"
                  @click="updateQty(item.id, item.qty - 1)"
                >
                  <Minus :size="14" />
                </button>
                <span class="w-6 text-center text-sm font-medium">{{ item.qty }}</span>
                <button
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-500"
                  aria-label="Increase quantity"
                  @click="updateQty(item.id, item.qty + 1)"
                >
                  <Plus :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="border border-gray-200 rounded-2xl p-6 h-fit">
        <h2 class="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Subtotal</span>
            <span class="font-semibold text-gray-900">${{ originalSubtotal.toFixed(2) }}</span>
          </div>
          <div v-if="discountTotal > 0" class="flex justify-between">
            <span class="text-gray-500">Discount</span>
            <span class="font-semibold text-red-500">-${{ discountTotal.toFixed(2) }}</span>
          </div>
          <div v-if="promoApplied" class="flex justify-between">
            <span class="text-gray-500">Promo (SAVE10)</span>
            <span class="font-semibold text-red-500">-${{ promoDiscount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Delivery Fee</span>
            <span class="font-semibold text-gray-900">
              {{ deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}` }}
            </span>
          </div>
        </div>

        <div class="border-t border-gray-100 my-4"></div>

        <div class="flex justify-between items-center mb-5">
          <span class="text-base font-bold text-gray-900">Total</span>
          <span class="text-2xl font-black text-gray-900">${{ total.toFixed(2) }}</span>
        </div>

        <div class="flex items-center gap-2 mb-2">
          <div class="flex-1 flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5">
            <Tag :size="16" class="text-gray-400" />
            <input
              v-model="promoCode"
              type="text"
              placeholder="Add promo code"
              class="flex-1 outline-none text-sm bg-transparent"
            />
          </div>
          <button
            type="button"
            class="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-orange-500 transition"
            @click="applyPromo"
          >
            Apply
          </button>
        </div>
        <p v-if="promoError" class="text-xs text-red-500 mb-3">{{ promoError }}</p>
        <p v-else-if="promoApplied" class="text-xs text-green-600 mb-3">Promo code applied!</p>

        <button
          type="button"
          class="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3.5 rounded-full hover:bg-orange-500 transition"
          @click="goToCheckout"
        >
          Go to Checkout
          <ArrowRight :size="18" />
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
      <ShoppingBag :size="40" class="mb-4 text-gray-300" />
      <h3 class="text-xl font-bold text-gray-900">Your cart is empty</h3>
      <p class="mt-2 text-sm text-gray-500">Add something you like from the shop.</p>
      <NuxtLink
        to="/shop"
        class="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition"
      >
        Browse Shop
      </NuxtLink>
    </div>
  </div>
</template>
