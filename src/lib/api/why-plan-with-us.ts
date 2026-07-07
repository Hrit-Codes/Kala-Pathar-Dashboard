import type { IWhyChooseUsResponse, IWhyPlanWithUsItem, WhyPlanWithUsFormValues } from "@/src/types/why-plan-with-us";
import { api } from "./api";
import { fetchOrNull } from "../utils/helper";

export const getWhyPlanWithUs = async (): Promise<IWhyChooseUsResponse> => {
    const result = await fetchOrNull(async () => {
        const { data } = await api.get("/whyChooseUs/getAll");
        return data;
    });
    return result ?? { success: true, message: "No items found", data: [] };
};

export const updateWhyPlanWithUs = async (id: string, data: WhyPlanWithUsFormValues) => {
    const { data: res } = await api.put(`/whychooseus/update/${id}`, data);
    return res;
};

export const createWhyPlanWithUs = async (data: WhyPlanWithUsFormValues) => {
    const { data: res } = await api.post("/whychooseus/create", data);
    return res;
};