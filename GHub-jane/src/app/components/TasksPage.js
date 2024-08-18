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
  <div id="myDIV" className="header">
    <h2>My To Do List</h2>
    <input type="text" id="myInput" placeholder="Title..." />
    <span onClick={newElement} className="addBtn">Add</span>
  </div>

  <ul id="myUL">
    <li>Hit the gym</li>
    <li className="checked">Pay bills</li>
    <li>Meet George</li>
    <li>Buy eggs</li>
    <li>Read a book</li>
    <li>Organize office</li>
  </ul>
</div>
  );
}
