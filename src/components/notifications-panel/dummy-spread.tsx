export const dummySpreadApproval = {
    requestInformation: {
        submittedBy: "John Doe",
        role: "Operations Manager",
        submittedOn: "24 Jul 2026 • 09:42 AM",
        requestType: "Spread Creation",
    },

    configuration: {
        scope: "Segment",
        target: "All Segment",
        assets: 8,
        previousConfiguration:
            "Buy: 2.00% • Sell: 1.75%",
        newConfiguration:
            "Buy: 2.50% • Sell: 2.50%",
        effectiveUntil: "Present",
        status: "Active",
    },

    affectedAssets: [
        {
            id: "1",
            asset: "Bitcoin",
            ticker: "BTC",
            currentValue: 2.0,
            proposedValue: 2.5,
        },
        {
            id: "2",
            asset: "USDT",
            ticker: "USDT",
            currentValue: 2.0,
            proposedValue: 2.5,
        },
    ],
};