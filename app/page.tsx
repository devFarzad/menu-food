"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Coffee, Utensils, IceCream, Search } from "lucide-react"
import { getMenuCategories, getFeaturedItem } from "../lib/menu-data"
import type { MenuItem, MenuCategory } from "../lib/models"
import { CSSTransition, TransitionGroup } from "react-transition-group"

const ITEMS_PER_PAGE = 6

export default function RestaurantMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const categories = getMenuCategories()
  const featuredItem = getFeaturedItem()
  const [isScrollable, setIsScrollable] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        setIsScrollable(scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth)
      }
    }

    checkScrollable()
    window.addEventListener("resize", checkScrollable)
    return () => window.removeEventListener("resize", checkScrollable)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const filteredItems = categories
    .flatMap((category) => category.items)
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const paginatedItems = selectedCategory
    ? categories
        .find((cat) => cat.name === selectedCategory)
        ?.items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const totalPages = Math.ceil(
    (selectedCategory
      ? categories.find((cat) => cat.name === selectedCategory)?.items.length || 0
      : filteredItems.length) / ITEMS_PER_PAGE,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchTerm])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 sm:p-8 menu-pattern">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-8 text-amber-800 drop-shadow-lg text-shadow"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Delightful Menu
      </motion.h1>

      <div className="sticky top-0 z-10 mb-6 flex justify-center items-center bg-blur glass-effect p-4 rounded-lg shadow-md">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white bg-opacity-80"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
        </div>
      </div>

      {!searchTerm && featuredItem && <FeaturedDish item={featuredItem} />}

      <div className="relative mb-8">
        {isScrollable && (
          <>
            <motion.button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="text-amber-800" />
            </motion.button>
            <motion.button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="text-amber-800" />
            </motion.button>
          </>
        )}
        <div ref={scrollContainerRef} className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4">
          {categories.map((category) => (
            <CategoryButton
              key={category.name}
              category={category}
              isSelected={selectedCategory === category.name}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TransitionGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedItems?.map((item) => (
              <CSSTransition key={item.id} timeout={300} classNames="menu-item">
                <MenuItemCard item={item} />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </motion.div>
      </AnimatePresence>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}

function FeaturedDish({ item }: { item: MenuItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 bg-white rounded-lg shadow-lg overflow-hidden hover-lift"
    >
      <div className="relative">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 sm:h-64 object-cover" />
        <motion.div
          className="absolute top-0 left-0 bg-amber-500 text-white px-4 py-2 rounded-br-lg"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          Featured
        </motion.div>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <motion.p
          className="text-xl font-bold text-amber-600"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
        >
          ${item.price.toFixed(2)}
        </motion.p>
      </div>
    </motion.div>
  )
}

function CategoryButton({
  category,
  isSelected,
  onClick,
}: {
  category: MenuCategory
  isSelected: boolean
  onClick: () => void
}) {
  const getIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "main courses":
        return <Utensils className="mr-2" />
      case "desserts":
        return <IceCream className="mr-2" />
      case "drinks":
        return <Coffee className="mr-2" />
      default:
        return null
    }
  }

  return (
    <motion.button
      onClick={onClick}
      className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 flex items-center ${
        isSelected ? "bg-amber-600 text-white shadow-lg" : "bg-white text-amber-800 hover:bg-amber-100"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {getIcon(category.name)}
      {category.name}
    </motion.button>
  )
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-semibold text-white mb-1">{item.name}</h3>
          <p className="text-white font-bold">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="p-4">
        <p className={`text-gray-600 text-sm ${isExpanded ? "" : "line-clamp-2"}`}>{item.description}</p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-amber-600 hover:text-amber-700 focus:outline-none"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      </div>
    </motion.div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md bg-amber-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-amber-800">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-md bg-amber-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

