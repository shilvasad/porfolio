import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './MindMapEditor.scss';

// A simple recursive component to render mind map nodes
const Node = ({ node, onUpdateNode, onAddChild }) => {
  const [text, setText] = useState(node.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateNode(node.id, text);
  };

  return (
    <div className="mindmap-node">
      {isEditing ? (
        <input type="text" value={text} onChange={e => setText(e.target.value)} onBlur={handleBlur} autoFocus />
      ) : (
        <div className="node-text" onClick={() => setIsEditing(true)}>{node.text}</div>
      )}
      <button className="add-child-btn" onClick={() => onAddChild(node.id)}>+</button>
      <div className="mindmap-children">
        {node.children && node.children.map(child => (
          <Node key={child.id} node={child} onUpdateNode={onUpdateNode} onAddChild={onAddChild} />
        ))}
      </div>
    </div>
  );
};

const MindMapEditor = () => {
  const [mindMaps, setMindMaps] = useState([]);
  const [activeMap, setActiveMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMindMaps = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.get('/api/mindmaps', { headers: { Authorization: `Bearer ${token}` } });
      setMindMaps(data);
    } catch (err) {
      setError('Failed to load mind maps.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMindMaps();
  }, [fetchMindMaps]);

  const handleSaveActiveMap = useCallback(async () => {
    if (!activeMap) return;
    try {
        const token = localStorage.getItem('adminToken');
        await axios.put(`/api/mindmaps/${activeMap._id}`, { data: activeMap.data, title: activeMap.title }, { headers: { Authorization: `Bearer ${token}` } });
    } catch(err) {
        setError("Failed to save mind map.");
    }
  }, [activeMap]);

  // A simple recursive function to find and update a node
  const updateNodeRecursive = (nodes, id, newText) => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, text: newText };
      }
      if (node.children) {
        return { ...node, children: updateNodeRecursive(node.children, id, newText) };
      }
      return node;
    });
  };

  // A simple recursive function to find and add a child node
  const addChildRecursive = (nodes, parentId) => {
      return nodes.map(node => {
          if(node.id === parentId) {
              const newNode = { id: Date.now().toString(), text: 'New Node', children: [] };
              return { ...node, children: [...(node.children || []), newNode]};
          }
          if(node.children) {
              return { ...node, children: addChildRecursive(node.children, parentId)};
          }
          return node;
      });
  };

  const handleUpdateNode = (nodeId, newText) => {
      if(!activeMap) return;
      const updatedData = { ...activeMap.data, children: updateNodeRecursive(activeMap.data.children || [], nodeId, newText) };
      if(activeMap.data.id === nodeId) updatedData.text = newText;
      setActiveMap(prev => ({...prev, data: updatedData}));
  };

  const handleAddChild = (parentId) => {
    if(!activeMap) return;
    let updatedData;
    if(activeMap.data.id === parentId) {
        const newNode = { id: Date.now().toString(), text: 'New Node', children: [] };
        updatedData = { ...activeMap.data, children: [...(activeMap.data.children || []), newNode] };
    } else {
        updatedData = { ...activeMap.data, children: addChildRecursive(activeMap.data.children || [], parentId) };
    }
    setActiveMap(prev => ({...prev, data: updatedData}));
  };

  if (loading) return <p>Loading mind maps...</p>;

  return (
    <div className="mindmap-editor-container">
      <div className="mindmap-sidebar">
        <h3>My Mind Maps</h3>
        <ul>
          {mindMaps.map(map => (
            <li key={map._id} onClick={() => setActiveMap(map)} className={activeMap?._id === map._id ? 'active' : ''}>
              {map.title}
            </li>
          ))}
        </ul>
        {/* Add new map button would go here */}
      </div>
      <div className="mindmap-main">
        {activeMap ? (
            <>
                <div className="mindmap-header">
                    <h3>Editing: {activeMap.title}</h3>
                    <button onClick={handleSaveActiveMap}>Save Map</button>
                </div>
                <div className="mindmap-canvas">
                    <Node node={activeMap.data} onUpdateNode={handleUpdateNode} onAddChild={handleAddChild} />
                </div>
            </>
        ) : (
            <p>Select a mind map to start editing, or create a new one.</p>
        )}
      </div>
    </div>
  );
};

export default MindMapEditor;
