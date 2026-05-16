export type BusyBlock = { start: Date; end: Date };
export async function getFreeBusy(){ return [] as BusyBlock[]; }
export async function createCalendarEvent(){ return { id: `mock-cal-${Date.now()}`, mock: !process.env.GOOGLE_CLIENT_ID }; }
