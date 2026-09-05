"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "@/lib/api";

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

  addToCart: (product: CartItem, options?: { silent?: boolean }) => void;

  removeFromCart: (
    _id: string,
    color?: string,
    size?: string
  ) => void;

  removeItemsFromCart: (
    itemsToRemove: { _id: string; color?: string; size?: string }[]
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

  syncCartStock: (
    addToWishlist: (item: {
      _id: string;
      name: string;
      price: number;
      image: string;
    }) => void,
    showToast?: (message: string, type?: "success" | "error" | "info") => void
  ) => Promise<void>;

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
    product: CartItem,
    options?: { silent?: boolean }
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

    // Open drawer after adding unless silent mode is requested
    if (!options?.silent) {
      setIsCartOpen(true);
    }
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
  // Remove Specific Items from Cart (e.g. Purchased Items)
  // ========================================

  const removeItemsFromCart = (
    itemsToRemove: { _id: string; color?: string; size?: string }[]
  ) => {
    if (!itemsToRemove || itemsToRemove.length === 0) return;

    setCart((prevCart) =>
      prevCart.filter(
        (cartItem) =>
          !itemsToRemove.some((remItem) =>
            isSameVariant(
              cartItem,
              remItem._id,
              remItem.color,
              remItem.size
            )
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
  // Inventory Sync (Cart -> Wishlist)
  // ========================================

  const syncCartStock = async (
    addToWishlist: (item: {
      _id: string;
      name: string;
      price: number;
      image: string;
    }) => void,
    showToast?: (message: string, type?: "success" | "error" | "info") => void
  ) => {
    if (!cart || cart.length === 0) return;

    try {
      const productIds = Array.from(new Set(cart.map((item) => item._id)));

      const responses = await Promise.allSettled(
        productIds.map((id) => api.get(`/products/${id}`))
      );

      const outOfStockIds = new Set<string>();

      responses.forEach((res, index) => {
        if (res.status === "fulfilled" && res.value?.data?.product) {
          const prod = res.value.data.product;
          if (
            prod.stock !== undefined &&
            prod.stock !== null &&
            Number(prod.stock) <= 0
          ) {
            outOfStockIds.add(productIds[index]);
          }
        }
      });

      if (outOfStockIds.size === 0) return;

      const itemsToRemove = cart.filter((item) => outOfStockIds.has(item._id));

      if (itemsToRemove.length > 0) {
        itemsToRemove.forEach((item) => {
          addToWishlist({
            _id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
          });

          if (showToast) {
            showToast(
              `"${item.name}" is out of stock and has been moved to your Wishlist.`,
              "info"
            );
          }
        });

        setCart((prevCart) =>
          prevCart.filter((item) => !outOfStockIds.has(item._id))
        );
      }
    } catch (error) {
      console.error("Failed to sync cart stock:", error);
    }
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

        removeItemsFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        syncCartStock,

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