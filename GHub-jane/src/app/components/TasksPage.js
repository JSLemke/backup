import { useState } from 'react';
import React from 'react';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching tasks:', error.message);
            } else {
                setTasks(data);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div>
            <h1>Tasks Page</h1>
            {/* Ihr Tasks-Komponenten-Code hier */}
        </div>
    );
}
