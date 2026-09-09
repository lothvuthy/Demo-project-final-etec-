<template>
  <footer class="bg-slate-900 text-white mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl font-extrabold text-orange-500">ShopiO</h2>
          <h3 class="mt-3 text-lg font-semibold">Phnom Penh</h3>
          <p class="mt-2 text-slate-300">Street 168, ETEC Center.</p>
        </div>

        <div>
          <h3 class="text-lg font-bold mb-4">Contact</h3>
          <ul class="space-y-2 text-slate-300 text-sm">
            <li>Email: info@ShopiO.com</li>
            <li>Phone: +855 123456789</li>
            <li>Telegram: Team2</li>
            <li>Address: Phnom Penh, Cambodia</li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-slate-700 text-sm text-slate-400 text-center">
        © {{ new Date().getFullYear() }} ShopiO. All rights reserved.
      </div>
    </div>
  </footer>
</template>
