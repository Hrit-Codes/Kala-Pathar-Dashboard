import ContentManagementClient from '@/src/components/content-management/ContentManagementClient';
import { getAboutUs } from '@/src/lib/api/about-us';
import { getWhyChooseUs } from '@/src/lib/api/why-choose-us';
import type { IAboutUs } from '@/src/types/about-us';
import type { IWhyChooseUsItem } from '@/src/types/why-choose-us';

export default async function ContentManagementPage() {
    const whyChooseUsData = await getWhyChooseUs();
    const aboutUsData = await getAboutUs(); 

    return (
        <ContentManagementClient 
            initialWhyChooseUs={whyChooseUsData.data as IWhyChooseUsItem[]} 
            initialAboutUs={aboutUsData.data as IAboutUs}
            // initialAboutUs={aboutUsData.data}
        />
    );
}