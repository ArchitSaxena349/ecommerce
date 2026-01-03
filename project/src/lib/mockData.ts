import { Product } from '../types';

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Experience immersive sound with our premium noise-canceling headphones. Features 30-hour battery life and ultra-comfortable ear cushions.',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        featured: true
    },
    {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness goals with precision. Features heart rate monitoring, sleep tracking, and built-in GPS.',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        category: 'Wearables',
        featured: true
    },
    {
        id: '3',
        name: 'Professional Camera Lens',
        description: 'Capture stunning photos with this high-aperture professional lens. Perfect for portrait and landscape photography.',
        price: 899.99,
        image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80',
        category: 'Photography',
        featured: false
    },
    {
        id: '4',
        name: 'Designer Sunglasses',
        description: 'Elevate your style with these premium designer sunglasses. usage UV protection and durable frame construction.',
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        featured: false
    },
    {
        id: '5',
        name: 'Minimalist Backpack',
        description: 'A stylish and functional backpack for your daily commute. Features a padded laptop sleeve and water-resistant material.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        category: 'Accessories',
        featured: false
    },
    {
        id: '6',
        name: 'Mechanical Keyboard',
        description: 'Boost your productivity with this tactile mechanical keyboard. Features RGB backlighting and programmable keys.',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b91a05c?auto=format&fit=crop&w=800&q=80',
        category: 'Electronics',
        featured: true
    }
];
