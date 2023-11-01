import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './Board.css';

function Board() {
  const [data, setData] = useState([]);
  const [groupOption, setGroupOption] = useState(localStorage.getItem('groupOption') || 'status');
  const [sortOption, setSortOption] = useState(localStorage.getItem('sortOption') || 'priority');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('https://api.quicksell.co/v1/internal/frontend-assignment');
      setData(result.data.tickets);
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('groupOption', groupOption);
    localStorage.setItem('sortOption', sortOption);
  }, [groupOption, sortOption]);

  const groupData = (data, option) => {
    return data.reduce((grouped, item) => {
      const key = item[option];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
      return grouped;
    }, {});
  };

  const sortData = (data, option) => {
    return [...data].sort((a, b) => {
      if (option === 'priority') {
        return b.priority - a.priority;
      }
      return a.title.localeCompare(b.title);
    });
  };

  const groupedData = groupData(data, groupOption);

  return (
    <div className="board">
      <div className="group-selectors">
        <label>Group by:</label>
        <select value={groupOption} onChange={e => setGroupOption(e.target.value)}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      <div className="sort-selectors">
        <label>Sort by:</label>
        <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className="ticket-groups">
        {Object.entries(groupedData).map(([group, items]) => (
          <div key={group} className="ticket-group">
            <h2 className="group-header">{group}</h2>
            {sortData(items, sortOption).map(item => (
              <div key={item.id} className="ticket">
                <h3 className="ticket-title">{item.title}</h3>
                <p className="ticket-description">{item.description}</p>
                <span className="ticket-priority">{item.priority}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
