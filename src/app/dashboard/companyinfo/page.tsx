import PageHeader from "@/src/components/layout/PageHeader";
import CompanyInfoForm from "@/src/components/company-info/CompanyInfoForm";
import { getCompanyInfo } from "@/src/lib/api/company-info";

export default async function CompanyInfoPage() {
  const companyInfo = await getCompanyInfo();
  
  return (
    <div className="w-full min-h-screen flex flex-col gap-6">
      <PageHeader 
        heading="Company Profile"
        subheading="Manage public-facing information"
      />
      <CompanyInfoForm initialData={companyInfo}/>
    </div>
  );
}