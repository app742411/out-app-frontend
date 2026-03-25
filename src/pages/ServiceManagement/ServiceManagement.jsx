import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ServiceList from "../../components/ServiceManagement/ServiceList";

const ServiceManagement = () => {
  return (
    <>
      <PageMeta title="Service Management | Out Admin" />
      <PageBreadcrumb pageTitle="Service Management" />
      <div className="space-y-6">
        <ServiceList />
      </div>
    </>
  );
};

export default ServiceManagement;
