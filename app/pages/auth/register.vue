<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md px-6 sm:px-8 py-8 sm:py-10">

      <h1 class="text-lg sm:text-xl font-bold text-gray-800 text-center mb-5 sm:mb-7">Create Your Account</h1>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            required
            placeholder="Enter your full name"
            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-colors"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            required
            placeholder="Enter your email"
            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-colors"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            required
            placeholder="Create a password (min 6 characters)"
            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-colors"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            id="confirmPassword"
            required
            placeholder="Confirm your password"
            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed mt-1"
        >
          {{ loading ? "Creating Account..." : "Sign Up" }}
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

        <!-- Link to Login -->
        <div class="text-center text-sm mt-5">
          <p>Already have an account? <NuxtLink to="/auth/login" class="text-orange-500 font-semibold hover:underline">Sign in</NuxtLink></p>
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
const API_REGISTER_URL = 'http://localhost:8000/users'
// Example full URL: 'http://localhost:5000/api/auth/register'
// ==============================================

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const message = ref({ text: '', type: '' })

// ========== Register Handler ==========
const handleRegister = async () => {
  // 1. Basic validation
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.password.trim()) {
    message.value = { text: '⚠️ Please fill in all fields.', type: 'error' }
    return
  }

  if (form.value.password.length < 6) {
    message.value = { text: '⚠️ Password must be at least 6 characters.', type: 'error' }
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    message.value = { text: '⚠️ Passwords do not match.', type: 'error' }
    return
  }

  loading.value = true
  message.value = { text: '', type: '' }

  try {
    // 2. 📡 API CALL — Ready to connect to backend!
    const result = await $fetch(API_REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        password: form.value.password,
        wishlist: [],
        cart: [],
        role: 'user'
      }
    })

    // ✅ Success
    message.value = { text: '✅ Account created successfully! Redirecting...', type: 'success' }

    // Save token if backend returns one
    if (result.token) {
      localStorage.setItem('eshop_token', result.token)
      localStorage.setItem('eshop_user', JSON.stringify(result.user || {}))
    }

    // Redirect to login page after delay
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 1500)

  } catch (err) {
    // ❌ Handle errors
    const errorMsg = err.data?.message || err.message || 'Registration failed. Please try again.'
    message.value = { text: `❌ ${errorMsg}`, type: 'error' }
    console.error('Register Error:', err)
  } finally {
    loading.value = false
  }
}
</script>