import React, { useState } from 'react';

const SkillEditor = ({ skills = [], onSave }) => {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [skillList, setSkillList] = useState(skills);

  const handleAdd = () => {
    if (input.trim() && !skillList.includes(input.trim())) {
      setSkillList([...skillList, input.trim()]);
      setInput('');
    }
  };

  const handleRemove = (skill) => {
    setSkillList(skillList.filter(s => s !== skill));
  };

  const handleSave = () => {
    setEditing(false);
    onSave(skillList);
  };

  return (
    <div className="my-2">
      {editing ? (
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {skillList.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
                {skill}
                <button onClick={() => handleRemove(skill)} className="ml-1 text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border px-2 py-1 rounded mr-2"
            placeholder="Add a skill"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Add</button>
          <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skillList.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{skill}</span>
          ))}
          <button onClick={() => setEditing(true)} className="ml-2 bg-gray-200 px-2 py-1 rounded text-xs">Edit</button>
        </div>
      )}
    </div>
  );
};

export default SkillEditor;
