import React, { useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ServiceCategoryForm from "../../components/ServiceSetup/ServiceCategoryForm";
import ServiceCategoryList from "../../components/ServiceSetup/ServiceCategoryList";

export default function ServiceSetup() {
  const listRef = useRef();
  const [editData, setEditData] = useState(null);

  const refreshList = () => {
    listRef.current?.refreshList();
    setEditData(null);
  };

  const handleEdit = (category) => {
    setEditData(category);
    // Scroll to top of form when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  return (
    <>
      <PageMeta title="Service Setup | Out Admin" />
      <PageBreadcrumb pageTitle="Service Setup" />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT/TOP: Category Form */}
        <div className="xl:col-span-5 order-1">
          <ServiceCategoryForm 
            onCategoryAdded={refreshList} 
            editData={editData} 
            onCancel={handleCancelEdit}
          />
        </div>

        {/* RIGHT/BOTTOM: Category List */}
        <div className="xl:col-span-7 order-2">
          <ServiceCategoryList 
            ref={listRef} 
            onEdit={handleEdit}
          />
        </div>
      </div>
    </>
  );
}
