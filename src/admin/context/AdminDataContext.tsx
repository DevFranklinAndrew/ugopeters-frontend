import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  mockMessages,
  mockSubscribers,
  type ContactMessage,
  type Subscriber,
} from "../data/mockData";

/**
 * In-memory data store for the admin dashboard's messages and subscribers.
 * Seeded from placeholder mock data; mutations live in React state and reset on
 * reload — intentional until those resources get a backend, at which point they
 * migrate to React Query like posts already have (see src/hooks/usePosts.ts).
 *
 * Posts are NOT here anymore — they're server state via React Query.
 */

interface AdminDataContextType {
  messages: ContactMessage[];
  markMessageRead: (id: string, read: boolean) => void;
  deleteMessage: (id: string) => void;

  subscribers: Subscriber[];
  deleteSubscriber: (id: string) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(
  undefined,
);

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ContactMessage[]>(() => [
    ...mockMessages,
  ]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => [
    ...mockSubscribers,
  ]);

  const markMessageRead = (id: string, read: boolean) =>
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read } : m)),
    );

  const deleteMessage = (id: string) =>
    setMessages((prev) => prev.filter((m) => m.id !== id));

  const deleteSubscriber = (id: string) =>
    setSubscribers((prev) => prev.filter((s) => s.id !== id));

  return (
    <AdminDataContext.Provider
      value={{
        messages,
        markMessageRead,
        deleteMessage,
        subscribers,
        deleteSubscriber,
      }}
    >
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
