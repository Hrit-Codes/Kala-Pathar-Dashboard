import CategoriesAndDestinationsManagementClient from "@/src/components/categories-and-destinations/Categories&DestinationsManagementClient";
import PageHeader from "@/src/components/layout/PageHeader";
import { getPackageTypes, type IPackageTypesResponse } from "@/src/lib/api/categories";

export default async function CategoriesAndDestinationsPage(){

    const packageTypes = await getPackageTypes();

    return(
        <div className="w-full min-h-screen flex flex-col gap-6">
            <PageHeader 
                heading="Categories & Destinations"
                subheading="Manage the architectural hierarchy of your Himalayan travel offerings."
            />

            <CategoriesAndDestinationsManagementClient
                initialPackageTypes={packageTypes as IPackageTypesResponse}
            />
        </div>
    )
}