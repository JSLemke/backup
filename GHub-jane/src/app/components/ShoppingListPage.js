'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';

export default function ShoppingListPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const fetchItems = async () => {
    console.log('Fetching items...');
    const { data, error } = await supabase
      .from('shoppinglist')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching shopping list:', error.message);
    } else {
      console.log('Items fetched:', data);
      setItems(data);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (newItem.trim()) {
      const { data, error } = await supabase
        .from('shoppinglist')
        .insert([{ item_name: newItem }]);

      if (error) {
        console.error('Error adding item:', error.message);
      } else {
        setNewItem('');
        await fetchItems();
      }
    } else {
      console.log('New item is empty, not adding.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Einkaufsliste</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Neuer Artikel"
        />
        <button onClick={addItem} className="bg-blue-500 text-white p-2 rounded mt-2">
          Artikel hinzufügen
        </button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="flex justify-between mb-2">
            <span>{item.item_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
