import { Controller } from "react-hook-form";
import { LuArrowLeft, LuSave } from "react-icons/lu";
import { Link } from "react-router";
import type { Post } from "../../data/post";
import { CATEGORIES } from "../../data/categories";
import { usePostForm } from "../hooks/usePostForm";
import { FormField, TextArea, TextInput } from "./FormField";
import PostCoverImageField from "./PostCoverImageField";
import RichTextEditor from "./RichTextEditor";
import Select from "../../components/Select";

const categoryOptions = CATEGORIES.map((category) => ({
  value: category,
  label: category,
}));

/** The post editor form. All logic lives in {@link usePostForm}. */
const PostEditorForm = ({ existing }: { existing?: Post }) => {
  const {
    form: {
      register,
      control,
      formState: { errors },
    },
    submit,
    handleCoverChange,
    image,
    isEditing,
    isSaving,
  } = usePostForm(existing);

  return (
    <div className="max-w-4xl mx-auto">
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

      <form onSubmit={submit} className="space-y-10" noValidate>
        <FormField label="Title" error={errors.title?.message}>
          <TextInput
            {...register("title")}
            error={Boolean(errors.title)}
            placeholder="A compelling headline"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-10 max-mobile:grid-cols-1 max-mobile:gap-6">
          <FormField label="Category" error={errors.category?.message}>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  invalid={Boolean(errors.category)}
                  placeholder="Select a category"
                  ariaLabel="Category"
                  options={categoryOptions}
                />
              )}
            />
          </FormField>

          <FormField label="Visibility">
            <label className="flex items-center gap-3 py-3 border-b border-border cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("featured")}
                className="w-5 h-5 accent-gold"
              />
              {/* leading-7 lifts this control's line box to the text-lg
                  line-height of the other fields, so its height (and bottom
                  border) lines up with the Category select beside it. */}
              <span className="text-sm font-medium leading-7">
                Feature on the blog page
              </span>
            </label>
          </FormField>
        </div>

        <FormField label="Cover image" error={errors.image?.message}>
          {/* Registered but headless — the value is set via the file picker. */}
          <input type="hidden" {...register("image")} />
          <PostCoverImageField
            image={image}
            hasError={Boolean(errors.image)}
            onFileChange={handleCoverChange}
          />
        </FormField>

        <FormField
          label={
            <>
              Excerpt{" "}
              <span className="text-foreground/30 normal-case tracking-normal">
                (optional)
              </span>
            </>
          }
        >
          <TextArea
            rows={3}
            {...register("excerpt")}
            placeholder="A short summary shown in the blog list."
          />
        </FormField>

        <FormField label="Content" error={errors.content?.message}>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                invalid={Boolean(errors.content)}
                placeholder="Write your article..."
              />
            )}
          />
        </FormField>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-xl shadow-gold/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuSave size={18} />
            {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Create Post"}
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

export default PostEditorForm;
