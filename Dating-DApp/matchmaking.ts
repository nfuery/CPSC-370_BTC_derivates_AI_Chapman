import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const addPotentialMatch = async (newUser) => {
    const users = await prisma.profile.findMany();
    users.forEach(async (user) => {
        // Check hard constraints here
        // If constraints are met, add newUser to user's potentialMatches
        await prisma.profile.update({
            where: { id: user.id },
            data: { potentialMatches: { connect: { id: newUser.id } } },
        });
    });
};

export const addAcceptedMatch = async (user1, user2) => {
    // Check if both users like each other
    const user1LikesUser2 = user1.potentialMatches.includes(user2.id);
    const user2LikesUser1 = user2.potentialMatches.includes(user1.id);

    if (user1LikesUser2 && user2LikesUser1) {
        // If both users like each other, add them to each other's acceptedMatches
        await prisma.profile.update({
            where: { id: user1.id },
            data: { acceptedMatches: { connect: { id: user2.id } } },
        });
        await prisma.profile.update({
            where: { id: user2.id },
            data: { acceptedMatches: { connect: { id: user1.id } } },
        });
    }
};

export const load = (async ({
    locals: {
        session: { user_id }
    }
}) => {
    const feed = await prisma.profile.findMany({
        // add filters on city, interested in, etc.
        // exclude people already swiped on
        where: {
            NOT: {
                swipedBy: {
                    some: { profileId: user_id }
                }
            },
            id: {
                not: user_id
            }
        }
    });

    return { feed };
}) satisfies PageServerLoad;
