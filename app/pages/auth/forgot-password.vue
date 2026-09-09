<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md px-6 sm:px-8 py-8 sm:py-10">


      <h2 class="text-lg sm:text-xl font-bold text-gray-800 text-center mb-2">Forgot Password?</h2>
      <p class="text-gray-500 text-sm text-center mb-5 sm:mb-7">Enter your email and we'll send you a link to reset your password.</p>

      <!-- Forgot Password Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            required
            placeholder="Enter your registered email"
            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed mt-1"
        >
          {{ loading ? "Sending..." : "Send Reset Link" }}
        </button>

        <!-- Message Display -->
        <p
          v-if="message.text"
          :class="[
            message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200',
            'mt-4 p-3 rounded text-center text-sm'
          ]"
        >
          {{ message.text }}
        </p>

        <!-- Link Back to Login -->
        <div class="text-center text-sm mt-5">
          <p><NuxtLink to="/auth/login" class="text-sky-600 hover:underline">← Back to Sign In</NuxtLink></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ==============================================
// 🔌 API CONFIGURATION — UPDATE THIS LATER!
// ==============================================
const API_FORGOT_URL = '/api/auth/forgot-password'
// Example full URL: 'http://localhost:5000/api/auth/forgot-password'
// ==============================================

const form = ref({
  email: ''
})

const loading = ref(false)
const message = ref({ text: '', type: '' })

// ========== Submit Handler ==========
const handleSubmit = async () => {
  // Basic validation
  if (!form.value.email.trim()) {
    message.value = { text: '⚠️ Please enter your email address.', type: 'error' }
    return
  }

  loading.value = true
  message.value = { text: '', type: '' }

  try {
    // 📡 API CALL — Ready to connect to backend!
    const result = await $fetch(API_FORGOT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: form.value.email.trim() }
    })

    //  Success
    message.value = {
      text: result.message || ' Reset link sent! Please check your email.',
      type: 'success'
    }

  } catch (err) {
    // ❌ Handle errors
    const errorMsg = err.data?.message || err.message || '❌ Failed to send reset link. Try again later.'
    message.value = { text: errorMsg, type: 'error' }
    console.error('Forgot Password Error:', err)
  } finally {
    loading.value = false
  }
}
</script>