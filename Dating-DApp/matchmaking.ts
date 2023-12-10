import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const addPotentialMatch = async (newUser) => {
    const users = await prisma.profile.findMany();
    users.forEach(async (user) => {
        // Check hard constraints here
        if (user.interestedIn === newUser.gender) {
            // If constraints are met, create a Swipe record
            await prisma.swipe.create({
                data: {
                    profileId: user.id,
                    swipedProfileId: newUser.id,
                    liked: false,
                },
            });
        }
    });
};

export const addAcceptedMatch = async (user1, user2) => {
    // Check if both users like each other
    const user1LikesUser2 = await prisma.swipe.findUnique({
        where: { profileId_swipedProfileId: { profileId: user1.id, swipedProfileId: user2.id } }
    });
    const user2LikesUser1 = await prisma.swipe.findUnique({
        where: { profileId_swipedProfileId: { profileId: user2.id, swipedProfileId: user1.id } }
    });

    if (user1LikesUser2 && user2LikesUser1) {
        // If both users like each other, update the liked field in the Swipe records
        await prisma.swipe.update({
            where: { profileId_swipedProfileId: { profileId: user1.id, swipedProfileId: user2.id } },
            data: { liked: true },
        });
        await prisma.swipe.update({
            where: { profileId_swipedProfileId: { profileId: user2.id, swipedProfileId: user1.id } },
            data: { liked: true },
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
