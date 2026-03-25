import React, { useRef } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CategoryManageForm from "../../components/Services_Category/CategoryManageForm"
import CategoryList from "../../components/Services_Category/CategoryList"


export default function Categories() {
  const listRef = useRef();

  const refreshCategories = () => {
    listRef.current?.refreshList();
  };

  return (
    <>
      <PageMeta title="Out Category Management" />
      <PageBreadcrumb pageTitle="Category Management" />

      <div className="flex w-full gap-4">
        {/* LEFT: Add Category */}
        <div className="w-1/2 rounded-2xl border border-gray-200 bg-white p-6">
          <CategoryManageForm onCategoryAdded={refreshCategories} />
        </div>

        {/* RIGHT: Category List */}
        <div className="w-1/2">
          <CategoryList ref={listRef} />
        </div>
      </div>
    </>
  );
}
