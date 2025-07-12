// src/components/MentorCard.tsx
import React from 'react';
import { Mentor } from '../types';

interface MentorCardProps {
  mentor: Mentor;
  onRequest: (mentorId: string) => void; // Callback function for the request button
}

const MentorCard = ({ mentor, onRequest }: MentorCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
      <h3 className="text-xl font-bold text-gray-800">{mentor.name}</h3>
      <p className="mt-2 text-gray-600 italic">{mentor.bio || 'No bio provided.'}</p>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700">Skills:</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {mentor.skills.length > 0 ? (
            mentor.skills.map(({ skill }) => (
              <span key={skill.id} className="px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                {skill.name}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No skills listed.</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onRequest(mentor.id)}
        className="w-full mt-6 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none"
      >
        Request Mentorship
      </button>
    </div>
  );
};

export default MentorCard;