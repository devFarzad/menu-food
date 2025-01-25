import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMenu() {
      const menuCollection = collection(db, "menu")
      const menuSnapshot = await getDocs(menuCollection)
      const menuList = menuSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[]
      setMenu(menuList)
      setLoading(false)
    }

    fetchMenu()
  }, [])

  return { menu, loading }
}

