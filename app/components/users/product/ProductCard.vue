<script setup>
import { Heart, Star, Zap, ShoppingCart, Check } from "lucide-vue-next";
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
const notice = ref("");

const handleHeartClick = async () => {
  const ok = await toggle(props.product);
  if (!ok) router.push("/auth/login");
};

const addToCart = async () => {
  adding.value = true;
  notice.value = "";
  const ok = await add(props.product, 1);
  adding.value = false;
  if (!ok) {
    router.push("/auth/login");
    return;
  }
  notice.value = "Added to cart";
  setTimeout(() => (notice.value = ""), 1500);
};

const handleBuyNow = async () => {
  buying.value = true;
  const ok = await add(props.product, 1);
  buying.value = false;
  if (!ok) {
    router.push("/auth/login");
    return;
  }
  openPayment();
};
</script>

<template>
  <article class="group flex h-full flex-col">
    <NuxtLink :to="`/product/${product.id}`" class="block">
      <div class="relative aspect-4/5 overflow-hidden rounded-2xl bg-mist">
        <img
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span
          v-if="product.discount"
          class="absolute left-3 top-3 rounded-full bg-orange-600 px-2.5 py-1 text-xs font-bold text-white"
        >
          -{{ product.discount }}%
        </span>

        <button
          type="button"
          class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
          :class="liked ? 'text-orange-600' : 'text-gray-500 hover:text-orange-600'"
          :aria-label="liked ? 'Remove from wishlist' : 'Add to wishlist'"
          :aria-pressed="liked"
          @click.stop.prevent="handleHeartClick"
        >
          <Heart :size="18" :fill="liked ? 'currentColor' : 'none'" />
        </button>
      </div>

      <div class="pt-3.5">
        <h3
          class="line-clamp-2 font-display text-base font-semibold leading-snug text-ink transition group-hover:text-orange-600"
        >
          {{ product.name }}
        </h3>

        <div class="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <Star :size="14" fill="currentColor" class="text-amber-400" />
          <span class="font-semibold text-gray-800">{{ product.rating }}</span>
          <span>({{ product.reviews }})</span>
        </div>

        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-lg font-bold text-ink">${{ product.price }}</span>
          <span v-if="product.oldPrice" class="text-sm text-gray-400 line-through">
            ${{ product.oldPrice }}
          </span>
        </div>
      </div>
    </NuxtLink>

    <div class="mt-auto pt-3.5">
      <div class="flex gap-2">
        <button
          type="button"
          class="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          :disabled="adding"
          @click.stop.prevent="addToCart"
        >
          <Check v-if="notice" :size="16" class="shrink-0" />
          <ShoppingCart v-else :size="16" class="shrink-0" />
          <span class="truncate">
            {{ adding ? "Adding..." : notice ? "Added" : "Add to cart" }}
          </span>
        </button>

        <button
          type="button"
          class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-line px-3.5 py-2.5 text-sm font-semibold text-ink transition hover:border-orange-500 hover:text-orange-600 disabled:opacity-60"
          :disabled="buying"
          :aria-label="`Buy ${product.name} now`"
          @click.stop.prevent="handleBuyNow"
        >
          <Zap :size="16" class="shrink-0" />
          <span class="hidden sm:inline">{{ buying ? "..." : "Buy" }}</span>
        </button>
      </div>
      <p class="sr-only" role="status" aria-live="polite">{{ notice }}</p>
    </div>
  </article>
</template>