<script setup>
definePageMeta({ middleware: "auth" });

import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  QrCode,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Loader2,
} from "lucide-vue-next";
import { useCart } from "~/composables/useCart";
import { useAuth } from "~/composables/useAuth";

const { items, subtotal, originalSubtotal, discountTotal, clear } = useCart();
const { user } = useAuth();

// URL of the Flask (bakong-api) backend. Change this if you deploy it elsewhere.
const BAKONG_API_BASE = "http://localhost:5000";

const deliveryFee = computed(() => (subtotal.value === 0 || subtotal.value >= 150 ? 0 : 0.01));
const total = computed(() => Math.max(0, subtotal.value + deliveryFee.value));

const paying = ref(false);
const paid = ref(false);
const orderId = ref(null);
const selectedLabel = "KHQR (Bakong)";

// --- Bakong KHQR state ---
const qrImage = ref(null); // base64 data URI returned by /api/generate-qr
const khqrMd5 = ref(null);
const khqrLoading = ref(false);
const khqrError = ref(null); // failure while generating / checking the QR
const orderError = ref(false); // payment succeeded but saving the order failed
let pollTimer = null;
let pollFailCount = 0;
const MAX_POLL_FAILURES = 10; // ~30s of consecutive errors = treat the QR as expired/invalid

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const startPolling = () => {
  stopPolling();
  pollFailCount = 0;
  pollTimer = setInterval(async () => {
    if (!khqrMd5.value) return;
    try {
      const res = await $fetch(`${BAKONG_API_BASE}/api/check-payment`, {
        query: { md5: khqrMd5.value },
      });
      pollFailCount = 0;
      if (res.status === "PAID") {
        stopPolling();
        await confirmPayment();
      }
    } catch (err) {
      pollFailCount += 1;
      console.error("check-payment error:", err);
      if (pollFailCount >= MAX_POLL_FAILURES) {
        stopPolling();
        khqrError.value = "This QR code has expired or is no longer valid. Please generate a new one.";
      }
    }
  }, 3000);
};

const generateKhqr = async () => {
  if (!items.value.length) return;
  khqrLoading.value = true;
  khqrError.value = null;
  orderError.value = false;
  qrImage.value = null;
  khqrMd5.value = null;
  stopPolling();

  try {
    const res = await $fetch(`${BAKONG_API_BASE}/api/generate-qr`, {
      method: "POST",
      body: {
        amount: total.value,
        currency: "USD",
        description: `Order for ${user.value?.name || "Customer"}`,
      },
    });
    qrImage.value = res.qr_image;
    khqrMd5.value = res.md5;
    startPolling();
  } catch (err) {
    console.error("generate-qr error:", err);
    khqrError.value =
      "Could not reach the payment server. Make sure the Bakong API (app.py) is running on port 5000.";
  } finally {
    khqrLoading.value = false;
  }
};

onMounted(() => {
  generateKhqr();
});

onUnmounted(() => {
  stopPolling();
});

const confirmPayment = async () => {
  if (!items.value.length || paying.value || paid.value) return;
  paying.value = true;
  orderError.value = false;

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
        paymentMethod: selectedLabel,
        paymentReference: khqrMd5.value,
        createdAt: new Date().toISOString(),
      },
    });
    orderId.value = order?.id ?? null;
    await clear();
    paid.value = true;
  } catch (err) {
    console.error("Order error:", err);
    // Money was already confirmed as paid by Bakong - only the order record failed to save.
    orderError.value = true;
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

    <!-- Payment succeeded but saving the order failed -->
    <div v-else-if="orderError" class="flex flex-col items-center text-center py-20">
      <XCircle :size="56" class="text-red-500 mb-4" />
      <h1 class="text-2xl font-black text-gray-900">Payment Received, Order Not Saved</h1>
      <p class="text-gray-500 mt-2 max-w-sm">
        Your Bakong payment went through, but we couldn't save your order details.
        <span v-if="khqrMd5">Keep this reference for support: <b class="text-gray-700">{{ khqrMd5 }}</b>.</span>
      </p>
      <button
        type="button"
        class="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500 transition disabled:opacity-70"
        :disabled="paying"
        @click="confirmPayment"
      >
        {{ paying ? "Retrying..." : "Retry Saving Order" }}
      </button>
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
            <h2 class="font-bold text-gray-900 mb-4">Payment method</h2>

            <div class="flex items-center gap-3 border border-orange-500 ring-1 ring-orange-500 bg-orange-50 rounded-xl p-4">
              <div class="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white shrink-0">
                <QrCode :size="20" />
              </div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">KHQR (Bakong)</p>
                <p class="text-xs text-gray-500">Scan with ABA, ACLEDA, Wing, Canadia, or any Bakong-linked bank app</p>
              </div>
            </div>

            <!-- KHQR panel -->
            <div class="mt-6 flex flex-col items-center border-t border-gray-100 pt-6">
              <!-- Loading -->
              <div v-if="khqrLoading" class="w-48 h-48 flex items-center justify-center">
                <Loader2 :size="32" class="animate-spin text-gray-400" />
              </div>

              <!-- Error -->
              <div v-else-if="khqrError" class="w-48 text-center">
                <p class="text-sm text-red-500">{{ khqrError }}</p>
                <button
                  type="button"
                  class="mt-3 text-xs font-semibold text-orange-500 hover:underline"
                  @click="generateKhqr"
                >
                  Try again
                </button>
              </div>

              <!-- Real KHQR image from the Bakong API -->
              <img
                v-else-if="qrImage"
                :src="qrImage"
                alt="KHQR code"
                class="w-48 h-48 rounded-2xl bg-white border border-gray-200 object-contain p-2"
              />

              <p class="text-sm font-semibold text-gray-900 mt-4">
                Scan to pay ${{ total.toFixed(2) }}
              </p>
              <p v-if="qrImage && !khqrError" class="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                <Loader2 :size="12" class="animate-spin" />
                Waiting for payment confirmation...
              </p>
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
          <p class="text-center text-xs text-gray-500">
            Scan the QR code with any Bakong-linked bank app to complete payment automatically.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
