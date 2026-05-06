import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import DropzoneComponent from "../form/form-elements/DropZone";
import { addCategory, updateCategory } from "../../api/authApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";


const CategoryManageForm = ({ onCategoryAdded, editData, onCancel }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (editData) {
      setName(editData.category || "");
      setImage(null);
      setImagePreview(editData.image ? `${baseURL}/uploads/categories/${editData.image}` : null);
    } else {
      setName("");
      setImage(null);
      setImagePreview(null);
    }
  }, [editData]);

  // 👉 Handle Image Upload
  const handleImageUpload = (files) => {
    if (!files?.length) return;

    const file = files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // preview URL
  };

  // 👉 Remove Image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("Category name is required");
    if (!editData && !image) return toast.error("Category image is required");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("categoryName", name);
      if (image) {
        formData.append("image", image);
      }

      if (editData) {
        await updateCategory(editData._id, formData);
        toast.success("Category updated successfully");
      } else {
        await addCategory(formData);
        toast.success("Category added successfully");
      }

      onCategoryAdded?.();

      if (!editData) {
        setName("");
        setImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full dark:bg-gray-900"
    >
      <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
        {editData ? "Update Category" : "Add New Category"}
      </h4>

      <div className="grid grid-cols-1 gap-5 mb-6">

        {/* Category Name */}
        <div>
          <Label>Category Name</Label>
          <Input
            name="title"
            value={name}
            placeholder="Enter category name"
            onChange={(e) => setName(e.target.value.toUpperCase())}
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label>Category Image</Label>

          <DropzoneComponent
            type="image"
            multiple={false}
            maxFiles={1}
            onChange={handleImageUpload}
          />

          {/* Preview */}
          {imagePreview && (
            <div className="relative w-28 h-28 mt-4 border rounded-lg shadow-sm">
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-2">
          {editData && (
            <Button type="button" size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Saving..." : editData ? "Update Category" : "Save Category"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CategoryManageForm;
