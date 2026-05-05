import { TimeSlot } from './types';

export const BASE_SLOTS: Array<Pick<TimeSlot, 'id' | 'startTime' | 'endTime'>> = [
    { id: 'slot-1',  startTime: '09:00', endTime: '10:00' },
    { id: 'slot-2',  startTime: '10:00', endTime: '11:00' },
    { id: 'slot-3',  startTime: '11:00', endTime: '12:00' },
    { id: 'slot-4',  startTime: '12:00', endTime: '13:00' },
    { id: 'slot-5',  startTime: '13:00', endTime: '14:00' },
    { id: 'slot-6',  startTime: '14:00', endTime: '15:00' },
    { id: 'slot-7',  startTime: '15:00', endTime: '16:00' },
    { id: 'slot-8',  startTime: '16:00', endTime: '17:00' },
    { id: 'slot-9',  startTime: '17:00', endTime: '18:00' },
    { id: 'slot-10', startTime: '18:00', endTime: '19:00' },
    { id: 'slot-11', startTime: '19:00', endTime: '20:00' },
    { id: 'slot-12', startTime: '20:00', endTime: '21:00' },
];

// Peak hours: 12pm–4pm (slots starting at 12:00, 13:00, 14:00, 15:00)
export function isPeakHour(startTime: string): boolean {
    const hour = parseInt(startTime, 10);
    return hour >= 12 && hour < 16;
}
