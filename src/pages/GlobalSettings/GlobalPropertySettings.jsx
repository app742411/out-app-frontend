import React, { useState, useRef } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

// Categories
import CategoryManageForm from "../../components/Services_Category/CategoryManageForm";
import CategoryList from "../../components/Services_Category/CategoryList";

// Amenities
import Add_Amenities from "../../components/Amenities_Components/Add_Amenities";
import List_Amenities from "../../components/Amenities_Components/List_Amenities";

// Property Features
import AddFeature from "../../components/Property_Features/AddFeature";
import FeatureList from "../../components/Property_Features/FeatureList";

// Restroom Amenities
import AddRestroomAmenitiesComp from "../../components/Restroom_Amenities/AddRestroomAmenitiesComp";
import RestroomAmenitiesListComp from "../../components/Restroom_Amenities/RestroomAmenitiesListComp";

import { LayoutGrid, LifeBuoy, Home, Bath } from "lucide-react";

const GlobalPropertySettings = () => {
  const [activeTab, setActiveTab] = useState("categories");

  const categoryListRef = useRef();
  const amenityListRef = useRef();
  const featureListRef = useRef();
  const restroomListRef = useRef();

  // Edit States
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);
  const [editingRestroom, setEditingRestroom] = useState(null);

  const tabs = [
    {
      id: "categories",
      label: "Categories",
      icon: <LayoutGrid className="w-4 h-4" />,
      description: "Service categories & icons",
    },
    {
      id: "amenities",
      label: "Amenities",
      icon: <LifeBuoy className="w-4 h-4" />,
      description: "Available property amenities",
    },
    {
      id: "property-features",
      label: "Features",
      icon: <Home className="w-4 h-4" />,
      description: "Key property characteristics",
    },
    {
      id: "restroom-amenities",
      label: "Restroom",
      icon: <Bath className="w-4 h-4" />,
      description: "Restroom facilities setup",
    },
  ];

  const refreshList = (type) => {
    switch (type) {
      case "categories": categoryListRef.current?.refreshList(); break;
      case "amenities": amenityListRef.current?.refreshList(); break;
      case "property-features": featureListRef.current?.refreshList(); break;
      case "restroom-amenities": restroomListRef.current?.refreshList(); break;
      default: break;
    }
  };

  return (
    <>
      <PageMeta title="Property Setup - Out" />
      <PageBreadcrumb pageTitle="Property Setup" />

      <div className="space-y-6">
        {/* TABS HEADER */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 text-center ${activeTab === tab.id
                  ? "bg-brand-500/5 border-brand-500/20 shadow-sm shadow-brand-500/10 translate-y-[-2px]"
                  : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-brand-500/20 hover:bg-brand-500/[0.02]"
                }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === tab.id
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 scale-110"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}
              >
                {tab.icon}
              </div>
              <div className="mt-3">
                <h3
                  className={`text-sm font-bold transition-colors ${activeTab === tab.id
                      ? "text-brand-500"
                      : "text-gray-900 dark:text-white"
                    }`}
                >
                  {tab.label}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="p-1 min-h-[500px]">
          {activeTab === "categories" && (
            <div className="flex flex-col xl:flex-row gap-6 animate-fadeIn">
              <div className="w-full xl:w-1/3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm h-fit">
                <CategoryManageForm 
                  editData={editingCategory}
                  onCancel={() => setEditingCategory(null)}
                  onCategoryAdded={() => {
                    setEditingCategory(null);
                    refreshList("categories");
                  }} 
                />
              </div>
              <div className="w-full xl:w-2/3">
                <CategoryList 
                  ref={categoryListRef} 
                  onEdit={(cat) => {
                    setEditingCategory(cat);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "amenities" && (
            <div className="flex flex-col xl:flex-row gap-6 animate-fadeIn">
              <div className="w-full xl:w-1/3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm h-fit">
                <Add_Amenities 
                  editData={editingAmenity}
                  onCancel={() => setEditingAmenity(null)}
                  onAmenitiesAdded={() => {
                    setEditingAmenity(null);
                    refreshList("amenities");
                  }} 
                />
              </div>
              <div className="w-full xl:w-2/3">
                <List_Amenities 
                  ref={amenityListRef} 
                  onEdit={(item) => {
                    setEditingAmenity(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "property-features" && (
            <div className="flex flex-col xl:flex-row gap-6 animate-fadeIn">
              <div className="w-full xl:w-1/3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm h-fit">
                <AddFeature 
                  editData={editingFeature}
                  onCancel={() => setEditingFeature(null)}
                  onFeatureAdded={() => {
                    setEditingFeature(null);
                    refreshList("property-features");
                  }} 
                />
              </div>
              <div className="w-full xl:w-2/3">
                <FeatureList 
                  ref={featureListRef} 
                  onEdit={(item) => {
                    setEditingFeature(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "restroom-amenities" && (
            <div className="flex flex-col xl:flex-row gap-6 animate-fadeIn">
              <div className="w-full xl:w-1/3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm h-fit">
                <AddRestroomAmenitiesComp 
                  editData={editingRestroom}
                  onCancel={() => setEditingRestroom(null)}
                  onAmenitiesAdded={() => {
                    setEditingRestroom(null);
                    refreshList("restroom-amenities");
                  }} 
                />
              </div>
              <div className="w-full xl:w-2/3">
                <RestroomAmenitiesListComp 
                  ref={restroomListRef} 
                  onEdit={(item) => {
                    setEditingRestroom(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GlobalPropertySettings;
