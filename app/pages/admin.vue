<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: false })

import { computed, onMounted, ref } from 'vue'
import {
  LayoutDashboard, Package, Users, MessageSquare, ShoppingBag, Plus,
  RefreshCw, Trash2, Menu, X, LogOut, ShieldCheck, Mail, UserRound, ExternalLink
} from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'

const API = 'http://localhost:8000'
const { user, logout } = useAuth()
const router = useRouter()
type AdminSection = 'dashboard' | 'products' | 'users' | 'messages' | 'orders'
const active = ref<AdminSection>('dashboard')
const sidebarOpen = ref(false)
const loading = ref(false)
const notice = ref({ text: '', type: '' })

const products = ref<any[]>([])
const users = ref<any[]>([])
const messages = ref<any[]>([])
const orders = ref<any[]>([])

const form = ref({ name: '', price: '', oldPrice: '', discount: '', rating: '5', reviews: '0', image: '' })

const stats = computed(() => ({
  products: products.value.length,
  users: users.value.length,
  messages: messages.value.length,
  orders: orders.value.length
}))

const findUser = (id: string | number | undefined) => {
  if (id === undefined || id === null || id === '') return null
  return users.value.find(u => String(u.id) === String(id)) || null
}

const orderUser = (order: any) => {
  const matched = findUser(order.userId)
  return matched || {
    name: order.userName || order.user?.name || order.name || 'Unknown user',
    email: order.userEmail || order.user?.email || order.email || '',
    id: order.userId || order.user?.id || ''
  }
}

const loadAll = async () => {
  loading.value = true
  try {
    const [p, u, m, o] = await Promise.all([
      $fetch<any[]>(`${API}/products`),
      $fetch<any[]>(`${API}/users`),
      $fetch<any[]>(`${API}/messages`),
      $fetch<any[]>(`${API}/orders`)
    ])
    products.value = p || []
    users.value = u || []
    messages.value = m || []
    orders.value = o || []
  } catch (error) {
    console.error(error)
    notice.value = { text: 'Cannot connect to JSON Server. Make sure it is running on port 8000.', type: 'error' }
  } finally {
    loading.value = false
  }
}

const addProduct = async () => {
  if (!form.value.name.trim() || !form.value.price || !form.value.image.trim()) {
    notice.value = { text: 'Please fill in product name, price and image URL.', type: 'error' }
    return
  }
  try {
    await $fetch(`${API}/products`, {
      method: 'POST',
      body: {
        name: form.value.name.trim(),
        price: Number(form.value.price),
        ...(form.value.oldPrice ? { oldPrice: Number(form.value.oldPrice) } : {}),
        ...(form.value.discount ? { discount: Number(form.value.discount) } : {}),
        rating: Number(form.value.rating) || 5,
        reviews: Number(form.value.reviews) || 0,
        image: form.value.image.trim()
      }
    })
    form.value = { name: '', price: '', oldPrice: '', discount: '', rating: '5', reviews: '0', image: '' }
    notice.value = { text: 'Product added successfully.', type: 'success' }
    active.value = 'products'
    await loadAll()
  } catch (error) {
    console.error(error)
    notice.value = { text: 'Failed to add product.', type: 'error' }
  }
}

const deleteResource = async (type: 'products' | 'messages' | 'orders', id: string | number, label: string) => {
  if (!confirm(`Delete this ${label}?`)) return
  try {
    await $fetch(`${API}/${type}/${id}`, { method: 'DELETE' })
    notice.value = { text: `${label.charAt(0).toUpperCase() + label.slice(1)} deleted successfully.`, type: 'success' }
    await loadAll()
  } catch (error) {
    console.error(error)
    notice.value = { text: `Failed to delete ${label}.`, type: 'error' }
  }
}

const signOut = () => {
  logout()
  router.push('/')
}

const menuItems = [
  { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products' as AdminSection, label: 'Products', icon: Package },
  { id: 'users' as AdminSection, label: 'Users', icon: Users },
  { id: 'messages' as AdminSection, label: 'Messages', icon: MessageSquare },
  { id: 'orders' as AdminSection, label: 'Orders', icon: ShoppingBag }
]

const select = (item: AdminSection) => {
  active.value = item
  sidebarOpen.value = false
}

onMounted(loadAll)
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black/30 lg:hidden" @click="sidebarOpen = false"></div>

    <aside class="fixed inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white transform transition-transform lg:translate-x-0" :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="h-full flex flex-col">
        <div class="h-20 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div><p class="text-2xl font-black text-orange-500">SHopiO</p><p class="text-xs text-gray-400">Admin Dashboard</p></div>
          <button class="lg:hidden" @click="sidebarOpen = false"><X /></button>
        </div>
        <div class="px-5 py-5 border-b border-white/10 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 shrink-0 overflow-hidden rounded-full bg-orange-500 flex items-center justify-center font-bold">
              <img v-if="user?.avatar" :src="user.avatar" alt="Profile" class="w-full h-full object-cover" />
              <span v-else>{{ user?.name?.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="min-w-0"><p class="font-semibold truncate">{{ user?.name }}</p><p class="text-xs text-gray-400 truncate">{{ user?.email }}</p></div>
          </div>
          <span class="mt-3 inline-flex items-center gap-1 text-xs bg-orange-500/15 text-orange-300 px-2 py-1 rounded-full"><ShieldCheck :size="13" /> Administrator</span>
        </div>
        <nav class="p-4 space-y-1 flex-1 overflow-y-auto">
          <button v-for="item in menuItems" :key="item.id" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition" :class="active === item.id ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-white/10'" @click="select(item.id)"><component :is="item.icon" :size="19" />{{ item.label }}</button>
        </nav>
        <div class="px-4 pb-4 shrink-0">
          <NuxtLink to="/profile" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition"><Users :size="19" />My Profile</NuxtLink>
        </div>
        <div class="p-4 border-t border-white/10 shrink-0"><button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/10" @click="signOut"><LogOut :size="19" />Sign out</button></div>
      </div>
    </aside>

    <main class="min-h-screen lg:ml-72 flex flex-col">
      <header class="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3"><button class="lg:hidden p-2 rounded-lg hover:bg-gray-100" @click="sidebarOpen = true"><Menu /></button><div><h1 class="text-xl sm:text-2xl font-bold text-gray-900 capitalize">{{ active }}</h1><p class="text-xs sm:text-sm text-gray-500">Manage your SHopiO store</p></div></div>
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-600 text-sm font-semibold hover:bg-orange-500 hover:text-white transition-colors"
            title="Go to website"
          >
            <ExternalLink :size="17" />
            <span class="hidden sm:inline">Go to website</span>
          </NuxtLink>
          <button class="p-2.5 rounded-xl border border-gray-200 hover:border-orange-300 hover:text-orange-500" title="Refresh" @click="loadAll"><RefreshCw :size="18" :class="loading ? 'animate-spin' : ''" /></button>
        </div>
      </header>

      <div class="p-4 sm:p-6 lg:p-8 flex-1">
        <div v-if="notice.text" class="mb-5 px-4 py-3 rounded-xl text-sm" :class="notice.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'">{{ notice.text }}</div>

        <section v-if="active === 'dashboard'">
          <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
            <div v-for="card in [
              {label:'Products', value:stats.products, icon:Package}, {label:'Users', value:stats.users, icon:Users}, {label:'Messages', value:stats.messages, icon:MessageSquare}, {label:'Orders', value:stats.orders, icon:ShoppingBag}
            ]" :key="card.label" class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm"><div class="flex justify-between items-start gap-2"><div><p class="text-sm text-gray-500">{{ card.label }}</p><p class="text-3xl font-black mt-2">{{ card.value }}</p></div><div class="hidden sm:block p-3 rounded-xl bg-orange-50 text-orange-500"><component :is="card.icon" :size="21" /></div></div></div>
          </div>
          <div class="grid xl:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6"><div class="flex items-center justify-between mb-5"><h2 class="font-bold text-lg">Recent Users</h2><button class="text-sm text-orange-500 font-semibold" @click="select('users')">View all</button></div><div v-if="users.length" class="space-y-3"><div v-for="u in users.slice(-5).reverse()" :key="u.id" class="flex items-center justify-between gap-3 border-b border-gray-100 pb-3"><div class="flex items-center gap-3 min-w-0"><div class="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0"><img v-if="u.avatar" :src="u.avatar" class="w-full h-full object-cover" /><span v-else>{{ u.name?.charAt(0)?.toUpperCase() }}</span></div><div class="min-w-0"><p class="font-medium truncate">{{ u.name }}</p><p class="text-xs text-gray-500 truncate">{{ u.email }}</p></div></div><span class="shrink-0 text-xs px-2 py-1 rounded-full" :class="u.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'">{{ u.role || 'user' }}</span></div></div><p v-else class="text-sm text-gray-500">No users found.</p></div>
            <div class="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6"><div class="flex items-center justify-between mb-5"><h2 class="font-bold text-lg">Recent Messages</h2><button class="text-sm text-orange-500 font-semibold" @click="select('messages')">View all</button></div><div v-if="messages.length" class="space-y-3"><div v-for="m in messages.slice(-5).reverse()" :key="m.id" class="border-b border-gray-100 pb-3"><p class="font-medium truncate">{{ m.subject }}</p><p class="text-xs text-gray-500 mt-1 truncate">{{ m.fullName }} · {{ m.message }}</p></div></div><p v-else class="text-sm text-gray-500">No messages yet.</p></div>
          </div>
        </section>

        <section v-else-if="active === 'products'">
          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-sm"><thead class="bg-gray-50 text-left"><tr><th class="p-4">Product</th><th class="p-4">Price</th><th class="p-4">Rating</th><th class="p-4">Reviews</th><th class="p-4"></th></tr></thead><tbody><tr v-for="p in products" :key="p.id" class="border-t border-gray-100"><td class="p-4"><div class="flex items-center gap-3 min-w-55"><img :src="p.image" class="w-12 h-12 rounded-lg object-cover bg-gray-100" /><div><p class="font-semibold">{{ p.name }}</p><p class="text-xs text-gray-400">#{{ p.id }}</p></div></div></td><td class="p-4 font-semibold">${{ p.price }}</td><td class="p-4">{{ p.rating }}</td><td class="p-4">{{ p.reviews }}</td><td class="p-4 text-right"><button class="p-2 text-red-500 hover:bg-red-50 rounded-lg" @click="deleteResource('products', p.id, 'product')"><Trash2 :size="17" /></button></td></tr></tbody></table></div><p v-if="!products.length" class="p-8 text-center text-gray-500">No products found.</p></div>
        </section>

        <section v-else-if="active === 'users'" class="bg-white rounded-2xl border border-gray-100 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-sm"><thead class="bg-gray-50 text-left"><tr><th class="p-4">User</th><th class="p-4">Email</th><th class="p-4">Role</th><th class="p-4">Cart</th><th class="p-4">Wishlist</th><th class="p-4">Address</th></tr></thead><tbody><tr v-for="u in users" :key="u.id" class="border-t border-gray-100"><td class="p-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0"><img v-if="u.avatar" :src="u.avatar" class="w-full h-full object-cover" /><span v-else>{{ u.name?.charAt(0)?.toUpperCase() }}</span></div><span class="font-semibold">{{ u.name }}</span></div></td><td class="p-4">{{ u.email }}</td><td class="p-4"><span class="px-2 py-1 rounded-full text-xs" :class="u.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'">{{ u.role || 'user' }}</span></td><td class="p-4">{{ u.cart?.reduce((s:any,i:any)=>s+i.qty,0) || 0 }}</td><td class="p-4">{{ u.wishlist?.length || 0 }}</td><td class="p-4 max-w-55 truncate">{{ u.address || '—' }}</td></tr></tbody></table></div></section>

        <section v-else-if="active === 'messages'" class="space-y-4">
          <div v-for="m in messages" :key="m.id" class="bg-white rounded-2xl border border-gray-100 p-5">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div class="min-w-0"><h3 class="font-bold text-gray-900">{{ m.subject }}</h3><div class="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-2"><span class="inline-flex items-center gap-1"><UserRound :size="14" />{{ m.fullName || 'Unknown user' }}</span><span>·</span><span class="inline-flex items-center gap-1"><Mail :size="14" />{{ m.email || 'No email' }}</span></div></div>
              <div class="flex items-center gap-3 shrink-0"><span class="text-xs text-gray-400">{{ m.createdAt ? new Date(m.createdAt).toLocaleString() : '' }}</span><button class="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete message" @click="deleteResource('messages', m.id, 'message')"><Trash2 :size="17" /></button></div>
            </div>
            <p class="mt-4 text-gray-700 whitespace-pre-wrap">{{ m.message }}</p><p v-if="m.orderNumber" class="mt-3 text-xs text-gray-500">Order: {{ m.orderNumber }}</p>
          </div>
          <div v-if="!messages.length" class="bg-white rounded-2xl p-10 text-center text-gray-500">No messages yet.</div>
        </section>

        <section v-else-if="active === 'orders'">
          <div v-if="orders.length" class="space-y-4">
            <div v-for="o in orders" :key="o.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div class="p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div class="flex items-center gap-4 min-w-0">
                  <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><ShoppingBag :size="22" /></div>
                  <div class="min-w-0"><p class="font-bold text-gray-900">Order #{{ o.id }}</p><p class="text-xs text-gray-400 mt-1">{{ o.createdAt ? new Date(o.createdAt).toLocaleString() : 'Date not available' }}</p></div>
                </div>
                <div class="flex items-center gap-3 md:gap-6">
                  <div class="min-w-0"><p class="text-xs uppercase tracking-wide text-gray-400">Customer</p><p class="font-semibold truncate max-w-55">{{ orderUser(o).name }}</p><p class="text-xs text-gray-500 truncate max-w-55">{{ orderUser(o).email || 'Email not available' }}</p></div>
                  <div class="text-right"><p class="text-xs uppercase tracking-wide text-gray-400">Total</p><p class="text-lg font-black text-gray-900">${{ Number(o.total ?? 0).toFixed(2) }}</p></div>
                  <button class="p-2.5 text-red-500 hover:bg-red-50 rounded-xl shrink-0" title="Delete order" @click="deleteResource('orders', o.id, 'order')"><Trash2 :size="18" /></button>
                </div>
              </div>
              <div class="border-t border-gray-100 bg-gray-50/60 px-4 sm:px-5 py-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                <span>User ID: <b class="text-gray-700">{{ o.userId || orderUser(o).id || '—' }}</b></span>
                <span v-if="o.paymentMethod">Payment: <b class="text-gray-700">{{ o.paymentMethod }}</b></span>
                <span v-if="o.items?.length">Items: <b class="text-gray-700">{{ o.items.length }}</b></span>
              </div>
            </div>
          </div>
          <div v-else class="bg-white rounded-2xl p-10 text-center text-gray-500">No orders yet.</div>
        </section>

        <section v-if="active === 'products'" class="mt-6 bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
          <div class="flex items-center gap-2 mb-5"><Plus class="text-orange-500" :size="20" /><h2 class="text-lg font-bold">Add New Product</h2></div>
          <form @submit.prevent="addProduct" class="grid md:grid-cols-2 gap-4">
            <input v-model="form.name" required placeholder="Product name" class="input" />
            <input v-model="form.price" required type="number" step="0.01" min="0" placeholder="Price" class="input" />
            <input v-model="form.oldPrice" type="number" step="0.01" min="0" placeholder="Old price (optional)" class="input" />
            <input v-model="form.discount" type="number" min="0" max="100" placeholder="Discount % (optional)" class="input" />
            <input v-model="form.rating" type="number" step="0.1" min="0" max="5" placeholder="Rating" class="input" />
            <input v-model="form.reviews" type="number" min="0" placeholder="Reviews" class="input" />
            <input v-model="form.image" required placeholder="Image URL" class="input md:col-span-2" />
            <button class="md:col-span-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600">Add Product</button>
          </form>
        </section>
      </div>

      <footer class="border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8 py-6 text-center shrink-0">
        <p class="font-extrabold text-orange-500">SHopiO Admin</p>
        <p class="mt-1 text-xs text-gray-400">© {{ new Date().getFullYear() }} SHopiO. All rights reserved.</p>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.input { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #e5e7eb; background: #f9fafb; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.input:focus { border-color: #fb923c; box-shadow: 0 0 0 2px #ffedd5; }
</style>
