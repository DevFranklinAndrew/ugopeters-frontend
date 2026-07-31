import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { mockSubscribers, type Subscriber } from "../data/mockData";

/**
 * In-memory data store for the admin dashboard's subscribers.
 * Seeded from placeholder mock data; mutations live in React state and reset on
 * reload — intentional until subscribers get a backend, at which point they
 * migrate to React Query like posts and messages already have
 * (see src/hooks/usePosts.ts and src/hooks/useMessages.ts).
 *
 * Posts and messages are NOT here anymore — they're server state via React Query.
 */

interface AdminDataContextType {
  subscribers: Subscriber[];
  deleteSubscriber: (id: string) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(
  undefined,
);

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => [
    ...mockSubscribers,
  ]);

  const deleteSubscriber = (id: string) =>
    setSubscribers((prev) => prev.filter((s) => s.id !== id));

  return (
    <AdminDataContext.Provider value={{ subscribers, deleteSubscriber }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined)
    throw new Error("useAdminData must be used within an AdminDataProvider");
  return context;
};
