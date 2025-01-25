import type { MenuItem, MenuCategory } from "./models"

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
    image: "/images/margherita.jpg",
    featured: true,
  },
  {
    id: "2",
    name: "Pepperoni Pizza",
    description: "Pizza topped with tomato sauce, mozzarella, and pepperoni",
    price: 14.99,
    category: "Pizza",
    image: "/images/pepperoni.jpg",
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, croutons, parmesan cheese, and Caesar dressing",
    price: 8.99,
    category: "Salads",
    image: "/images/caesar-salad.jpg",
  },
  {
    id: "4",
    name: "Spaghetti Carbonara",
    description: "Spaghetti with crispy pancetta, egg, hard cheese, and black pepper",
    price: 15.99,
    category: "Pasta",
    image: "/images/carbonara.jpg",
  },
  {
    id: "5",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    price: 7.99,
    category: "Desserts",
    image: "/images/tiramisu.jpg",
  },
]

export function getMenuItems(): MenuItem[] {
  return menuItems
}

export function getMenuCategories(): MenuCategory[] {
  const categories: { [key: string]: MenuItem[] } = {}

  menuItems.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = []
    }
    categories[item.category].push(item)
  })

  return Object.entries(categories).map(([name, items]) => ({ name, items }))
}

export function getFeaturedItem(): MenuItem | undefined {
  return menuItems.find((item) => item.featured)
}

