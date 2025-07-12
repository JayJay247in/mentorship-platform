// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

// A sample list of mentors that our mock API will return
const mockMentors = [
  {
    id: 'mentor-1',
    name: 'Jane Doe',
    bio: 'Experienced product manager with 10+ years in tech.',
    skills: [{ skill: { id: 'skill-1', name: 'Product Management' } }],
  },
  {
    id: 'mentor-2',
    name: 'John Smith',
    bio: 'Lead frontend developer specializing in React and TypeScript.',
    skills: [
      { skill: { id: 'skill-2', name: 'React' } },
      { skill: { id: 'skill-3', name: 'TypeScript' } },
    ],
  },
];

export const handlers = [
  // Mock for GET /api/users/mentors
  http.get('http://localhost:5000/api/users/mentors', () => {
    // Use HttpResponse.json() to return a JSON response
    return HttpResponse.json(mockMentors);
  }),
  
  // Mock for POST /api/requests
  http.post('http://localhost:5000/api/requests', () => {
    // We can just return a success status for this test
    return new HttpResponse(null, { status: 201 });
  }),
];