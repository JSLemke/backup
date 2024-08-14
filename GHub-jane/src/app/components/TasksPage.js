'use client';

import React, { useState, useEffect } from 'react'; // Importiere useState und useEffect
import supabase from '../../utils/supabaseClient';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);  // Ladezustand hinzufügen

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tasks:', error.message);
        } else {
          setTasks(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching tasks:', error);
      } finally {
        setLoading(false);  // Ladezustand deaktivieren
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <p>Lade Aufgaben...</p>;  // Ladeanzeige
  }

  return (
    <div>
      <h1>Tasks Page</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.content}</li>
        ))}
      </ul>
    </div>
  );
}
