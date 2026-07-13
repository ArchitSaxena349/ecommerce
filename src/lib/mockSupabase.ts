import { mockProducts } from './mockData';
import type { Product } from '../types';

const STORAGE_KEY_USER = 'lumina_mock_user';
const STORAGE_KEY_SESSION = 'lumina_mock_session';
const STORAGE_KEY_ORDERS = 'lumina_mock_orders';
const STORAGE_KEY_ORDER_ITEMS = 'lumina_mock_order_items';

type MockError = { message: string } | null;
type QueryResult<T> = { data: T; error: MockError };

interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    settings?: { language: string; timezone: string };
    [key: string]: unknown;
  };
  role: 'authenticated';
  aud: 'authenticated';
}

interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'bearer';
  user: MockUser;
}

interface MockOrder {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
}

interface MockOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

const getStored = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStored = <T>(key: string, val: T): void => {
  localStorage.setItem(key, JSON.stringify(val));
};

const defaultMockUser: MockUser = {
  id: 'mock-user-id',
  email: 'user@example.com',
  user_metadata: {
    full_name: 'Demo User',
  },
  role: 'authenticated',
  aud: 'authenticated',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockSupabaseClient {
  auth = {
    signUp: async ({
      email,
      options,
    }: {
      email: string;
      password: string;
      options?: { data?: Record<string, unknown> };
    }): Promise<QueryResult<{ user: MockUser; session: MockSession }>> => {
      await delay(500);

      const newUser: MockUser = {
        ...defaultMockUser,
        email,
        user_metadata: (options?.data || {}) as MockUser['user_metadata'],
      };

      const newSession: MockSession = {
        access_token: `mock-access-token-${Date.now()}`,
        refresh_token: `mock-refresh-token-${Date.now()}`,
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

    signInWithPassword: async ({
      email,
    }: {
      email: string;
      password: string;
    }): Promise<QueryResult<{ user: MockUser; session: MockSession }>> => {
      await delay(500);

      let user = getStored<MockUser | null>(STORAGE_KEY_USER, null);
      if (!user || user.email !== email) {
        user = { ...defaultMockUser, email };
      }

      const session: MockSession = {
        access_token: `mock-access-token-${Date.now()}`,
        refresh_token: `mock-refresh-token-${Date.now()}`,
        expires_in: 3600,
        token_type: 'bearer',
        user,
      };

      setStored(STORAGE_KEY_USER, user);
      setStored(STORAGE_KEY_SESSION, session);

      return {
        data: { user, session },
        error: null,
      };
    },

    signOut: async (): Promise<{ error: MockError }> => {
      await delay(200);
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_SESSION);
      return { error: null };
    },

    getUser: async (): Promise<QueryResult<{ user: MockUser | null }>> => {
      const user = getStored<MockUser | null>(STORAGE_KEY_USER, null);
      return {
        data: { user },
        error: null,
      };
    },

    getSession: async (): Promise<QueryResult<{ session: MockSession | null }>> => ({
      data: { session: getStored<MockSession | null>(STORAGE_KEY_SESSION, null) },
      error: null,
    }),

    updateUser: async (attributes: {
      data?: Record<string, unknown>;
      email?: string;
      password?: string;
    }): Promise<QueryResult<{ user: MockUser }>> => {
      await delay(300);
      const user = getStored<MockUser>(STORAGE_KEY_USER, defaultMockUser);

      if (attributes.data) {
        user.user_metadata = { ...user.user_metadata, ...attributes.data };
      }
      if (attributes.email) {
        user.email = attributes.email;
      }

      setStored(STORAGE_KEY_USER, user);

      return {
        data: { user },
        error: null,
      };
    },
  };

  from(table: string) {
    return {
      select: () => {
        const allRowsPromise: Promise<QueryResult<unknown[]>> = (async () => {
          await delay(300);
          if (table === 'products') {
            return { data: mockProducts, error: null };
          }
          if (table === 'orders') {
            return { data: getStored<MockOrder[]>(STORAGE_KEY_ORDERS, []), error: null };
          }
          if (table === 'order_items') {
            return { data: getStored<MockOrderItem[]>(STORAGE_KEY_ORDER_ITEMS, []), error: null };
          }
          return { data: [], error: null };
        })();

        return {
          eq: (column: string, value: unknown) => {
            if (table === 'products' && column === 'id') {
              return {
                single: async (): Promise<QueryResult<Product | null>> => {
                  await delay(200);
                  const product = mockProducts.find(p => p.id === String(value)) || null;
                  return {
                    data: product,
                    error: product ? null : { message: 'Not found' },
                  };
                },
              };
            }

            const filteredPromise: Promise<QueryResult<unknown[]>> = (async () => {
              await delay(200);

              if (table === 'products' && column === 'category') {
                return {
                  data: mockProducts.filter(p => p.category === String(value)),
                  error: null,
                };
              }

              if (table === 'orders') {
                const orders = getStored<MockOrder[]>(STORAGE_KEY_ORDERS, []);
                return {
                  data: orders.filter(order => (order as Record<string, unknown>)[column] === value),
                  error: null,
                };
              }

              if (table === 'order_items') {
                const orderItems = getStored<MockOrderItem[]>(STORAGE_KEY_ORDER_ITEMS, []);
                return {
                  data: orderItems.filter(item => (item as Record<string, unknown>)[column] === value),
                  error: null,
                };
              }

              return { data: [], error: null };
            })();

            return {
              then: filteredPromise.then.bind(filteredPromise),
            };
          },

          order: (column: string, { ascending = true }: { ascending?: boolean } = {}) => {
            const orderedPromise: Promise<QueryResult<unknown[]>> = (async () => {
              await delay(200);
              if (table === 'orders') {
                const orders = getStored<MockOrder[]>(STORAGE_KEY_ORDERS, []);
                const sorted = [...orders].sort((a, b) => {
                  const left = (a as Record<string, unknown>)[column];
                  const right = (b as Record<string, unknown>)[column];
                  if (left === right) return 0;
                  if (left === undefined || left === null) return ascending ? -1 : 1;
                  if (right === undefined || right === null) return ascending ? 1 : -1;
                  return (left > right ? 1 : -1) * (ascending ? 1 : -1);
                });
                return { data: sorted, error: null };
              }
              return { data: [], error: null };
            })();

            return orderedPromise;
          },

          then: allRowsPromise.then.bind(allRowsPromise),
        };
      },

      insert: async (
        data: Record<string, unknown> | Array<Record<string, unknown>>
      ): Promise<QueryResult<Record<string, unknown> | Array<Record<string, unknown>>>> => {
        await delay(300);

        if (table === 'orders') {
          const orders = getStored<MockOrder[]>(STORAGE_KEY_ORDERS, []);
          const input = Array.isArray(data) ? data[0] : data;
          const newOrder: MockOrder = {
            id: `order-${Date.now()}`,
            user_id: String(input.user_id || 'guest'),
            status: String(input.status || 'pending'),
            total: Number(input.total || 0),
            created_at: new Date().toISOString(),
          };
          orders.push(newOrder);
          setStored(STORAGE_KEY_ORDERS, orders);
          return { data: newOrder as unknown as Record<string, unknown>, error: null };
        }

        if (table === 'order_items') {
          const orderItems = getStored<MockOrderItem[]>(STORAGE_KEY_ORDER_ITEMS, []);
          const rows = Array.isArray(data) ? data : [data];
          const insertedItems = rows.map((row, idx) => ({
            id: `order-item-${Date.now()}-${idx}`,
            order_id: String(row.order_id || ''),
            product_id: String(row.product_id || ''),
            quantity: Number(row.quantity || 0),
            price: Number(row.price || 0),
          }));

          setStored(STORAGE_KEY_ORDER_ITEMS, [...orderItems, ...insertedItems]);
          return {
            data: insertedItems as unknown as Array<Record<string, unknown>>,
            error: null,
          };
        }

        return { data, error: null };
      },
    };
  }
}

export const mockSupabase = new MockSupabaseClient();
