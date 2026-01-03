import { mockProducts } from './mockData';

const STORAGE_KEY_USER = 'lumina_mock_user';
const STORAGE_KEY_SESSION = 'lumina_mock_session';
const STORAGE_KEY_ORDERS = 'lumina_mock_orders';

// Helper to get stored data
const getStored = (key: string, defaultVal: any) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch {
        return defaultVal;
    }
};

// Helper to set stored data
const setStored = (key: string, val: any) => {
    localStorage.setItem(key, JSON.stringify(val));
};

// Default Mock User
const defaultMockUser = {
    id: 'mock-user-id',
    email: 'user@example.com',
    user_metadata: {
        full_name: 'Demo User',
    },
    role: 'authenticated',
    aud: 'authenticated',
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockSupabaseClient {
    auth = {
        signUp: async ({ email, password, options }: any) => {
            await delay(500);
            console.log('[MockSupabase] SignUp:', email);

            const newUser = {
                ...defaultMockUser,
                email,
                user_metadata: options?.data || {},
            };

            const newSession = {
                access_token: 'mock-access-token-' + Date.now(),
                refresh_token: 'mock-refresh-token-' + Date.now(),
                expires_in: 3600,
                token_type: 'bearer',
                user: newUser,
            };

            setStored(STORAGE_KEY_USER, newUser);
            setStored(STORAGE_KEY_SESSION, newSession);

            return {
                data: { user: newUser, session: newSession },
                error: null,
            };
        },

        signInWithPassword: async ({ email }: any) => {
            await delay(500);
            console.log('[MockSupabase] SignIn:', email);

            // Load existing or create new for this session
            let user = getStored(STORAGE_KEY_USER, null);
            if (!user || user.email !== email) {
                user = { ...defaultMockUser, email };
            }

            const session = {
                access_token: 'mock-access-token-' + Date.now(),
                refresh_token: 'mock-refresh-token-' + Date.now(),
                expires_in: 3600,
                token_type: 'bearer',
                user: user,
            };

            setStored(STORAGE_KEY_USER, user);
            setStored(STORAGE_KEY_SESSION, session);

            return {
                data: { user, session },
                error: null,
            };
        },

        signOut: async () => {
            await delay(200);
            console.log('[MockSupabase] SignOut');
            localStorage.removeItem(STORAGE_KEY_USER);
            localStorage.removeItem(STORAGE_KEY_SESSION);
            return { error: null };
        },

        getUser: async () => {
            const user = getStored(STORAGE_KEY_USER, null);
            // If we have a user in storage, return it, else null (unauthenticated)
            return {
                data: { user },
                error: null,
            };
        },

        updateUser: async (attributes: any) => {
            await delay(300);
            console.log('[MockSupabase] UpdateUser:', attributes);

            const user = getStored(STORAGE_KEY_USER, defaultMockUser);

            // Merge updates
            if (attributes.data) {
                Object.assign(user.user_metadata, attributes.data);
            }
            if (attributes.email) user.email = attributes.email;
            // Password would ideally change here too in a real mock

            setStored(STORAGE_KEY_USER, user);

            return {
                data: { user },
                error: null
            }
        }
    };

    from(table: string) {
        return {
            select: (columns: string = '*') => {
                return {
                    eq: (column: string, value: any) => {
                        if (table === 'products' && column === 'id') {
                            return {
                                single: async () => {
                                    await delay(200);
                                    const product = mockProducts.find(p => p.id === value);
                                    return { data: product || null, error: product ? null : { message: 'Not found' } };
                                }
                            }
                        }
                        if (table === 'products' && column === 'category') {
                            const filtered = mockProducts.filter(p => p.category === value);
                            return {
                                then: async (cb: any) => cb({ data: filtered, error: null })
                            }
                        }
                        return {
                            single: async () => ({ data: null, error: null })
                        }
                    },

                    order: (column: string, { ascending }: any = {}) => {
                        // Basic support for ordering orders
                        if (table === 'orders') {
                            return {
                                then: async (cb: any) => {
                                    const orders = getStored(STORAGE_KEY_ORDERS, []);
                                    // Sort mock orders
                                    orders.sort((a: any, b: any) => {
                                        if (ascending) return a[column] > b[column] ? 1 : -1;
                                        return a[column] < b[column] ? 1 : -1;
                                    });
                                    cb({ data: orders, error: null });
                                }
                            }
                        }
                        return {
                            then: async (cb: any) => cb({ data: [], error: null })
                        }
                    },

                    then: async (callback: any) => {
                        await delay(300);
                        if (table === 'products') {
                            callback({ data: mockProducts, error: null });
                        } else if (table === 'orders') {
                            const orders = getStored(STORAGE_KEY_ORDERS, []);
                            callback({ data: orders, error: null });
                        } else {
                            callback({ data: [], error: null });
                        }
                    }
                };
            },

            insert: async (data: any) => {
                console.log(`[MockSupabase] Insert into ${table}:`, data);
                await delay(300);

                if (table === 'orders') {
                    const orders = getStored(STORAGE_KEY_ORDERS, []);
                    const newOrder = { ...data, id: 'order-' + Date.now(), created_at: new Date().toISOString() };
                    orders.push(newOrder);
                    setStored(STORAGE_KEY_ORDERS, orders);
                    return { data: newOrder, error: null };
                }

                return { data: [data], error: null }; // Supabase insert returns an array of inserted rows
            }
        };
    }
}

export const mockSupabase = new MockSupabaseClient();
