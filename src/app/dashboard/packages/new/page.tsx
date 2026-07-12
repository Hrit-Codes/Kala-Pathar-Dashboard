"use client";

import PackageForm from "@/src/components/package/PackageForm";

export default function NewPackageForm(){
    return(
        <div className="w-full min-h-screen flex flex-col gap-6 ">
            <PackageForm mode="create" />
        </div>
    )
}