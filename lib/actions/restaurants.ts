// lib/actions/restaurants.ts

import { RestaurantWithDetails } from '../../types/restaurants';
import { prisma } from '../prisma';
import { cache } from 'react';

/**
 * Get all active and published restaurants with their images and business unit details
 */
export const getPublishedRestaurants = cache(async (): Promise<RestaurantWithDetails[]> => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        isPublished: true,
      },
      include: {
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        images: {
          where: {
            image: {
              isActive: true,
            },
          },
          include: {
            image: {
              select: {
                id: true,
                originalUrl: true,
                thumbnailUrl: true,
                mediumUrl: true,
                largeUrl: true,
                title: true,
                description: true,
                altText: true,
              },
            },
          },
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
});

/**
 * Get featured restaurants only
 */
export const getFeaturedRestaurants = cache(async (): Promise<RestaurantWithDetails[]> => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        isPublished: true,
        isFeatured: true,
      },
      include: {
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        images: {
          where: {
            image: {
              isActive: true,
            },
          },
          include: {
            image: {
              select: {
                id: true,
                originalUrl: true,
                thumbnailUrl: true,
                mediumUrl: true,
                largeUrl: true,
                title: true,
                description: true,
                altText: true,
              },
            },
          },
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return restaurants;
  } catch (error) {
    console.error('Error fetching featured restaurants:', error);
    return [];
  }
});

/**
 * Get restaurants by business unit
 */
export const getRestaurantsByBusinessUnit = cache(async (businessUnitId: string): Promise<RestaurantWithDetails[]> => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        businessUnitId,
        isActive: true,
        isPublished: true,
      },
      include: {
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        images: {
          where: {
            image: {
              isActive: true,
            },
          },
          include: {
            image: {
              select: {
                id: true,
                originalUrl: true,
                thumbnailUrl: true,
                mediumUrl: true,
                largeUrl: true,
                title: true,
                description: true,
                altText: true,
              },
            },
          },
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants by business unit:', error);
    return [];
  }
});

/**
 * Get a single restaurant by slug with detailed information
 */
export const getRestaurantBySlug = cache(async (slug: string): Promise<RestaurantWithDetails | null> => {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        slug,
        isActive: true,
        isPublished: true,
      },
      include: {
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        images: {
          where: {
            image: {
              isActive: true,
            },
          },
          include: {
            image: {
              select: {
                id: true,
                originalUrl: true,
                thumbnailUrl: true,
                mediumUrl: true,
                largeUrl: true,
                title: true,
                description: true,
                altText: true,
              },
            },
          },
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
        menuCategories: {
          where: {
            isActive: true,
          },
          include: {
            items: {
              where: {
                isAvailable: true,
              },
              include: {
                images: {
                  include: {
                    image: {
                      select: {
                        id: true,
                        originalUrl: true,
                        thumbnailUrl: true,
                        mediumUrl: true,
                        largeUrl: true,
                        title: true,
                        description: true,
                        altText: true,
                      },
                    },
                  },
                  orderBy: [
                    { isPrimary: 'desc' },
                    { sortOrder: 'asc' },
                  ],
                },
              },
              orderBy: [
                { isSignature: 'desc' },
                { isRecommended: 'desc' },
                { sortOrder: 'asc' },
                { name: 'asc' },
              ],
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant by slug:', error);
    return null;
  }
});

/**
 * Get restaurants by cuisine type
 */
export const getRestaurantsByCuisine = cache(async (cuisineType: string): Promise<RestaurantWithDetails[]> => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        isPublished: true,
        cuisine: {
          has: cuisineType,
        },
      },
      include: {
        businessUnit: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
        images: {
          where: {
            image: {
              isActive: true,
            },
          },
          include: {
            image: {
              select: {
                id: true,
                originalUrl: true,
                thumbnailUrl: true,
                mediumUrl: true,
                largeUrl: true,
                title: true,
                description: true,
                altText: true,
              },
            },
          },
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants by cuisine:', error);
    return [];
  }
});

/**
 * Increment restaurant view count
 */
export const incrementRestaurantViewCount = async (restaurantId: string): Promise<void> => {
  try {
    await prisma.restaurant.update({
      where: {
        id: restaurantId,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error('Error incrementing restaurant view count:', error);
  }
};