import Sidebar from "@/src/components/layout/Sidebar";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}:{
    children:React.ReactNode
}){
    const cookieStore= await cookies();
    const token= cookieStore.get("access_token")?.value;

    if(!token){
        redirect("/login");
    }

    return(
        <div className="min-h-screen bg-section">
            <Sidebar/>

            <div className="pl-[280px] min-h-screen flex flex-col">
                <main className="flex-1 p-8 ">
                    {children}
                </main>

            </div>
        </div>
    )
}