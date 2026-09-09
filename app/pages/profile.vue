<script setup lang="ts">
import { ref } from 'vue'
import { User, Mail, MapPin, ShieldCheck, Save, ArrowLeft, Camera, X } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const { user, isLoggedIn, updateUser } = useAuth()
const saving = ref(false)
const message = ref('')
const error = ref('')
const name = ref(user.value?.name || '')
const address = ref(user.value?.address || '')
const avatar = ref(user.value?.avatar || '')
const fileInput = ref<HTMLInputElement | null>(null)

if (!isLoggedIn.value) {
  await navigateTo('/auth/login')
}

const chooseAvatar = () => fileInput.value?.click()

const onAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  error.value = ''
  if (!file.type.startsWith('image/')) {
    error.value = 'Please choose an image file.'
    input.value = ''
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    error.value = 'Profile image must be 2MB or smaller.'
    input.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => { avatar.value = String(reader.result || '') }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  avatar.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const saveProfile = async () => {
  if (!user.value || !name.value.trim()) return
  saving.value = true
  message.value = ''
  error.value = ''
  try {
    await updateUser({
      name: name.value.trim(),
      address: address.value.trim(),
      avatar: avatar.value
    })
    message.value = 'Profile updated successfully.'
  } catch {
    error.value = 'Unable to update profile. Make sure the API server is running.'
  } finally { saving.value = false }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-10">
    <div class="mx-auto max-w-3xl">
      <NuxtLink to="/" class="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-500">
        <ArrowLeft :size="18" /> Back to Home
      </NuxtLink>
      <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-8">
        <div class="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-orange-500 text-3xl font-bold text-white ring-4 ring-orange-50">
              <img v-if="avatar" :src="avatar" alt="Profile photo" class="h-full w-full object-cover" />
              <span v-else>{{ (user?.name || '?').charAt(0).toUpperCase() }}</span>
            </div>
            <button type="button" aria-label="Change profile photo" class="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white shadow-sm hover:bg-orange-600" @click="chooseAvatar">
              <Camera :size="17" />
            </button>
          </div>
          <div class="text-center sm:text-left">
            <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
            <div class="mt-1 flex items-center justify-center gap-2 text-sm text-gray-500 sm:justify-start">
              <ShieldCheck v-if="user?.role === 'admin'" :size="16" class="text-orange-500" />
              {{ user?.role === 'admin' ? 'Administrator' : 'User' }}
            </div>
            <div class="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <button type="button" class="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-100" @click="chooseAvatar">{{ avatar ? 'Change photo' : 'Add photo' }}</button>
              <button v-if="avatar" type="button" class="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200" @click="removeAvatar"><X :size="13" /> Remove</button>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
          </div>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div class="rounded-2xl bg-gray-50 p-4"><p class="text-xs font-semibold uppercase text-gray-400">Email</p><p class="mt-2 flex min-w-0 items-center gap-2 font-medium break-all"><Mail :size="17" class="shrink-0" /> {{ user?.email }}</p></div>
          <div class="rounded-2xl bg-gray-50 p-4"><p class="text-xs font-semibold uppercase text-gray-400">Role</p><p class="mt-2 flex items-center gap-2 font-medium"><User :size="17" /> {{ user?.role === 'admin' ? 'Admin' : 'User' }}</p></div>
        </div>

        <form class="mt-6 space-y-5" @submit.prevent="saveProfile">
          <div><label class="mb-2 block text-sm font-semibold">Name</label><input v-model="name" class="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500" required /></div>
          <div><label class="mb-2 block text-sm font-semibold">Address</label><div class="relative"><MapPin class="absolute left-4 top-3.5 text-gray-400" :size="18" /><input v-model="address" class="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-orange-500" placeholder="Your address" /></div></div>
          <button :disabled="saving" class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"><Save :size="18" /> {{ saving ? 'Saving...' : 'Save Profile' }}</button>
          <p v-if="message" class="text-sm text-green-600">{{ message }}</p>
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
