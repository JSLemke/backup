// src/app/components/MiniMap.js

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function MiniMap() {
    const router = useRouter();

    return (
        <div
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer"
            onClick={() => router.push('/gps')}
        >
            <h2 className="text-xl font-bold mb-2">Minikarte</h2>
            <div className="h-32 bg-gray-200">[Minimap Placeholder]</div>
        </div>
    );
}
