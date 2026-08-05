import { create } from "zustand";

export interface SpreadApprovalData {
    requestInformation: {
        submittedBy: string;
        role: string;
        submittedOn: string;
        requestType: string;
    };

    configuration: {
        scope: string;
        target: string;
        assets: number;
        previousConfiguration: string;
        newConfiguration: string;
        effectiveUntil: string;
        status: string;
    };

    affectedAssets: {
        id: string;
        asset: string;
        ticker: string;
        currentValue: number;
        proposedValue: number;
    }[];
}

export interface NotificationPayload {
    id: string;

    type:
        | "spread-approval"
        | "affiliate-payout"
        | "transaction"
        | "general";

    title: string;

    data?: SpreadApprovalData;
}

interface DrawerStore{

    notification?:NotificationPayload;

    open:(payload:NotificationPayload)=>void;

    close:()=>void;
}

export const useNotificationDrawerStore =
create<DrawerStore>((set)=>({

    notification:undefined,

    open:(notification)=>set({notification}),

    close:()=>set({notification:undefined})

}));