<script setup lang="ts">
import Navbar from '~/components/layouts/Navbar.vue';
import Footer from '~/components/layouts/Footer.vue';

</script>
<template>
  <div>
    <Navbar />

    <main>
      <slot />
    </main>

    <Footer />
  </div>
</template>
