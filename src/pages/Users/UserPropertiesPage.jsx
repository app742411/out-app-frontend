import React from "react";
import { useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UserPropertiesList from "../../components/Users/UserPropertiesList";
import Button from "../../components/ui/button/Button";

export default function UserPropertiesPage() {
    const { id } = useParams();

    return (
        <>
            <PageMeta title="User Properties" />
            <div className="flex items-center justify-between mb-6">
                <PageBreadcrumb pageTitle="User Properties" />
                <Link to="/vendors">
                    <Button variant="outline" className="text-gray-600 dark:text-gray-300">
                        Back to Vendors
                    </Button>
                </Link>
            </div>

            <div className="w-full">
                <UserPropertiesList userId={id} />
            </div>
        </>
    );
}
