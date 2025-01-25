export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  featured?: boolean
}

export interface MenuCategory {
  name: string
  items: MenuItem[]
}

