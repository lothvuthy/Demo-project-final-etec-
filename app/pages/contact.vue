<template>
  <div class="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
    <div class="max-w-7xl mx-auto">
      <!-- ===== Main Layout: 2 Columns on Desktop / 1 Column on Mobile ===== -->
      <div class="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start">
        <!-- ====================================== -->
        <!-- LEFT SIDE: Heading + Illustration + Support Cards -->
        <!-- ====================================== -->
        <div class="space-y-6 sm:space-y-8">
          <!-- Heading + Illustration Row -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div class="shrink-0">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Get In<br />Touch
              </h1>
              <p class="text-base sm:text-lg text-gray-600 mt-2 sm:mt-3">Our team is ready to help you</p>
            </div>
            <!-- Team Illustration -->
            <div class="shrink-0 w-full sm:w-44 lg:w-52 flex justify-center sm:justify-end">
              <svg viewBox="0 0 220 160" class="w-full h-auto">
                <!-- Chat bubble -->
                <circle cx="190" cy="28" r="22" fill="#F97316" opacity="0.12"/>
                <circle cx="190" cy="28" r="14" fill="#F97316" opacity="0.25"/>
                <text x="184" y="34" font-size="16" fill="#F97316">💬</text>
                <!-- Team characters -->
                <g transform="translate(20, 15)">
                  <!-- Person 1 -->
                  <circle cx="35" cy="40" r="18" fill="#FF7A30"/>
                  <rect x="18" y="55" width="34" height="30" rx="5" fill="#1F5ED9"/>
                  <path d="M12 46 L35 28 L58 46" stroke="#FF7A30" stroke-width="3.5" fill="none"/>
                  <!-- Person 2 (with headset) -->
                  <circle cx="80" cy="30" r="18" fill="#FBBF24"/>
                  <rect x="62" y="45" width="36" height="32" rx="5" fill="#3B82F6"/>
                  <!-- Headset -->
                  <rect x="68" y="14" width="24" height="12" rx="5" stroke="#374151" stroke-width="2.5" fill="none"/>
                  <circle cx="62" cy="20" r="5" fill="#374151"/>
                  <circle cx="98" cy="20" r="5" fill="#374151"/>
                  <!-- Person 3 -->
                  <circle cx="125" cy="40" r="18" fill="#FBBF24"/>
                  <rect x="107" y="55" width="36" height="30" rx="5" fill="#FF7A30"/>
                  <!-- Person 4 -->
                  <circle cx="80" cy="75" r="18" fill="#FBBF24"/>
                  <rect x="62" y="90" width="36" height="26" rx="5" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1.5"/>
                  <path d="M68 90 L80 98 L92 90" stroke="#374151" stroke-width="2.5" fill="none"/>
                </g>
              </svg>
            </div>
          </div>
          <!-- ===== Three Support Cards Row ===== -->
          <div class="grid grid-cols-3 gap-3 sm:gap-4">
            <!-- Live Chat Card -->
            <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-5 relative">
              <button class="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg font-medium">
                ›
              </button>
              <div class="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h3 class="font-bold text-gray-900 text-sm sm:text-base">Live Chat</h3>
              <p class="font-medium text-gray-600 text-xs sm:text-sm mt-1">Available</p>
              <p class="text-xs text-gray-400 mt-1">Always here to help</p>
            </div>
            <!-- Email Support Card -->
            <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-5 relative">
              <button class="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg font-medium">
                ›
              </button>
              <div class="w-12 h-12 sm:w-14 sm:h-14 bg-sky-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="font-bold text-gray-900 text-sm sm:text-base">Email Support</h3>
              <p class="font-medium text-gray-600 text-xs sm:text-sm mt-1">Get in touch</p>
              <p class="text-xs text-gray-400 mt-1">support@shopio.com</p>
            </div>
            <!-- FAQs Card -->
            <div class="bg-white rounded-2xl shadow-sm p-4 sm:p-5 relative">
              <button class="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg font-medium">
                ›
              </button>
              <div class="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <h3 class="font-bold text-gray-900 text-sm sm:text-base">FAQs</h3>
              <p class="font-medium text-gray-600 text-xs sm:text-sm mt-1">Questions</p>
              <p class="text-xs text-gray-400 mt-1">Quick answers inside</p>
            </div>
          </div>
        </div>
        <!-- ====================================== -->
        <!-- RIGHT SIDE: Contact Form Card -->
        <!-- ====================================== -->
        <div class="bg-white rounded-2xl shadow-md p-5 sm:p-6 lg:p-8">
          <!-- Form Header: Back Arrow | Title | Dropdown Arrow -->
          <div class="flex items-center justify-between mb-6">
            <NuxtLink to="/" class="text-gray-600 hover:text-orange-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </NuxtLink>
            <h2 class="text-lg sm:text-xl font-bold text-gray-900">Contact Us</h2>
            <button class="text-gray-500 hover:text-gray-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
          <!-- Contact Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Full Name -->
            <div>
              <input
                v-model="form.fullName"
                type="text"
                required
                placeholder="Full Name"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 text-gray-700 text-base"
              />
            </div>
            <!-- Email -->
            <div>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="Email"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 text-gray-700 text-base"
              />
            </div>
            <!-- Order Number Dropdown -->
            <div>
              <select
                v-model="form.orderNumber"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 text-gray-500 bg-white text-base"
              >
                <option value="">Order Number</option>
                <option value="1">Order #12345</option>
                <option value="2">Order #12346</option>
                <option value="3">Order #12347</option>
              </select>
            </div>
            <!-- Subject -->
            <div>
              <input
                v-model="form.subject"
                type="text"
                required
                placeholder="Subject"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 text-gray-700 text-base"
              />
            </div>
            <!-- Message Textarea -->
            <div>
              <textarea
                v-model="form.message"
                rows="3"
                required
                placeholder="Message"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 text-gray-700 text-base resize-none"
              ></textarea>
            </div>
            <!-- Login notice -->
            <p v-if="!isLoggedIn" class="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-3">
              Please
              <NuxtLink to="/auth/login" class="text-orange-500 font-semibold hover:underline">sign in</NuxtLink>
              (or
              <NuxtLink to="/auth/register" class="text-orange-500 font-semibold hover:underline">create an account</NuxtLink>)
              to send us a message.
            </p>

            <!-- Send Message Button -->
            <button
              type="submit"
              :disabled="loading || !isLoggedIn"
              class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-orange-300 mt-2 text-base"
            >
              {{ loading ? "Sending..." : "Send Message" }}
            </button>
            <!-- Success / Error Message -->
            <p
              v-if="message.text"
              :class="[
                message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100',
                'mt-3 p-3 rounded-lg text-center text-sm'
              ]"
            >
              {{ message.text }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useAuth } from '~/composables/useAuth'

// ==============================================
// 🔌 API CONFIGURATION — json-server, same backend as auth/cart/wishlist
// ==============================================
const API_MESSAGES_URL = 'http://localhost:8000/messages'

const { user, isLoggedIn } = useAuth()

const form = ref({
  fullName: '',
  email: '',
  orderNumber: '',
  subject: '',
  message: ''
})

// Prefill name/email once we know who's logged in
watchEffect(() => {
  if (user.value) {
    form.value.fullName = form.value.fullName || user.value.name || ''
    form.value.email = form.value.email || user.value.email || ''
  }
})

const loading = ref(false)
const message = ref({ text: '', type: '' })

// ========== Handle Form Submission ==========
const handleSubmit = async () => {
  if (!isLoggedIn.value) {
    message.value = { text: '⚠️ Please sign in first to send a message.', type: 'error' }
    return
  }

  // Validation
  if (!form.value.fullName.trim() || !form.value.email.trim() || !form.value.subject.trim() || !form.value.message.trim()) {
    message.value = { text: '⚠️ Please fill in all required fields.', type: 'error' }
    return
  }
  loading.value = true
  message.value = { text: '', type: '' }
  try {
    // 📡 Send data to the json-server backend
    await $fetch(API_MESSAGES_URL, {
      method: 'POST',
      body: {
        userId: user.value?.id,
        ...form.value,
        createdAt: new Date().toISOString()
      }
    })
    // ✅ Success
    message.value = { text: '✅ Message sent successfully! We will reply soon.', type: 'success' }
    // Reset form (keep name/email prefilled)
    form.value = {
      fullName: user.value?.name || '',
      email: user.value?.email || '',
      orderNumber: '',
      subject: '',
      message: ''
    }
  } catch (err) {
    // ❌ Error
    message.value = { text: '❌ Failed to send message. Please try again.', type: 'error' }
    console.error('Contact Error:', err)
  } finally {
    loading.value = false
  }
}
</script>