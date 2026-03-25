import React, { useRef } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Add_Amenities from "../../components/Amenities_Components/Add_Amenities";
import List_Amenities from "../../components/Amenities_Components/List_Amenities";

export default function Amenities() {
  const listRef = useRef();

  const refreshAmenities = () => {
    listRef.current?.refreshList();
  };

  return (
    <>
      <PageMeta title="Amenties - Out" />
      <PageBreadcrumb pageTitle="Amanities management" />

      <div className="flex w-full gap-4">

        {/* LEFT: Add Amenities */}
        <div className="w-1/2 rounded-2xl border border-gray-200 bg-white p-5">
          <Add_Amenities onAmenitiesAdded={refreshAmenities} />
        </div>

        {/* RIGHT: Amenities List */}
        <div className="w-1/2 rounded-2xl border border-gray-200 bg-white p-5">
          <List_Amenities ref={listRef} />
        </div>

      </div>
    </>
  );
}
