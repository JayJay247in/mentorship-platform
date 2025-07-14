// src/components/MentorCard.tsx
import { motion } from 'framer-motion';
import React from 'react';

import { Mentor } from '../types';

interface MentorCardProps {
  mentor: Mentor;
  onRequest: (mentorId: string) => void;
  hasRequested: boolean;
  isSubmitting: boolean;
}

const MentorCard = ({
  mentor,
  onRequest,
  hasRequested,
  isSubmitting,
}: MentorCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl border border-gray-200 flex flex-col">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-brand-primary">{mentor.name}</h3>
        <p className="mt-2 text-brand-text-light italic text-sm">
          {mentor.bio || 'No bio provided.'}
        </p>
        <div className="mt-4">
          <h4 className="font-semibold text-brand-text">Skills:</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {mentor.skills.length > 0 ? (
              mentor.skills.map(({ skill }) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 text-xs font-semibold text-brand-accent bg-brand-accent bg-opacity-10 rounded-full"
                >
                  {skill.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-brand-text-light">No skills listed.</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <motion.button
          onClick={() => onRequest(mentor.id)}
          disabled={hasRequested || isSubmitting}
          className="w-full px-4 py-2 font-semibold text-white rounded-md focus:outline-none transition-colors duration-200
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     bg-brand-accent hover:opacity-90"  whileTap={{ scale: 0.95 }}
        >
          {isSubmitting
            ? 'Sending...'
            : hasRequested
              ? 'Request Sent'
              : 'Request Mentorship'}
        </motion.button>
      </div>
    </div>
  );
};

export default MentorCard;