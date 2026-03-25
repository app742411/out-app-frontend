import React, { useState, useEffect, useRef } from "react";
import Button from "../../components/ui/button/Button";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import IconPicker from "../../components/common/IconPicker";
import * as Icons from "lucide-react";
import { addAmenities, updateAmenities } from "../../api/authApi";

const Add_Amenities = ({ onAmenitiesAdded, editData, onCancel }) => {
  const [amenities, setAmenities] = useState([{ name: "", icon: "" }]);
  const [openPickerIndex, setOpenPickerIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (editData) {
      setAmenities([{ name: editData.name || "", icon: editData.icon || "" }]);
    } else {
      setAmenities([{ name: "", icon: "" }]);
    }
  }, [editData]);

  const lastInputRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target)
      ) {
        setOpenPickerIndex(null); // close popup
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addAmenity = () => {
    setAmenities((prev) => [...prev, { name: "", icon: "" }]);
  };

  const removeAmenity = (index) => {
    const list = [...amenities];
    list.splice(index, 1);
    setAmenities(list);
  };

  const updateName = (index, value) => {
    setAmenities((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, name: value } : item
      )
    );
  };

  const updateIcon = (index, iconName) => {
    setAmenities((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, icon: iconName } : item
      )
    );
    setOpenPickerIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filtered = amenities.filter((a) => a.name.trim() !== "");

    if (filtered.length === 0) {
      toast.error("Please add at least one amenity");
      return;
    }

    try {
      setLoading(true);
      if (editData) {
        // Update single amenity
        await updateAmenities(editData._id, { name: filtered[0].name, icon: filtered[0].icon });
        toast.success("Amenity updated successfully");
      } else {
        // Call API for bulk add
        await addAmenities(filtered);
        toast.success("Amenities added successfully");
      }

      onAmenitiesAdded?.();

      if (!editData) {
        setAmenities([{ name: "", icon: "" }]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save amenities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
        {editData ? "Update Amenity" : "Add Amenities"}
      </h4>

      <div className="space-y-4">
        {amenities.map((item, index) => {
          const SelectedIcon =
            item.icon && Icons[item.icon] ? Icons[item.icon] : null;

          return (
            <div
              key={index}
              className="relative flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Name */}
              <input
                type="text"
                placeholder="Amenity Name"
                value={item.name}
                onChange={(e) => updateName(index, e.target.value)}
                className="flex-grow rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-900"
              />

              {/* Selected Icon Preview */}
              <div className="w-10 h-10 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                {SelectedIcon ? (
                  <SelectedIcon size={20} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <span className="text-xs text-gray-500">None</span>
                )}
              </div>

              {/* Choose Icon Button */}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setOpenPickerIndex(
                    openPickerIndex === index ? null : index
                  )
                }
              >
                Choose Icon
              </Button>

              {/* Delete Row */}
              {amenities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAmenity(index)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  <X size={16} />
                </button>
              )}

              {/* Icon Picker Popup */}
              {openPickerIndex === index && (
                <div
                  ref={pickerRef}
                  className="absolute top-12 left-0 z-50"
                >
                  <IconPicker
                    onSelect={(iconName) => updateIcon(index, iconName)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!editData && (
        <Button type="button" variant="secondary" onClick={addAmenity}>
          + Add More
        </Button>
      )}

      <div className="flex items-center justify-end gap-3 mt-2">
        {editData && (
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={loading}>
          {loading ? "Saving..." : editData ? "Update Amenity" : "Save Amenities"}
        </Button>
      </div>
    </form>
  );
};

export default Add_Amenities;
