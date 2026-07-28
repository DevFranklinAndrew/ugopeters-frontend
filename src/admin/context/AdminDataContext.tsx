import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { posts as seedPosts, type Post } from "../../data/post";
import {
  mockMessages,
  mockSubscribers,
  type ContactMessage,
  type Subscriber,
} from "../data/mockData";

/**
 * In-memory data store for the admin dashboard. Seeded from the existing
 * hardcoded posts and placeholder mock data. All mutations live in React state
 * and reset on reload — this is intentional until the backend/API exist, at
 * which point each operation becomes an API call.
 */

export type PostInput = Omit<Post, "id">;

interface AdminDataContextType {
  posts: Post[];
  getPost: (id: string) => Post | undefined;
  addPost: (input: PostInput) => Post;
  updatePost: (id: string, input: PostInput) => void;
  deletePost: (id: string) => void;

  messages: ContactMessage[];
  markMessageRead: (id: string, read: boolean) => void;
  deleteMessage: (id: string) => void;

  subscribers: Subscriber[];
  deleteSubscriber: (id: string) => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(
  undefined,
);

const genId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(() => [...seedPosts]);
  const [messages, setMessages] = useState<ContactMessage[]>(() => [
    ...mockMessages,
  ]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => [
    ...mockSubscribers,
  ]);

  const getPost = (id: string) => posts.find((p) => p.id === id);

  const addPost: AdminDataContextType["addPost"] = (input) => {
    const post: Post = { ...input, id: genId() };
    setPosts((prev) => [post, ...prev]);
    return post;
  };

  const updatePost: AdminDataContextType["updatePost"] = (id, input) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...input, id } : p)),
    );
  };

  const deletePost = (id: string) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

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
        posts,
        getPost,
        addPost,
        updatePost,
        deletePost,
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
