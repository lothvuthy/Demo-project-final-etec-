import shopio from '~/data/shopio.json'

export type LocalCollection = 'products' | 'users' | 'messages' | 'orders' | 'categories'

const keyFor = (collection: LocalCollection) => `shopio_${collection}`

const seedFor = (collection: LocalCollection) => {
  const data = shopio[collection]
  return Array.isArray(data) ? data : []
}

export const useLocalStore = () => {
  const read = <T = any>(collection: LocalCollection): T[] => {
    if (import.meta.server) return seedFor(collection) as T[]
    const raw = localStorage.getItem(keyFor(collection))
    if (raw) {
      try {
        return JSON.parse(raw) as T[]
      } catch {
        localStorage.removeItem(keyFor(collection))
      }
    }
    const seeded = seedFor(collection) as T[]
    localStorage.setItem(keyFor(collection), JSON.stringify(seeded))
    return seeded
  }

  const write = <T = any>(collection: LocalCollection, values: T[]) => {
    if (import.meta.client) localStorage.setItem(keyFor(collection), JSON.stringify(values))
    return values
  }

  const add = <T extends Record<string, any>>(collection: LocalCollection, value: T) => {
    const created = { ...value, id: value.id ?? `local-${Date.now()}` } as T
    write(collection, [...read<T>(collection), created])
    return created
  }

  const remove = (collection: LocalCollection, id: string | number) => {
    write(collection, read(collection).filter((item: any) => String(item.id) !== String(id)))
  }

  return { read, write, add, remove }
}
