<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: false })

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  LayoutDashboard, Package, Users, MessageSquare, ShoppingBag, Plus,
  RefreshCw, Trash2, Menu, X, LogOut, ShieldCheck, Mail, UserRound, ExternalLink,
  Search, SlidersHorizontal
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

const categories = ref<any[]>([])

// --- Products: search + filters ---
const searchInput = ref('')
const searchQuery = ref('')
const showFilters = ref(false)
const defaultFilters = () => ({ category: 'all', minPrice: '', maxPrice: '', onSale: false, sort: 'default' })
const filters = ref(defaultFilters())

// --- Products: "Add product" popup ---
const emptyForm = () => ({ name: '', category: '', price: '', oldPrice: '', discount: '', rating: '5', reviews: '0', image: '' })
const form = ref(emptyForm())
const showAddModal = ref(false)
const submitting = ref(false)
const formError = ref('')
const imageFailed = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)

const productCategories = computed(() => {
  const names = new Set<string>(categories.value.map(c => c.value || c.name))
  products.value.forEach(p => { if (p.category) names.add(p.category) })
  return [...names]
})
const hasUncategorized = computed(() => products.value.some(p => !p.category))

const activeFilterCount = computed(() => {
  const f = filters.value
  return [f.category !== 'all', f.minPrice !== '', f.maxPrice !== '', f.onSale, f.sort !== 'default'].filter(Boolean).length
})
const hasSearchOrFilter = computed(() => !!searchQuery.value.trim() || activeFilterCount.value > 0)

const sorters: Record<string, (a: any, b: any) => number> = {
  'price-low': (a, b) => Number(a.price) - Number(b.price),
  'price-high': (a, b) => Number(b.price) - Number(a.price),
  rating: (a, b) => Number(b.rating) - Number(a.rating),
  name: (a, b) => String(a.name).localeCompare(String(b.name))
}

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase().replace(/^#/, '')
  const { category, minPrice, maxPrice, onSale, sort } = filters.value
  const min = minPrice === '' ? null : Number(minPrice)
  const max = maxPrice === '' ? null : Number(maxPrice)

  const list = products.value.filter((p) => {
    if (q && !String(p.name).toLowerCase().includes(q) && String(p.id).toLowerCase() !== q) return false
    if (category === '__none') {
      if (p.category) return false
    } else if (category !== 'all' && p.category !== category) {
      return false
    }
    const price = Number(p.price)
    if (min !== null && price < min) return false
    if (max !== null && price > max) return false
    if (onSale && !(Number(p.discount) > 0)) return false
    return true
  })

  const sorter = sorters[sort]
  return sorter ? [...list].sort(sorter) : list
})

const applySearch = () => { searchQuery.value = searchInput.value }
const clearSearch = () => { searchInput.value = ''; searchQuery.value = '' }
const resetFilters = () => { filters.value = defaultFilters() }
const clearAll = () => { clearSearch(); resetFilters() }
// Emptying the box by hand should also bring every product back.
watch(searchInput, (value) => { if (!value.trim()) searchQuery.value = '' })
watch(() => form.value.image, () => { imageFailed.value = false })

const stats = computed(() => ({
  products: products.value.length,
  users: users.value.length,
  messages: messages.value.length,
  orders: orders.value.length
}))

// --- Dashboard: users charts (plain SVG/CSS, no chart library needed) ---
const DONUT_R = 48
const DONUT_C = 2 * Math.PI * DONUT_R

const roleStats = computed(() => {
  const total = users.value.length
  const admins = users.value.filter(u => u.role === 'admin').length
  return { total, admins, customers: total - admins }
})

const roleSegments = computed(() => {
  const { total, admins, customers } = roleStats.value
  const parts = [
    { key: 'admin', label: 'Admins', value: admins, color: '#c84a08' },
    { key: 'customer', label: 'Customers', value: customers, color: '#ffc7a1' }
  ]
  let offset = 0
  return parts.map((part) => {
    const len = total ? (part.value / total) * DONUT_C : 0
    const segment = { ...part, len, offset, percent: total ? Math.round((part.value / total) * 100) : 0 }
    offset += len
    return segment
  })
})

// Cart items and wishlist size for the 6 most active users
const userActivity = computed(() =>
  users.value
    .map(u => ({
      id: u.id,
      name: u.name || 'Unknown',
      cart: (u.cart || []).reduce((sum: number, item: any) => sum + (Number(item.qty) || 0), 0),
      wishlist: (u.wishlist || []).length
    }))
    .sort((a, b) => (b.cart + b.wishlist) - (a.cart + a.wishlist))
    .slice(0, 6)
)
const activityMax = computed(() => Math.max(1, ...userActivity.value.map(u => Math.max(u.cart, u.wishlist))))
const barWidth = (value: number) => (value ? `${Math.max(4, (value / activityMax.value) * 100)}%` : '0%')

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
    const [p, u, m, o, c] = await Promise.all([
      $fetch<any[]>(`${API}/products`),
      $fetch<any[]>(`${API}/users`),
      $fetch<any[]>(`${API}/messages`),
      $fetch<any[]>(`${API}/orders`),
      $fetch<any[]>(`${API}/categories`).catch(() => [])
    ])
    categories.value = c || []
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

const openAddModal = async () => {
  formError.value = ''
  showAddModal.value = true
  await nextTick()
  nameInput.value?.focus()
}

const closeAddModal = () => {
  if (submitting.value) return
  showAddModal.value = false
}

const addProduct = async () => {
  const f = form.value
  formError.value = ''

  if (!String(f.name).trim()) { formError.value = 'Enter a product name.'; return }
  if (f.price === '' || Number.isNaN(Number(f.price)) || Number(f.price) < 0) { formError.value = 'Enter a valid price (0 or more).'; return }
  if (f.oldPrice !== '' && Number(f.oldPrice) < 0) { formError.value = 'Old price cannot be negative.'; return }
  if (f.discount !== '' && (Number(f.discount) < 0 || Number(f.discount) > 100)) { formError.value = 'Discount must be between 0 and 100.'; return }
  if (f.rating !== '' && (Number(f.rating) < 0 || Number(f.rating) > 5)) { formError.value = 'Rating must be between 0 and 5.'; return }
  if (!String(f.image).trim()) { formError.value = 'Enter an image URL.'; return }

  submitting.value = true
  try {
    await $fetch(`${API}/products`, {
      method: 'POST',
      body: {
        name: String(f.name).trim(),
        ...(f.category ? { category: f.category } : {}),
        price: Number(f.price),
        ...(f.oldPrice !== '' ? { oldPrice: Number(f.oldPrice) } : {}),
        ...(f.discount !== '' ? { discount: Number(f.discount) } : {}),
        rating: f.rating === '' ? 5 : Number(f.rating),
        reviews: Number(f.reviews) || 0,
        image: String(f.image).trim()
      }
    })
    const addedName = String(f.name).trim()
    form.value = emptyForm()
    showAddModal.value = false
    notice.value = { text: `"${addedName}" was added to your store.`, type: 'success' }
    active.value = 'products'
    await loadAll()
  } catch (error) {
    console.error(error)
    formError.value = 'Could not add the product. Make sure JSON Server is running on port 8000.'
  } finally {
    submitting.value = false
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

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showAddModal.value) closeAddModal()
}

// Stop the page behind the popup from scrolling while it is open.
watch(showAddModal, (open) => { document.body.style.overflow = open ? 'hidden' : '' })

onMounted(() => {
  loadAll()
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
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
  <NuxtLink to="/" class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 hover:border-orange-300 hover:text-orange-500 text-sm font-medium text-gray-600" title="Go to website"><ExternalLink :size="16" /><span class="hidden sm:inline">Go to website</span></NuxtLink>
  <button class="p-2.5 rounded-xl border border-gray-200 hover:border-orange-300 hover:text-orange-500" title="Refresh" @click="loadAll">
    <RefreshCw :size="18" :class="loading ? 'animate-spin' : ''" />
  </button>
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
            <div class="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <div class="flex items-center justify-between mb-5"><h2 class="font-bold text-lg">Users overview</h2><button class="text-sm text-orange-500 font-semibold" @click="select('users')">View all</button></div>

              <div v-if="users.length">
                <!-- Donut: admins vs customers -->
                <div class="flex flex-col items-center gap-6 sm:flex-row">
                  <div class="relative h-36 w-36 shrink-0">
                    <svg viewBox="0 0 120 120" class="h-full w-full" role="img" :aria-label="`${roleStats.admins} admins and ${roleStats.customers} customers`">
                      <circle cx="60" cy="60" :r="DONUT_R" fill="none" stroke="#f3f4f6" stroke-width="16" />
                      <template v-for="seg in roleSegments" :key="seg.key">
                        <circle v-if="seg.value" cx="60" cy="60" :r="DONUT_R" fill="none" :stroke="seg.color" stroke-width="16" :stroke-dasharray="`${seg.len} ${DONUT_C - seg.len}`" :stroke-dashoffset="-seg.offset" transform="rotate(-90 60 60)" />
                      </template>
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center"><span class="text-3xl font-black text-gray-900">{{ roleStats.total }}</span><span class="text-xs text-gray-500">users</span></div>
                  </div>
                  <ul class="w-full space-y-3">
                    <li v-for="seg in roleSegments" :key="seg.key" class="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                      <span class="inline-flex items-center gap-2.5 text-sm font-medium text-gray-700"><span class="h-3 w-3 rounded-full" :style="{ backgroundColor: seg.color }"></span>{{ seg.label }}</span>
                      <span class="text-sm text-gray-500"><b class="text-base text-gray-900">{{ seg.value }}</b> · {{ seg.percent }}%</span>
                    </li>
                  </ul>
                </div>

                <!-- Bars: cart items and wishlist size per user -->
                <div class="mt-7 border-t border-gray-100 pt-5">
                  <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h3 class="text-sm font-semibold text-gray-700">Cart and wishlist by user</h3>
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                      <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-orange-600"></span>Cart items</span>
                      <span class="inline-flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-gray-800"></span>Wishlist</span>
                    </div>
                  </div>
                  <div class="space-y-3.5">
                    <div v-for="u in userActivity" :key="u.id" class="grid grid-cols-[6.5rem_1fr] items-center gap-3">
                      <p class="truncate text-sm font-medium text-gray-700" :title="u.name">{{ u.name }}</p>
                      <div class="space-y-1.5">
                        <div class="flex items-center gap-2"><div class="h-2.5 flex-1 rounded-full bg-gray-100"><div class="h-full rounded-full bg-orange-600" :style="{ width: barWidth(u.cart) }"></div></div><span class="w-6 text-right text-xs tabular-nums text-gray-500">{{ u.cart }}</span></div>
                        <div class="flex items-center gap-2"><div class="h-2.5 flex-1 rounded-full bg-gray-100"><div class="h-full rounded-full bg-gray-800" :style="{ width: barWidth(u.wishlist) }"></div></div><span class="w-6 text-right text-xs tabular-nums text-gray-500">{{ u.wishlist }}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">No users found.</p>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6"><div class="flex items-center justify-between mb-5"><h2 class="font-bold text-lg">Recent Messages</h2><button class="text-sm text-orange-500 font-semibold" @click="select('messages')">View all</button></div><div v-if="messages.length" class="space-y-3"><div v-for="m in messages.slice(-5).reverse()" :key="m.id" class="border-b border-gray-100 pb-3"><p class="font-medium truncate">{{ m.subject }}</p><p class="text-xs text-gray-500 mt-1 truncate">{{ m.fullName }} · {{ m.message }}</p></div></div><p v-else class="text-sm text-gray-500">No messages yet.</p></div>
          </div>
        </section>

        <section v-else-if="active === 'products'">
          <!-- Toolbar: search, filters, add -->
          <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <form class="flex flex-1 items-center gap-2" role="search" @submit.prevent="applySearch">
              <div class="relative flex-1">
                <Search :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input v-model="searchInput" type="text" class="input input-with-icon" placeholder="Search by product name or ID" aria-label="Search products" />
                <button v-if="searchInput" type="button" class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:text-gray-700" aria-label="Clear search" @click="clearSearch"><X :size="16" /></button>
              </div>
              <button type="submit" class="shrink-0 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600">Search</button>
            </form>

            <div class="flex items-center gap-2">
              <button type="button" class="relative inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold lg:flex-none" :class="showFilters || activeFilterCount ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'" :aria-expanded="showFilters" @click="showFilters = !showFilters">
                <SlidersHorizontal :size="17" />Filters
                <span v-if="activeFilterCount" class="grid h-5 min-w-5 place-items-center rounded-full bg-orange-600 px-1 text-[11px] font-bold text-white">{{ activeFilterCount }}</span>
              </button>
              <button type="button" class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-700 lg:flex-none" @click="openAddModal"><Plus :size="18" />Add product</button>
            </div>
          </div>

          <!-- Filter panel -->
          <div v-if="showFilters" class="mb-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label class="block"><span class="field-label">Category</span>
                <select v-model="filters.category" class="input">
                  <option value="all">All categories</option>
                  <option v-for="c in productCategories" :key="c" :value="c">{{ c }}</option>
                  <option v-if="hasUncategorized" value="__none">No category</option>
                </select>
              </label>
              <label class="block"><span class="field-label">Min price ($)</span><input v-model="filters.minPrice" type="number" min="0" step="0.01" placeholder="0" class="input" /></label>
              <label class="block"><span class="field-label">Max price ($)</span><input v-model="filters.maxPrice" type="number" min="0" step="0.01" placeholder="Any" class="input" /></label>
              <label class="block"><span class="field-label">Sort by</span>
                <select v-model="filters.sort" class="input">
                  <option value="default">Default order</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="rating">Highest rated</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>
            </div>
            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label class="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700"><input v-model="filters.onSale" type="checkbox" class="h-4 w-4 accent-orange-600" />On sale only</label>
              <button type="button" class="text-sm font-semibold text-orange-600 hover:text-orange-700 disabled:opacity-40" :disabled="!activeFilterCount" @click="resetFilters">Reset filters</button>
            </div>
          </div>

          <p class="mb-3 text-sm text-gray-500" aria-live="polite">Showing {{ filteredProducts.length }} of {{ products.length }} products</p>

          <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-sm"><thead class="bg-gray-50 text-left"><tr><th class="p-4">Product</th><th class="p-4">Category</th><th class="p-4">Price</th><th class="p-4">Rating</th><th class="p-4">Reviews</th><th class="p-4"></th></tr></thead><tbody><tr v-for="p in filteredProducts" :key="p.id" class="border-t border-gray-100"><td class="p-4"><div class="flex items-center gap-3 min-w-55"><img :src="p.image" class="w-12 h-12 rounded-lg object-cover bg-gray-100" /><div><p class="font-semibold">{{ p.name }}</p><p class="text-xs text-gray-400">#{{ p.id }}</p></div></div></td><td class="p-4 text-gray-600">{{ p.category || '—' }}</td><td class="p-4 font-semibold">${{ p.price }}</td><td class="p-4">{{ p.rating }}</td><td class="p-4">{{ p.reviews }}</td><td class="p-4 text-right"><button class="p-2 text-red-500 hover:bg-red-50 rounded-lg" :aria-label="`Delete ${p.name}`" @click="deleteResource('products', p.id, 'product')"><Trash2 :size="17" /></button></td></tr></tbody></table></div>
            <div v-if="!filteredProducts.length" class="p-10 text-center">
              <p class="text-gray-500">{{ products.length ? 'No products match your search or filters.' : 'No products found.' }}</p>
              <button v-if="products.length && hasSearchOrFilter" type="button" class="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700" @click="clearAll">Clear search and filters</button>
            </div>
          </div>
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
              <div class="border-t border-gray-100 bg-gray-50/60 px-4 sm:px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
                <span>User ID: <b class="text-gray-700">{{ o.userId || orderUser(o).id || '—' }}</b></span>
                <span v-if="o.paymentMethod">Payment: <b class="text-gray-700">{{ o.paymentMethod }}</b></span>
                <span v-if="o.paymentReference" class="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 px-2 py-0.5 font-semibold" title="Verified via Bakong KHQR">
                  <ShieldCheck :size="12" /> Verified · {{ o.paymentReference.slice(0, 8) }}…
                </span>
                <span v-if="o.items?.length">Items: <b class="text-gray-700">{{ o.items.length }}</b></span>
              </div>
            </div>
          </div>
          <div v-else class="bg-white rounded-2xl p-10 text-center text-gray-500">No orders yet.</div>
        </section>

      </div>

      <footer class="border-t border-gray-200 bg-white px-4 sm:px-6 lg:px-8 py-6 text-center shrink-0">
        <p class="font-extrabold text-orange-500">SHopiO Admin</p>
        <p class="mt-1 text-xs text-gray-400">© {{ new Date().getFullYear() }} SHopiO. All rights reserved.</p>
      </footer>
    </main>

    <!-- Add product popup -->
    <Transition name="modal">
      <div v-if="showAddModal" class="fixed inset-0 z-60 flex items-end justify-center bg-gray-950/50 sm:items-center sm:p-6" @click.self="closeAddModal">
        <div class="modal-card max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
          <div class="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-7 sm:py-5">
            <div>
              <h2 id="add-product-title" class="text-lg font-bold text-gray-900 sm:text-xl">Add new product</h2>
              <p class="mt-1 text-sm text-gray-500">Fill in the details below. The product shows in the store as soon as you save it.</p>
            </div>
            <button type="button" class="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100" aria-label="Close" @click="closeAddModal"><X :size="20" /></button>
          </div>

          <form class="px-5 py-5 sm:px-7 sm:py-6" novalidate @submit.prevent="addProduct">
            <div v-if="formError" role="alert" class="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{{ formError }}</div>

            <div class="grid gap-4 md:grid-cols-2">
              <label class="block md:col-span-2"><span class="field-label">Product name <b class="text-red-500">*</b></span><input ref="nameInput" v-model="form.name" placeholder="e.g. Wireless Headphones" class="input" /></label>
              <label class="block"><span class="field-label">Category</span>
                <select v-model="form.category" class="input">
                  <option value="">No category</option>
                  <option v-for="c in productCategories" :key="c" :value="c">{{ c }}</option>
                </select>
              </label>
              <label class="block"><span class="field-label">Price ($) <b class="text-red-500">*</b></span><input v-model="form.price" type="number" step="0.01" min="0" placeholder="0.00" class="input" /></label>
              <label class="block"><span class="field-label">Old price ($)</span><input v-model="form.oldPrice" type="number" step="0.01" min="0" placeholder="Optional" class="input" /></label>
              <label class="block"><span class="field-label">Discount (%)</span><input v-model="form.discount" type="number" min="0" max="100" placeholder="Optional" class="input" /></label>
              <label class="block"><span class="field-label">Rating (0 to 5)</span><input v-model="form.rating" type="number" step="0.1" min="0" max="5" class="input" /></label>
              <label class="block"><span class="field-label">Reviews</span><input v-model="form.reviews" type="number" min="0" class="input" /></label>
              <div class="md:col-span-2">
                <label class="block"><span class="field-label">Image URL <b class="text-red-500">*</b></span><input v-model="form.image" placeholder="https://..." class="input" /></label>
                <div v-if="form.image.trim()" class="mt-3 flex items-center gap-3">
                  <img v-show="!imageFailed" :src="form.image" alt="Image preview" class="h-16 w-16 rounded-xl bg-gray-100 object-cover" @error="imageFailed = true" @load="imageFailed = false" />
                  <p v-if="imageFailed" class="text-xs text-amber-700">This link does not load as an image. Check the URL.</p>
                </div>
              </div>
            </div>

            <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" class="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50" :disabled="submitting" @click="closeAddModal">Cancel</button>
              <button type="submit" class="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60" :disabled="submitting">{{ submitting ? 'Adding...' : 'Add product' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.input { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #e5e7eb; background: #f9fafb; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.input:focus { border-color: #fb923c; box-shadow: 0 0 0 2px #ffedd5; }
.input.input-with-icon { padding-left: 2.75rem; padding-right: 2.5rem; }
.field-label { display: block; margin-bottom: 0.375rem; font-size: 0.8125rem; font-weight: 600; color: #374151; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-card { transition: transform 0.2s ease; }
.modal-enter-from .modal-card, .modal-leave-to .modal-card { transform: translateY(16px) scale(0.98); }
</style>