
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md px-6 sm:px-8 py-8 sm:py-10">
      

      <h1 class="text-lg sm:text-xl font-bold text-gray-800 text-center mb-5 sm:mb-7">Sign In to Your Account</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
            placeholder="Enter your password"
            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed mt-1"
        >
          {{ loading ? "Signing in..." : "Sign In" }}
        </button>

        <p
          v-if="message.text"
          :class="[
            message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200',
            'mt-4 p-3 rounded text-center text-sm'
          ]"
        >
          {{ message.text }}
        </p>

        <div class="text-center text-sm space-y-2 mt-5">
          <p>Don't have an account? <NuxtLink to="/auth/register" class="text-orange-500 font-semibold hover:underline">Sign up</NuxtLink></p>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const API_USERS_URL = 'http://localhost:8000/users'

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)

const message = ref({
  text: '',
  type: ''
})

const handleLogin = async () => {
 
  if (!form.value.email.trim() || !form.value.password.trim()) {
    message.value = {
      text: ' Please fill in all fields.',
      type: 'error'
    }
    return
  }

  loading.value = true
  message.value = {
    text: '',
    type: ''
  }

  try {
  
    const users = await $fetch(API_USERS_URL, {
      method: 'GET'
    })

  
    const user = users.find(
      (user) =>
        user.email.toLowerCase() === form.value.email.trim().toLowerCase() &&
        user.password === form.value.password.trim()
    )

  
    if (!user) {
      message.value = {
        text: '❌ Invalid email or password.',
        type: 'error'
      }
      return
    }

  
    message.value = {
      text: '✅ Login successful! Redirecting...',
      type: 'success'
    }


    const { setUser } = useAuth()
    setUser(user)

  
    setTimeout(() => {
      navigateTo(user.role === 'admin' ? '/admin' : '/')
    }, 700)

  } catch (err) {
    console.error('Login Error:', err)

    message.value = {
      text: '❌ Unable to connect to the server.',
      type: 'error'
    }
  } finally {
    loading.value = false
  }
}
</script>
