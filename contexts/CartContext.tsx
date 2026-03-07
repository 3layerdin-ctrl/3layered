'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, CartContextType } from '@/types/cart';
import { pixelAddToCart } from '@/lib/pixel';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'three-layered-cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>({
        items: [],
        totalItems: 0,
        subtotal: 0,
        currency: 'INR',
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to load cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const calculateItemPrice = (item: Omit<CartItem, 'id' | 'totalPrice'>): number => {
        let price = item.basePrice;
        Object.values(item.customizations).forEach(customization => {
            price += customization.priceModifier;
        });
        return price * item.quantity;
    };

    const addToCart = (itemData: Omit<CartItem, 'id' | 'totalPrice'>) => {
        const itemId = `${itemData.productId}-${Date.now()}-${Math.random()}`;
        const totalPrice = calculateItemPrice(itemData);

        const newItem: CartItem = {
            ...itemData,
            id: itemId,
            totalPrice,
        };

        pixelAddToCart({
            contentId: itemData.productId,
            contentName: itemData.productName,
            value: totalPrice,
        });

        setCart(prev => {
            const newItems = [...prev.items, newItem];
            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

            return {
                items: newItems,
                totalItems,
                subtotal,
                currency: itemData.currency,
            };
        });

        setIsCartOpen(true);
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => {
            const newItems = prev.items.filter(item => item.id !== itemId);
            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

            return {
                items: newItems,
                totalItems,
                subtotal,
                currency: prev.currency,
            };
        });
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }

        setCart(prev => {
            const newItems = prev.items.map(item => {
                if (item.id === itemId) {
                    const basePrice = item.basePrice;
                    const customizationTotal = Object.values(item.customizations).reduce(
                        (sum, c) => sum + c.priceModifier,
                        0
                    );
                    const totalPrice = (basePrice + customizationTotal) * quantity;

                    return { ...item, quantity, totalPrice };
                }
                return item;
            });

            const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

            return {
                items: newItems,
                totalItems,
                subtotal,
                currency: prev.currency,
            };
        });
    };

    const clearCart = () => {
        setCart({
            items: [],
            totalItems: 0,
            subtotal: 0,
            currency: 'INR',
        });
    };

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
} 