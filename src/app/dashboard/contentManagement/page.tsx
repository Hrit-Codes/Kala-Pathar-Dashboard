import ContentManagementClient from '@/src/components/content-management/ContentManagementClient';
import { getAboutUs } from '@/src/lib/api/about-us';
import { getWhyPlanWithUs } from '@/src/lib/api/why-plan-with-us';
import type { IAboutUs } from '@/src/types/about-us';
import type { IWhyPlanWithUsItem } from '@/src/types/why-plan-with-us';

export default async function ContentManagementPage() {
    const whyPlanWithUsData = await getWhyPlanWithUs();
    const aboutUsData = await getAboutUs(); 

    return (
        <ContentManagementClient 
            initialWhyPlanWithUs={whyPlanWithUsData.data as IWhyPlanWithUsItem[]} 
            initialAboutUs={aboutUsData.data as IAboutUs}
            // initialAboutUs={aboutUsData.data}
        />
    );
}