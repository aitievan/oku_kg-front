import Cookies from 'js-cookie'

export const setToken = (token) => {
  Cookies.set('token', token, { httpOnly: false })
}

export const getToken = () => {
  return Cookies.get('token')
}

export const removeToken = () => {
  Cookies.remove('token')
}

export const setUser = (userData) => {
  Cookies.set('user', JSON.stringify(userData), { httpOnly: false })
}

export const getUser = () => {
  const user = Cookies.get('user')
  return user ? JSON.parse(user) : null
}

export const removeUser = () => {
  Cookies.remove('user')
}

export const setWishlistItems = (wishlistItems) => {
  Cookies.set('wishlist', JSON.stringify(wishlistItems), { httpOnly: false })
}

export const getWishlistItems = () => {
  const wishlist = Cookies.get('wishlist')
  return wishlist ? JSON.parse(wishlist) : []
}

export const removeWishlistItems = () => {
  Cookies.remove('wishlist')
}

export const addBookToWishlistCookie = (book) => {
  const currentWishlist = getWishlistItems()
  const isBookInWishlist = currentWishlist.some(item => item.bookId === book.bookId)
  
  if (!isBookInWishlist) {
    const updatedWishlist = [...currentWishlist, book]
    setWishlistItems(updatedWishlist)
    return updatedWishlist
  }
  
  return currentWishlist
}

export const removeBookFromWishlistCookie = (bookId) => {
  const currentWishlist = getWishlistItems()
  const updatedWishlist = currentWishlist.filter(item => item.bookId !== bookId)
  setWishlistItems(updatedWishlist)
  return updatedWishlist
}