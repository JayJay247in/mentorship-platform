// client/src/components/MentorCard.tsx

import { motion } from 'framer-motion';
import React from 'react';
import { Mentor } from '../types';

interface MentorCardProps {
  mentor: Mentor;
  onRequest: (mentorId: string) => void;
  hasRequested: boolean;
  isSubmitting: boolean;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const MentorCard = ({ mentor, onRequest, hasRequested, isSubmitting }: MentorCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col"
    >
      <div className="flex-grow">
        {/* ... User info section remains the same ... */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={mentor.avatarUrl || `https://ui-avatars.com/api/?name=${mentor.name}`}
            alt={mentor.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-xl font-bold text-brand-primary">{mentor.name}</h3>
            {mentor.title && <p className="text-sm text-gray-500">{mentor.title}</p>}
          </div>
        </div>
        <p className="text-brand-text-light text-sm mb-4">{mentor.bio}</p>

        {/* --- THIS IS THE FIX --- */}
        {/* We explicitly check if mentor.skills is truthy before rendering the section. */}
        {mentor.skills && (
          <div>
            <h4 className="font-semibold text-brand-text text-sm">Skills:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {/* By using a fallback to an empty array, we guarantee .map always runs on an array. */}
              {(mentor.skills || []).map(({ skill }) => (
                <span
                  key={skill.id}
                  className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => onRequest(mentor.id)}
          disabled={hasRequested || isSubmitting}
          className="w-full px-4 py-2 font-semibold text-white bg-brand-accent rounded-md hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : hasRequested ? 'Request Sent' : 'Request Mentorship'}
        </button>
      </div>
    </motion.div>
  );
};

export default MentorCard;