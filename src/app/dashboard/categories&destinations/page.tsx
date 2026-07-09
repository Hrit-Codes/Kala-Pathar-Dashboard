import CategoriesAndDestinationsManagementClient from "@/src/components/categories-and-destinations/Categories&DestinationsManagementClient";
import PageHeader from "@/src/components/layout/PageHeader";
import { getDestinations, type IDestinationsResponse } from "@/src/lib/api/destinations";
import { getPackageTypes, type IPackageTypesResponse } from "@/src/lib/api/package-types";

export default async function CategoriesAndDestinationsPage(){

    const packageTypes = await getPackageTypes();
    const destinations = await getDestinations();

    return(
        <div className="w-full min-h-screen flex flex-col gap-6">
            <PageHeader 
                heading="Categories & Destinations"
                subheading="Manage the architectural hierarchy of your Himalayan travel offerings."
            />

            <CategoriesAndDestinationsManagementClient
                initialPackageTypes={packageTypes as IPackageTypesResponse}
                initialDestinations={destinations as IDestinationsResponse}
            />
        </div>
    )
}