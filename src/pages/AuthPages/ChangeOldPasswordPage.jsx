import React from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ChangeOldPasswordComp from "../../components/Auth/ChangeOldPasswordComp";

export default function ChangeOldPasswordPage() {
    return (
        <>
            <PageMeta title="Change Password" />
            <PageBreadcrumb pageTitle="Change Password" />
            <div className="flex w-full justify-center">
                <ChangeOldPasswordComp />
            </div>
        </>
    );
}
