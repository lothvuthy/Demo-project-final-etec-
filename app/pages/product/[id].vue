<script setup>
import { onMounted } from "vue";
import { Heart, Star, ShieldCheck, Truck, Zap } from "lucide-vue-next";
import shopio from "~/data/shopio.json";
import { useProducts } from "~/composables/useProducts";
import ProductCard from "~/components/users/product/ProductCard.vue";
import { useCart } from "~/composables/useCart";
import { useWishlist } from "~/composables/useWishlist";

const route = useRoute();
const { products, loadProducts } = useProducts();
const router = useRouter();

const id = computed(() => String(route.params.id));
onMounted(() => loadProducts());
const product = computed(() =>
  products.value.find((p) => String(p.id) === id.value)
);

const related = computed(() => {
  if (!product.value) return [];
  return products.value.filter((p) => String(p.id) !== id.value).slice(0, 4);
});

const quantity = ref(1);
const increment = () => quantity.value++;
const decrement = () => {
  if (quantity.value > 1) quantity.value--;
};

const { add } = useCart();
const { isWishlisted, toggle } = useWishlist();

const liked = computed(() =>
  product.value ? isWishlisted(product.value.id) : false
);

const addingCart = ref(false);
const added = ref(false);

const handleAddToCart = async () => {
  if (!product.value) return;
  addingCart.value = true;
  const ok = await add(product.value, quantity.value);
  addingCart.value = false;

  if (!ok) {
    router.push("/auth/login");
    return;
  }
  added.value = true;
  setTimeout(() => (added.value = false), 2000);
};

const buyingNow = ref(false);
const handleBuyNow = async () => {
  if (!product.value) return;
  buyingNow.value = true;
  const ok = await add(product.value, quantity.value);
  buyingNow.value = false;

  if (!ok) {
    router.push("/auth/login");
    return;
  }
  router.push("/checkout");
};

const handleToggleWishlist = async () => {
  if (!product.value) return;
  const ok = await toggle(product.value);
  if (!ok) {
    router.push("/auth/login");
  }
};

const fullStars = computed(() => Math.round(product.value?.rating ?? 0));
</script>

<template>
  <div v-if="product" class="min-h-screen bg-white">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <div class="grid md:grid-cols-2 gap-12">
        <!-- Product image -->
        <div class="relative rounded-3xl overflow-hidden bg-gray-50 aspect-square">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <span
            v-if="product.discount"
            class="absolute bottom-4 left-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            -{{ product.discount }}% OFF
          </span>
        </div>

        <!-- Details -->
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-gray-900 mt-1 mb-3">
            {{ product.name }}
          </h1>

          <!-- Rating -->
          <div class="flex items-center gap-2 mb-4">
            <div class="flex text-yellow-500">
              <Star
                v-for="i in 5"
                :key="i"
                :size="16"
                :fill="i <= fullStars ? 'currentColor' : 'none'"
              />
            </div>
            <span class="text-sm text-gray-500"
              >{{ product.rating }} ({{ product.reviews }} reviews)</span
            >
          </div>

          <div class="flex items-baseline gap-3 mb-6">
            <p class="text-3xl font-bold text-gray-900">
              ${{ product.price.toFixed(2) }}
            </p>
            <p
              v-if="product.oldPrice"
              class="text-lg text-gray-400 line-through"
            >
              ${{ product.oldPrice.toFixed(2) }}
            </p>
          </div>

          <p class="text-gray-500 leading-relaxed mb-8 max-w-lg">
            {{ product.name }} — a customer favorite on SHopiO, backed by
            {{ product.reviews }} verified reviews. Fast shipping and easy
            30-day returns included.
          </p>

          <!-- Trust badges -->
          <div class="flex flex-wrap gap-4 mb-8 text-sm text-gray-500">
            <div class="flex items-center gap-2">
              <Truck :size="18" class="text-orange-500" />
              Free shipping over $50
            </div>
            <div class="flex items-center gap-2">
              <ShieldCheck :size="18" class="text-orange-500" />
              Secure checkout
            </div>
          </div>

          <!-- Quantity -->
          <div class="flex items-center gap-6 mb-8">
            <span class="text-sm font-semibold text-gray-900">Quantity</span>
            <div class="flex items-center border border-gray-200 rounded-full">
              <button class="px-4 py-2 text-lg" @click="decrement">−</button>
              <span class="px-4 font-medium">{{ quantity }}</span>
              <button class="px-4 py-2 text-lg" @click="increment">+</button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-row items-center gap-2 sm:gap-3">
            <button
              class="flex-1 min-w-0 inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-4 sm:px-8 py-3.5 rounded-full font-semibold hover:bg-orange-600 transition-colors disabled:opacity-70"
              :disabled="addingCart"
              @click="handleAddToCart"
            >
              {{
                addingCart
                  ? "Adding..."
                  : added
                  ? "Added to Cart ✓"
                  : "Add to Cart"
              }}
            </button>
            <button
              class="w-14 h-14 shrink-0 flex items-center justify-center rounded-full border transition-colors"
              :class="
                liked
                  ? 'bg-orange-50 border-orange-200 text-orange-500'
                  : 'border-gray-200 text-gray-500 hover:text-orange-500'
              "
              :aria-label="liked ? 'Remove from wishlist' : 'Add to wishlist'"
              @click="handleToggleWishlist"
            >
              <Heart :size="22" :fill="liked ? 'currentColor' : 'none'" />
            </button>
          </div>

          <button
            class="w-full mt-3 inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-orange-500 transition-colors disabled:opacity-70"
            :disabled="buyingNow"
            @click="handleBuyNow"
          >
            <Zap :size="18" />
            {{ buyingNow ? "Processing..." : "Buy Now" }}
          </button>
          <p class="text-xs text-gray-400 mt-3">
            You'll need to sign in to add items to your cart or wishlist.
          </p>
        </div>
      </div>

      <!-- Related products -->
      <section v-if="related.length" class="mt-20">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">
          You May Also Like
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ProductCard v-for="p in related" :key="p.id" :product="p" />
        </div>
      </section>
    </div>
  </div>

  <div v-else class="max-w-6xl mx-auto px-6 py-24 text-center">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
    <NuxtLink to="/shop" class="text-orange-500 font-semibold hover:underline"
      >← Back to shop</NuxtLink
    >
  </div>
</template>
