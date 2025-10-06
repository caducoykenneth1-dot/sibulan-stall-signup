export type StallStatus = "current" | "due" | "overdue" | "vacant";

export type StallRecord = {
  id: string;      // "stall-5" for display
  dbId: number;    // 5 → Supabase primary key
  name: string;
  vendor: string;
  contact: string;
  type: string;
  monthlyRent: number;
  lastPayment: string;
  nextDue: string;
  status: StallStatus;
  occupied: boolean;
};


export const BASE_TYPE_OPTIONS: string[] = [
"Vegetables",
  "Fish",
  "Meat",
  "Rice",
  "Grocery",
  "Clothing",
  "Others",
];

export const createInitialStalls = (): StallRecord[] => [];

export const formatStallDisplay = (stall: StallRecord): string => {
  const vendor = stall.vendor ? ` - ${stall.vendor}` : "";
  return `${stall.name}${vendor}`;
};

export const getNextStallNumbers = (stalls: StallRecord[], type?: string) => {
  const nextIdNumber = 
    stalls.reduce((highest, stall) => {
      const match = /stall-(\d+)/.exec(stall.id);
      if (!match) {
        return highest;
      }
      return Math.max(highest, Number(match[1]));
    }, 0) + 1;

  const normalizedType = type?.trim().toLowerCase() ?? null;

  const nextNameNumber = 
    stalls.reduce((highest, stall) => {
      if (normalizedType !== null) {
        const stallTypeNormalized = stall.type.trim().toLowerCase();
        if (stallTypeNormalized !== normalizedType) {
          return highest;
        }
      }
      const match = /Stall\s+(\d+)/i.exec(stall.name);
      if (!match) {
        return highest;
      }
      return Math.max(highest, Number(match[1]));
    }, 0) + 1;

  return { nextIdNumber, nextNameNumber };
};
