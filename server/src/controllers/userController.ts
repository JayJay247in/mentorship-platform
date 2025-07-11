// src/controllers/userController.ts
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware'; // We'll use our custom request type

const prisma = new PrismaClient();

/**
 * @desc    Get all users with the MENTOR role
 * @route   GET /api/users/mentors
 * @access  Public
 */
export const getMentors = async (req: AuthRequest, res: Response) => {
    try {
        const mentors = await prisma.user.findMany({
            where: {
                role: 'MENTOR',
            },
            select: { // Explicitly select which fields to return for security
                id: true,
                name: true,
                bio: true,
                skills: {
                    select: {
                        skill: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        });
        res.json(mentors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching mentors' });
    }
};

/**
 * @desc    Get a user profile by ID
 * @route   GET /api/users/:id
 * @access  Private (must be logged in)
 */
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { // Select only public-facing information
                id: true,
                name: true,
                bio: true,
                role: true,
                skills: {
                    select: {
                        skill: { select: { id: true, name: true } }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Update the current user's profile
 * @route   PUT /api/users/me/profile
 * @access  Private
 */
export const updateCurrentUserProfile = async (req: AuthRequest, res: Response) => {
    const { name, bio, skills } = req.body; // Skills will be an array of skill IDs, e.g., ["cuid1", "cuid2"]

    // The user's ID is available from the 'protect' middleware
    const userId = req.user!.userId;

    try {
        // We use a transaction to ensure that updating skills is an all-or-nothing operation
        const updatedUser = await prisma.$transaction(async (tx) => {
            // 1. Update the basic user info (name, bio)
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    name,
                    bio,
                },
            });

            // 2. Handle skills update if skills are provided
            if (skills && Array.isArray(skills)) {
                // First, remove all existing skills for this user
                await tx.userSkill.deleteMany({
                    where: { userId: userId },
                });

                // Then, add the new skills
                await tx.userSkill.createMany({
                    data: skills.map((skillId: string) => ({
                        userId: userId,
                        skillId: skillId,
                    })),
                    skipDuplicates: true, // Ignore if a duplicate is somehow sent
                });
            }

            return user;
        });

        // Fetch the fully updated user profile to return to the client
        const finalUserProfile = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                role: true,
                skills: { select: { skill: { select: { id: true, name: true } } } }
            }
        });

        res.json(finalUserProfile);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};