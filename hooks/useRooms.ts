'use client';

import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/lib/types';
import { getRooms } from '@/lib/api';

interface UseRoomsResult {
    rooms: Room[];
    loading: boolean;
    error: string;
    refetch: () => void;
}

export function useRooms(): UseRoomsResult {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetch = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getRooms();
            setRooms(data);
        } catch {
            setError('Failed to load conference rooms. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { rooms, loading, error, refetch: fetch };
}
