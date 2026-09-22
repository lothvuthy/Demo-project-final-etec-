<script setup>
import { CheckCircle2, XCircle, Loader2, X } from "lucide-vue-next";
import { usePayment } from "~/composables/usePayment";

const {
  total,
  showModal,
  paying,
  paid,
  orderId,
  orderError,
  selectedLabel,
  qrImage,
  khqrMd5,
  khqrLoading,
  khqrError,
  user,
  closePayment,
  generateKhqr,
  confirmPayment,
} = usePayment();

const handleBackdropClick = () => {
  if (paying.value) return; // don't let an in-flight order save get dismissed
  closePayment();
};

const handleDone = () => {
  closePayment();
};
</script>

<template>
  <Teleport to="body">
    <Transition name="payment-fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8"
        @click.self="handleBackdropClick"
      >
        <div class="relative w-full max-w-85">
          <button
            v-if="!paying"
            type="button"
            aria-label="Close"
            class="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
            @click="closePayment"
          >
            <X :size="16" />
          </button>

          <!-- Success -->
          <div v-if="paid" class="bg-white rounded-2xl p-7 text-center shadow-xl">
            <CheckCircle2 :size="48" class="text-green-500 mx-auto mb-3" />
            <h3 class="text-lg font-black text-gray-900">Payment Successful</h3>
            <p class="text-xs text-gray-500 mt-2">
              Paid via {{ selectedLabel }}<span v-if="orderId"> · Order #{{ orderId }}</span>.
              This is a demo checkout — no real money was transferred.
            </p>
            <button
              type="button"
              class="mt-5 w-full rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition"
              @click="handleDone"
            >
              Continue Shopping
            </button>
          </div>

          <!-- Payment succeeded but saving the order failed -->
          <div v-else-if="orderError" class="bg-white rounded-2xl p-7 text-center shadow-xl">
            <XCircle :size="48" class="text-red-500 mx-auto mb-3" />
            <h3 class="text-lg font-black text-gray-900">Payment Received, Order Not Saved</h3>
            <p class="text-xs text-gray-500 mt-2">
              Your Bakong payment went through, but we couldn't save your order details.
              <span v-if="khqrMd5">Keep this reference for support: <b class="text-gray-700">{{ khqrMd5 }}</b>.</span>
            </p>
            <button
              type="button"
              class="mt-5 w-full rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition disabled:opacity-70"
              :disabled="paying"
              @click="confirmPayment"
            >
              {{ paying ? "Retrying..." : "Retry Saving Order" }}
            </button>
          </div>

          <!-- KHQR card -->
          <template v-else>
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
              <!-- Ribbon banner -->
              <div
                class="relative h-12 bg-red-600 flex items-center justify-center"
                style="clip-path: polygon(0 0, 100% 0, 100% 68%, 86% 100%, 86% 68%, 0 68%)"
              >
                <span class="font-black italic text-white text-lg tracking-tight select-none">KH<span class="text-white/90">QR</span></span>
              </div>

              <div class="px-5 pt-4 pb-6">
                <p class="text-sm text-gray-500">{{ user?.name || "Customer" }}</p>
                <p class="mt-0.5">
                  <span class="text-lg font-bold text-gray-900">{{ total.toFixed(2) }}</span>
                  <span class="text-[11px] text-gray-400 font-semibold ml-1">USD</span>
                </p>

                <div class="border-t border-dashed border-gray-200 my-4"></div>

                <div class="flex items-center justify-center min-h-64">
                  <!-- Loading -->
                  <div v-if="khqrLoading" class="w-60 h-60 flex items-center justify-center">
                    <Loader2 :size="28" class="animate-spin text-gray-400" />
                  </div>

                  <!-- Error -->
                  <div v-else-if="khqrError" class="w-full text-center px-2">
                    <p class="text-xs text-red-500">{{ khqrError }}</p>
                    <button
                      v-if="khqrMd5?.startsWith('demo-')"
                      type="button"
                      class="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
                      @click="confirmPayment"
                    >
                      Place demo order
                    </button>
                    <button
                      type="button"
                      class="mt-3 text-xs font-semibold text-orange-500 hover:underline"
                      @click="generateKhqr"
                    >
                      Try again
                    </button>
                  </div>

                  <!-- QR image -->
                  <img
                    v-else-if="qrImage"
                    :src="qrImage"
                    alt="KHQR code"
                    class="w-80 h-80 rounded-xl bg-white object-contain"
                  />
                </div>
              </div>
            </div>

            <p class="text-center font-bold text-[15px] mt-5" style="color:#1d3557">
              Scan to pay ${{ total.toFixed(2) }}
            </p>
            <p
              v-if="qrImage && !khqrError"
              class="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-1.5"
            >
              <Loader2 :size="12" class="animate-spin" />
              Waiting for payment confirmation...
            </p>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.payment-fade-enter-active,
.payment-fade-leave-active {
  transition: opacity 0.15s ease;
}
.payment-fade-enter-from,
.payment-fade-leave-to {
  opacity: 0;
}
</style>
