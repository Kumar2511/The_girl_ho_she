"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  quantity: number;
  color?: string;
  size?: string;
  colors?: string[];
  sizes?: string[];
}

interface CartContextType {
  cart: CartItem[];

  addToCart: (product: CartItem) => void;

  removeFromCart: (
    _id: string,
    color?: string,
    size?: string
  ) => void;

  increaseQuantity: (
    _id: string,
    color?: string,
    size?: string
  ) => void;

  decreaseQuantity: (
    _id: string,
    color?: string,
    size?: string
  ) => void;

  clearCart: () => void;

  // Cart Drawer
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

// ==========================================
// Cart Provider
// ==========================================

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] =
    useState(false);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // ========================================
  // Load Cart
  // ========================================

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem("cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      localStorage.removeItem("cart");
    } finally {
      setCartLoaded(true);
    }
  }, []);

  // ========================================
  // Save Cart
  // ========================================

  useEffect(() => {
    if (!cartLoaded) return;

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart, cartLoaded]);

  // ========================================
  // Variant Matcher
  // ========================================

  const isSameVariant = (
    item: CartItem,
    productId: string,
    color?: string,
    size?: string
  ) => {
    return (
      item._id === productId &&
      (item.color || "") ===
        (color || "") &&
      (item.size || "") ===
        (size || "")
    );
  };

  // ========================================
  // Add To Cart
  // ========================================

  const addToCart = (
    product: CartItem
  ) => {
    setCart((prevCart) => {
      const productColor =
        product.color || "";

      const productSize =
        product.size || "";

      const productQuantity =
        Number(product.quantity) || 1;

      const existing =
        prevCart.find((item) =>
          isSameVariant(
            item,
            product._id,
            productColor,
            productSize
          )
        );

      // Existing Product
      if (existing) {
        const currentQuantity =
          Number(existing.quantity) || 0;

        const stock =
          Number(existing.stock) || 0;

        const newQuantity =
          currentQuantity +
          productQuantity;

        if (
          stock > 0 &&
          newQuantity > stock
        ) {
          alert(
            `Only ${stock} item(s) available.`
          );

          return prevCart;
        }

        return prevCart.map((item) =>
          isSameVariant(
            item,
            product._id,
            productColor,
            productSize
          )
            ? {
                ...item,
                quantity:
                  newQuantity,
              }
            : item
        );
      }

      // New Product
      return [
        ...prevCart,
        {
          ...product,
          quantity:
            productQuantity,
          color:
            productColor,
          size:
            productSize,
        },
      ];
    });

    // Open drawer after adding
    setIsCartOpen(true);
  };

  // ========================================
  // Remove Product
  // ========================================

  const removeFromCart = (
    _id: string,
    color?: string,
    size?: string
  ) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !isSameVariant(
            item,
            _id,
            color,
            size
          )
      )
    );
  };

  // ========================================
  // Increase Quantity
  // ========================================

  const increaseQuantity = (
    _id: string,
    color?: string,
    size?: string
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          !isSameVariant(
            item,
            _id,
            color,
            size
          )
        ) {
          return item;
        }

        const currentQuantity =
          Number(item.quantity) || 0;

        const stock =
          Number(item.stock) || 0;

        if (
          stock > 0 &&
          currentQuantity >= stock
        ) {
          alert(
            `Only ${stock} item(s) available.`
          );

          return item;
        }

        return {
          ...item,
          quantity:
            currentQuantity + 1,
        };
      })
    );
  };

  // ========================================
  // Decrease Quantity
  // ========================================

  const decreaseQuantity = (
    _id: string,
    color?: string,
    size?: string
  ) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          !isSameVariant(
            item,
            _id,
            color,
            size
          )
        ) {
          return item;
        }

        const currentQuantity =
          Number(item.quantity) || 1;

        return {
          ...item,
          quantity: Math.max(
            currentQuantity - 1,
            1
          ),
        };
      })
    );
  };

  // ========================================
  // Clear Cart
  // ========================================

  const clearCart = () => {
    setCart([]);
  };

  // ========================================
  // Drawer Controls
  // ========================================

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // ========================================
  // Provider
  // ========================================

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        isCartOpen,

        openCart,

        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ==========================================
// useCart Hook
// ==========================================

export const useCart = () => {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};