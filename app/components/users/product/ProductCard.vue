<script setup>
import { Heart, Star, StarHalf, Zap, ShoppingCart } from "lucide-vue-next";
import { useWishlist } from "~/composables/useWishlist";
import { useCart } from "~/composables/useCart";
import { usePayment } from "~/composables/usePayment";

const props = defineProps({ product: { type: Object, required: true } });
const { isWishlisted, toggle } = useWishlist();
const { add } = useCart();
const { openPayment } = usePayment();
const router = useRouter();
const liked = computed(() => isWishlisted(props.product.id));
const adding = ref(false);
const buying = ref(false);
const notice = ref('');

const handleHeartClick = async () => {
  const ok = await toggle(props.product);
  if (!ok) router.push("/auth/login");
};

const addToCart = async () => {
  adding.value = true;
  notice.value = '';
  const ok = await add(props.product, 1);
  adding.value = false;
  if (!ok) { router.push("/auth/login"); return; }
  notice.value = 'Added to cart';
  setTimeout(() => (notice.value = ''), 1500);
};

const handleBuyNow = async () => {
  buying.value = true;
  const ok = await add(props.product, 1);
  buying.value = false;
  if (!ok) { router.push("/auth/login"); return; }
 openPayment();
};
</script>

<template>
  <div class="group">
    <NuxtLink :to="`/product/${product.id}`" class="block">
      <div class="relative bg-gray-50 rounded-2xl overflow-hidden">
        <img :src="product.image" :alt="product.name" class="w-full h-44 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition duration-300" />
        <button type="button" class="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center transition" :class="liked ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'" :aria-label="liked ? 'Remove from wishlist' : 'Add to wishlist'" @click.stop.prevent="handleHeartClick">
          <Heart :size="20" :fill="liked ? 'currentColor' : 'none'" />
        </button>
        <span v-if="product.discount" class="absolute bottom-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">-{{ product.discount }}%</span>
      </div>
      <div class="pt-4">
        <div class="flex items-center gap-1 text-yellow-500 text-sm">
          <Star :size="14" fill="currentColor" /><Star :size="14" fill="currentColor" /><Star :size="14" fill="currentColor" /><StarHalf :size="14" fill="currentColor" />
          <span class="ml-1 text-gray-700">{{ product.rating }}</span><span class="text-gray-400"> ({{ product.reviews }}) </span>
        </div>
        <h3 class="font-semibold mt-2 group-hover:text-orange-500 transition">{{ product.name }}</h3>
        <div class="flex items-center gap-2 mt-2">
          <span class="font-bold text-lg text-gray-900">${{ product.price }}</span>
          <span v-if="product.oldPrice" class="text-gray-400 text-sm line-through">${{ product.oldPrice }}</span>
        </div>
      </div>
    </NuxtLink>

    <div class="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
      <button type="button" class="min-w-0 inline-flex items-center justify-center gap-1 bg-orange-500 text-white text-[11px] sm:text-sm font-semibold px-1.5 sm:px-2 py-2 sm:py-2.5 rounded-full hover:bg-orange-600 transition disabled:opacity-70" :disabled="adding" @click.stop.prevent="addToCart">
        <ShoppingCart :size="14" class="shrink-0 sm:hidden" />
        <ShoppingCart :size="15" class="hidden sm:block shrink-0" />
        <span class="truncate sm:hidden">{{ adding ? "Adding..." : "Add" }}</span>
        <span class="hidden truncate sm:block">{{ adding ? "Adding..." : "Add to Cart" }}</span>
      </button>
      <button type="button" class="min-w-0 inline-flex items-center justify-center gap-1 bg-gray-900 text-white text-[11px] sm:text-sm font-semibold px-1.5 sm:px-2 py-2 sm:py-2.5 rounded-full hover:bg-orange-500 transition disabled:opacity-70" :disabled="buying" @click.stop.prevent="handleBuyNow">
        <Zap :size="14" class="shrink-0 sm:hidden" />
        <Zap :size="15" class="hidden sm:block shrink-0" />
        <span class="truncate sm:hidden">{{ buying ? "Adding..." : "Buy" }}</span>
        <span class="hidden truncate sm:block">{{ buying ? "Adding..." : "Buy Now" }}</span>
      </button>
    </div>
    <p v-if="notice" class="mt-2 text-center text-xs font-medium text-green-600">{{ notice }}</p>
  </div>
</template>
