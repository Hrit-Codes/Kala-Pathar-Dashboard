"use client"
import PackageForm from "@/src/components/package/PackageForm";
import { PageLoader } from "@/src/components/ui/PageLoader";
import { getPackageById, type IPackage } from "@/src/lib/api/package";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export default function EditPackagePage(){
    const queryClient=useQueryClient();
    const params=useParams();
    const router=useRouter();
    const id= params.id as string;

    const {data, isLoading, isError}=useQuery({
        queryKey:["package",id],
        queryFn:()=>getPackageById(id),
        enabled:!!id,
        staleTime:5*60*1000,
    })

    if(isLoading){
        return <PageLoader/>
    }

    if(isError || !data?.data){
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-red-500">Failed to load package</p>
                <button onClick={() => router.push("/dashboard/packages")} className="btn-primary">
                    Back to Packages
                </button>
            </div>
        );
    }

    const onSuccessHandler=()=>{
        queryClient.invalidateQueries({queryKey:["package",id]});
        router.push("/dashboard/packages");
    }

    return(
        <div className="w-full min-h-screen flex flex-col gap-6">
            <PackageForm
                mode="edit"
                initialData={data.data as IPackage} 
                packageId={id}
                onSuccess={()=>onSuccessHandler}
            />
        </div>
    )
}