import ContentManagementClient from '@/src/components/content-management/ContentManagementClient';
import { getWhyChooseUs } from "@/src/lib/why-choose-us";
import type { IWhyChooseUsItem } from '@/src/types/why-choose-us';

export default async function ContentManagementPage() {
    const whyChooseUsData = await getWhyChooseUs();
    // const aboutUsData = await getAboutUs(); 

    return (
        <ContentManagementClient 
            initialWhyChooseUs={whyChooseUsData.data as IWhyChooseUsItem[]} 
            // initialAboutUs={aboutUsData.data}
        />
    );
}