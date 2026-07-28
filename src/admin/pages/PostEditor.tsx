import { useMemo, useRef, useState, type FormEvent } from "react";
import { LuArrowLeft, LuSave, LuUpload } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router";
import { useAdminData, type PostInput } from "../context/AdminDataContext";
import RichTextEditor from "../components/RichTextEditor";
import Select from "../../components/Select";

const AUTHOR = "Ugo Peters";
const WORDS_PER_MINUTE = 200;
const EXCERPT_LENGTH = 160;

const CATEGORIES = [
  "Strategy",
  "Real Estate",
  "Business",
  "Entrepreneurship",
  "Finance",
  "Innovation",
  "Technology",
  "AI",
  "Blockchain",
  "Education",
  "Policy",
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Strip HTML tags (and decode entities) so we can measure/slice the plain text.
const stripHtml = (html: string) => {
  const el = document.createElement("div");
  el.innerHTML = html;
  return (el.textContent || "").replace(/\s+/g, " ").trim();
};

const readingTime = (html: string) => {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
};

const deriveExcerpt = (html: string) => {
  const text = stripHtml(html);
  if (text.length <= EXCERPT_LENGTH) return text;
  return `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…`;
};

const formatDate = (date = new Date()) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const emptyPost: PostInput = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  date: "",
  category: "",
  readTime: "",
  image: "",
  featured: false,
  author: AUTHOR,
};

const inputClass =
  "w-full bg-transparent border-b border-border py-3 focus:border-gold focus:outline-none transition-colors text-lg font-serif";
const labelClass =
  "text-[10px] uppercase tracking-widest font-bold text-foreground/40";

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, addPost, updatePost } = useAdminData();

  const isEditing = Boolean(id);
  const existing = useMemo(
    () => (id ? getPost(id) : undefined),
    [id, getPost],
  );

  const [form, setForm] = useState<PostInput>(() =>
    existing ? { ...existing } : { ...emptyPost },
  );
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (isEditing && !existing) {
    return (
      <div className="max-w-3xl">
        <h1 className="text-4xl font-serif font-bold mb-6">Post not found</h1>
        <Link
          to="/admin/posts"
          className="text-gold uppercase tracking-widest text-xs font-bold border-b border-gold/30 pb-1 hover:border-gold"
        >
          Back to posts
        </Link>
      </div>
    );
  }

  const update = (patch: Partial<PostInput>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const previewSlug = slugify(form.title);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    // No upload backend yet — embed the cover as a base64 data URL. Swap this
    // for an upload call returning a URL once the API exists.
    const reader = new FileReader();
    reader.onload = () => update({ image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.category) {
      window.alert("Please select a category.");
      return;
    }
    const payload: PostInput = {
      ...form,
      slug: previewSlug,
      author: AUTHOR,
      // Generated on creation; preserved (unchanged) when editing.
      date: isEditing ? form.date : formatDate(),
      readTime: readingTime(form.content),
      // Excerpt is optional — fall back to a slice of the content.
      excerpt: form.excerpt.trim() || deriveExcerpt(form.content),
    };
    if (isEditing && id) {
      updatePost(id, payload);
    } else {
      addPost(payload);
    }
    navigate("/admin/posts");
  };

  return (
    <div className="max-w-4xl">
      <Link
        to="/admin/posts"
        className="inline-flex items-center gap-2 text-foreground/40 hover:text-gold transition-colors mb-8 group text-xs uppercase tracking-widest font-bold"
      >
        <LuArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to posts
      </Link>

      <h1 className="text-5xl max-mobile:text-4xl font-serif font-bold tracking-tight mb-12">
        {isEditing ? "Edit Post" : "New Post"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-2">
          <label className={labelClass}>Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="A compelling headline"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-10 max-mobile:grid-cols-1 max-mobile:gap-6">
          <div className="space-y-2">
            <label className={labelClass}>Category</label>
            <Select
              value={form.category}
              onChange={(value) => update({ category: value })}
              placeholder="Select a category"
              ariaLabel="Category"
              options={CATEGORIES.map((category) => ({
                value: category,
                label: category,
              }))}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Visibility</label>
            <label className="flex items-center gap-3 py-3 border-b border-border cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(e) => update({ featured: e.target.checked })}
                className="w-5 h-5 accent-gold"
              />
              <span className="text-sm font-medium">
                Feature on the blog page
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Cover image</label>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />
          {form.image ? (
            <div className="relative group w-full aspect-video overflow-hidden border border-border">
              <img
                src={form.image}
                alt="Cover preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase tracking-widest font-bold"
              >
                <LuUpload size={16} />
                Replace image
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="w-full aspect-video flex flex-col items-center justify-center gap-3 border border-dashed border-border text-foreground/40 hover:border-gold hover:text-gold transition-colors"
            >
              <LuUpload size={24} />
              <span className="text-xs uppercase tracking-widest font-bold">
                Upload cover image
              </span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          <label className={labelClass}>
            Excerpt{" "}
            <span className="text-foreground/30 normal-case tracking-normal">
              (optional)
            </span>
          </label>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => update({ excerpt: e.target.value })}
            placeholder="A short summary shown in the blog list."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Content</label>
          <RichTextEditor
            value={form.content}
            onChange={(html) => update({ content: html })}
            placeholder="Write your article..."
          />
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <button
            type="submit"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-xl shadow-gold/10"
          >
            <LuSave size={18} />
            {isEditing ? "Save Changes" : "Create Post"}
          </button>
          <Link
            to="/admin/posts"
            className="px-8 py-4 border border-border font-bold uppercase tracking-widest text-sm hover:border-gold hover:text-gold transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
