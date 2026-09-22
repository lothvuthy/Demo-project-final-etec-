import { computed } from 'vue'
import { useState } from '#app'
import { useCart } from './useCart'
import { useAuth } from './useAuth'
import { useLocalStore } from './useLocalStore'

const MAX_POLL_FAILURES = 10


export const usePayment = () => {
  const config = useRuntimeConfig()
  const bakongApiBase = String(config.public.bakongApiBase || '').replace(/\/$/, '')
  const { items, subtotal, clear } = useCart()
  const { user } = useAuth()
  const localStore = useLocalStore()

  const showModal = useState<boolean>('payment-modal-open', () => false)

  const paying = useState<boolean>('payment-paying', () => false)
  const paid = useState<boolean>('payment-paid', () => false)
  const orderId = useState<string | number | null>('payment-order-id', () => null)
  const selectedLabel = 'KHQR (Bakong)'

  const qrImage = useState<string | null>('payment-qr-image', () => null)
  const khqrMd5 = useState<string | null>('payment-khqr-md5', () => null)
  const khqrLoading = useState<boolean>('payment-khqr-loading', () => false)
  const khqrError = useState<string | null>('payment-khqr-error', () => null)
  const orderError = useState<boolean>('payment-order-error', () => false)

  const pollTimer = useState<ReturnType<typeof setInterval> | null>('payment-poll-timer', () => null)
  const pollFailCount = useState<number>('payment-poll-fail-count', () => 0)

  const deliveryFee = computed(() => (subtotal.value === 0 || subtotal.value >= 150 ? 0 : 0.01))
  const total = computed(() => Math.max(0, subtotal.value + deliveryFee.value))

  const stopPolling = () => {
    if (pollTimer.value) {
      clearInterval(pollTimer.value)
      pollTimer.value = null
    }
  }

  const confirmPayment = async () => {
    if (!items.value.length || paying.value || paid.value) return
    paying.value = true
    orderError.value = false

    try {
      const order: any = await $fetch('http://localhost:8000/orders', {
        method: 'POST',
        body: {
          userId: user.value?.id,
          userName: user.value?.name || '',
          userEmail: user.value?.email || '',
          userAddress: user.value?.address || '',
          items: items.value,
          subtotal: subtotal.value,
          discount: 0,
          deliveryFee: deliveryFee.value,
          total: total.value,
          paymentMethod: selectedLabel,
          paymentReference: khqrMd5.value,
          createdAt: new Date().toISOString(),
        },
      })
      orderId.value = order?.id ?? null
      await clear()
      paid.value = true
    } catch (err) {
      console.error('Order error:', err)
      const order = localStore.add('orders', {
        userId: user.value?.id,
        userName: user.value?.name || '',
        userEmail: user.value?.email || '',
        userAddress: user.value?.address || '',
        items: items.value,
        subtotal: subtotal.value,
        discount: 0,
        deliveryFee: deliveryFee.value,
        total: total.value,
        paymentMethod: 'Demo payment',
        paymentReference: khqrMd5.value,
        createdAt: new Date().toISOString()
      } as Record<string, any>)
      orderId.value = order.id
      await clear()
      paid.value = true
    } finally {
      paying.value = false
    }
  }

  const startPolling = () => {
    stopPolling()
    pollFailCount.value = 0
    pollTimer.value = setInterval(async () => {
      if (!khqrMd5.value) return
      try {
        const res: any = await $fetch(`${bakongApiBase}/api/check-payment`, {
          query: { md5: khqrMd5.value },
        })
        pollFailCount.value = 0
        if (res.status === 'PAID') {
          stopPolling()
          await confirmPayment()
        }
      } catch (err) {
        pollFailCount.value += 1
        console.error('check-payment error:', err)
        if (pollFailCount.value >= MAX_POLL_FAILURES) {
          stopPolling()
          khqrError.value = 'This QR code has expired or is no longer valid. Please generate a new one.'
        }
      }
    }, 3000)
  }

  const generateKhqr = async () => {
    if (!items.value.length) return
    khqrLoading.value = true
    khqrError.value = null
    orderError.value = false
    qrImage.value = null
    khqrMd5.value = null
    stopPolling()

    try {
      if (!bakongApiBase) throw new Error('Bakong API URL is not configured')
      const res: any = await $fetch(`${bakongApiBase}/api/generate-qr`, {
        method: 'POST',
        body: {
          amount: total.value,
          currency: 'USD',
          description: `Order for ${user.value?.name || 'Customer'}`,
        },
      })
      qrImage.value = res.qr_image
      khqrMd5.value = res.md5
      startPolling()
    } catch (err) {
      console.error('generate-qr error:', err)
      khqrMd5.value = `demo-${Date.now()}`
      khqrError.value = 'Demo payment mode: the real Bakong server is unavailable. Confirm to place a local test order.'
    } finally {
      khqrLoading.value = false
    }
  }
  const openPayment = () => {
    paid.value = false
    orderError.value = false
    orderId.value = null
    showModal.value = true
    generateKhqr()
  }

  const closePayment = () => {
    stopPolling()
    showModal.value = false
  }

  return {
    items,
    total,
    deliveryFee,
    showModal,
    paying,
    paid,
    orderId,
    orderError,
    selectedLabel,
    qrImage,
    khqrMd5,
    khqrLoading,
    khqrError,
    user,
    openPayment,
    closePayment,
    generateKhqr,
    confirmPayment,
    stopPolling,
  }
}
