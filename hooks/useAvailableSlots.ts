'use client';

import { useState, useEffect, useCallback } from 'react';
import { TimeSlot } from '@/lib/types';
import { getAvailableSlots } from '@/lib/api';

interface UseAvailableSlotsResult {
    slots: TimeSlot[];
    loading: boolean;
    slotError: string;
    refetch: () => void;
}

export function useAvailableSlots(
    roomId: string | null,
    date: string,
): UseAvailableSlotsResult {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [slotError, setSlotError] = useState('');

    const fetch = useCallback(async () => {
        if (!roomId || !date) {
            setSlots([]);
            return;
        }
        setLoading(true);
        setSlotError('');
        try {
            const data = await getAvailableSlots(roomId, date);
            setSlots(data);
        } catch {
            setSlotError('Failed to load time slots. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [roomId, date]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { slots, loading, slotError, refetch: fetch };
}
