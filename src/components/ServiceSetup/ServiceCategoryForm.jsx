import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import DropzoneComponent from "../form/form-elements/DropZone";
import { createServiceCategory, updateServiceCategory } from "../../api/authApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const ServiceCategoryForm = ({ onCategoryAdded, editData, onCancel }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setImage(null);
      setImagePreview(editData.icon ? `${baseURL}/uploads/serviceIcon/${editData.icon}` : null);
    } else {
      setName("");
      setImage(null);
      setImagePreview(null);
    }
  }, [editData, baseURL]);

  const handleImageUpload = (files) => {
    if (!files?.length) return;
    const file = files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("Category name is required");
    if (!editData && !image) return toast.error("Service icon is required");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("serviceIcon", image);
      }

      if (editData) {
        await updateServiceCategory(editData._id, formData);
        toast.success("Service category updated successfully");
      } else {
        await createServiceCategory(formData);
        toast.success("Service category added successfully");
      }

      onCategoryAdded?.();

      if (!editData) {
        setName("");
        setImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="relative w-full">
        <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {editData ? "Update Service Category" : "Add Service Category"}
        </h4>

        <div className="grid grid-cols-1 gap-5 mb-6">
          {/* Category Name */}
          <div>
            <Label>Category Name</Label>
            <Input
              name="name"
              value={name}
              placeholder="Enter service name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Service Icon Upload */}
          <div>
            <Label>Service Icon</Label>
            <div className="mt-2">
              <DropzoneComponent
                type="image"
                multiple={false}
                maxFiles={1}
                onChange={handleImageUpload}
              />
            </div>

            {/* Preview */}
            {imagePreview && (
              <div className="relative w-28 h-28 mt-4 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm group">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-red-500/90 text-white w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors backdrop-blur-sm"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            {editData && (
              <Button type="button" size="sm" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm" disabled={loading} className="px-8 shadow-lg shadow-brand-500/20">
              {loading ? "Saving..." : editData ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceCategoryForm;
