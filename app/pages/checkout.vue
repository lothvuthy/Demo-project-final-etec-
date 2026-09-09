<script setup>
definePageMeta({ middleware: "auth" });

import { ref, computed } from "vue";
import {
  Landmark,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
} from "lucide-vue-next";
import { useCart } from "~/composables/useCart";
import { useAuth } from "~/composables/useAuth";

const { items, subtotal, originalSubtotal, discountTotal, clear } = useCart();
const { user } = useAuth();

const deliveryFee = computed(() => (subtotal.value === 0 || subtotal.value >= 150 ? 0 : 15));
const total = computed(() => Math.max(0, subtotal.value + deliveryFee.value));

const banks = [
  { id: "aba", name: "ABA PAY", color: "#1e3a8a" },
  { id: "acleda", name: "ACLEDA Bank", color: "#0f766e" },
  { id: "wing", name: "Wing Bank", color: "#dc2626" },
  { id: "canadia", name: "Canadia Bank", color: "#b91c1c" },
];

const method = ref("khqr"); // 'khqr' | bank id
const paying = ref(false);
const paid = ref(false);
const orderId = ref(null);

const selectedLabel = computed(() => {
  if (method.value === "khqr") return "KHQR (Bakong)";
  return banks.find((b) => b.id === method.value)?.name ?? "";
});

const confirmPayment = async () => {
  if (!items.value.length || paying.value) return;
  paying.value = true;

  try {
    // Record the order on the same json-server backend used everywhere else
    const order = await $fetch("http://localhost:8000/orders", {
      method: "POST",
      body: {
        userId: user.value?.id,
        userName: user.value?.name || '',
        userEmail: user.value?.email || '',
        userAddress: user.value?.address || '',
        items: items.value,
        subtotal: subtotal.value,
        discount: discountTotal.value,
        deliveryFee: deliveryFee.value,
        total: total.value,
        paymentMethod: selectedLabel.value,
        createdAt: new Date().toISOString(),
      },
    });
    orderId.value = order?.id ?? null;
    await clear();
    paid.value = true;
  } catch (err) {
    console.error("Order error:", err);
  } finally {
    paying.value = false;
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10">
    <!-- Success state -->
    <div v-if="paid" class="flex flex-col items-center text-center py-20">
      <CheckCircle2 :size="56" class="text-green-500 mb-4" />
      <h1 class="text-2xl font-black text-gray-900">Payment Successful</h1>
      <p class="text-gray-500 mt-2 max-w-sm">
        Paid via {{ selectedLabel }}<span v-if="orderId"> · Order #{{ orderId }}</span>.
        This is a demo checkout — no real money was transferred.
      </p>
      <NuxtLink
        to="/shop"
        class="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500 transition"
      >
        Continue Shopping
      </NuxtLink>
    </div>

    <!-- Empty cart -->
    <div
      v-else-if="!items.length"
      class="flex flex-col items-center text-center py-24"
    >
      <ShoppingBag :size="40" class="mb-4 text-gray-300" />
      <h3 class="text-xl font-bold text-gray-900">Nothing to check out</h3>
      <p class="mt-2 text-sm text-gray-500">Your cart is empty.</p>
      <NuxtLink
        to="/shop"
        class="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition"
      >
        Browse Shop
      </NuxtLink>
    </div>

    <!-- Checkout -->
    <div v-else>
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <NuxtLink to="/cart" class="hover:text-orange-500">Cart</NuxtLink>
        <span>›</span>
        <span class="text-gray-900 font-medium">Checkout</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-8">
        PAYMENT
      </h1>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Payment methods -->
        <div class="lg:col-span-2 space-y-6">
          <div class="border border-gray-200 rounded-2xl p-6">
            <h2 class="font-bold text-gray-900 mb-4">Choose a payment method</h2>

            <div class="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                class="flex items-center gap-3 border rounded-xl p-4 text-left transition"
                :class="
                  method === 'khqr'
                    ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
                @click="method = 'khqr'"
              >
                <div class="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white shrink-0">
                  <QrCode :size="20" />
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">KHQR (Bakong)</p>
                  <p class="text-xs text-gray-500">Scan with any bank app</p>
                </div>
              </button>

              <button
                v-for="bank in banks"
                :key="bank.id"
                type="button"
                class="flex items-center gap-3 border rounded-xl p-4 text-left transition"
                :class="
                  method === bank.id
                    ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                "
                @click="method = bank.id"
              >
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                  :style="{ backgroundColor: bank.color }"
                >
                  <Landmark :size="18" />
                </div>
                <div>
                  <p class="font-semibold text-gray-900 text-sm">{{ bank.name }}</p>
                  <p class="text-xs text-gray-500">Pay from your account</p>
                </div>
              </button>
            </div>

            <!-- KHQR panel -->
            <div v-if="method === 'khqr'" class="mt-6 flex flex-col items-center border-t border-gray-100 pt-6">
              <div class="w-48 h-48 rounded-2xl bg-white border border-gray-200 grid grid-cols-8 grid-rows-8 gap-0.5 p-3">
                <div
                  v-for="i in 64"
                  :key="i"
                  class="rounded-[1px]"
                  :class="(i * 7 + Math.floor(i / 8) * 3) % 5 === 0 ? 'bg-gray-900' : 'bg-transparent'"
                ></div>
              </div>
              <p class="text-sm font-semibold text-gray-900 mt-4">
                Scan to pay ${{ total.toFixed(2) }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                Demo QR for preview only — not linked to a real bank
              </p>
            </div>

            <!-- Bank redirect note -->
            <div v-else class="mt-6 border-t border-gray-100 pt-6 flex items-center gap-3 text-sm text-gray-500">
              <ShieldCheck :size="18" class="text-orange-500 shrink-0" />
              You'll be asked to confirm this payment in your {{ selectedLabel }} app (simulated in this demo).
            </div>
          </div>

          <!-- Items being paid for -->
          <div class="border border-gray-200 rounded-2xl p-6">
            <h2 class="font-bold text-gray-900 mb-4">Items ({{ items.length }})</h2>
            <div class="space-y-3">
              <div v-for="item in items" :key="item.id" class="flex items-center gap-3">
                <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                  <p class="text-xs text-gray-500">Qty {{ item.qty }}</p>
                </div>
                <p class="text-sm font-semibold text-gray-900">
                  ${{ (item.price * item.qty).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary + confirm -->
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
            <div class="flex justify-between">
              <span class="text-gray-500">Delivery Fee</span>
              <span class="font-semibold text-gray-900">
                {{ deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}` }}
              </span>
            </div>
          </div>
          <div class="border-t border-gray-100 my-4"></div>
          <div class="flex justify-between items-center mb-6">
            <span class="text-base font-bold text-gray-900">Total</span>
            <span class="text-2xl font-black text-gray-900">${{ total.toFixed(2) }}</span>
          </div>
          <button
            type="button"
            class="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-full hover:bg-orange-500 transition disabled:opacity-70"
            :disabled="paying"
            @click="confirmPayment"
          >
            {{ paying ? "Processing..." : `Pay ${selectedLabel}` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
