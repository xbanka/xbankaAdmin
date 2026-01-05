export function getStatusStyles(status: string): string {
  switch (status) {
    case "paid":
      return "bg-[#D1FAE5] text-[#37703F]";
    case "rejected":
      return "bg-[#FCE6E6] text-[#EF4444]";
    default:
      return "bg-[#FFF8D8] text-[#B29504]";
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-[#FCE6E6] text-[#EF4444]";
    case "medium":
      return "bg-[#FFF8D8] text-[#B29504]";
    case "low":
      return "bg-[#D1FAE5] text-[#37703F]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
