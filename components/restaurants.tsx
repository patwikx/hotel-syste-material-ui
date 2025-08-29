'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import {
  LocationOn,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { RestaurantWithDetails } from '../types/restaurants';

interface RestaurantCardProps {
  restaurants: RestaurantWithDetails[];
}


// Create motion variants for the animations
const cardVariants = {
  hiddenLeft: {
    opacity: 0,
    x: -1200, // Start from far left (fixed value)
    scale: 0.9
  },
  hiddenRight: {
    opacity: 0,
    x: 1200, // Start from far right (fixed value)
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1
  }
};

// Helper function to get the best image URL
const getImageUrl = (images: RestaurantWithDetails['images']): string => {
  if (images.length === 0) {
    // Fallback image if no images are available
    return 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800';
  }

  // Find primary image first, otherwise use the first image
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  
  // Return the best available image URL (prefer medium, fall back to original, then thumbnail)
  return primaryImage.image.mediumUrl || 
         primaryImage.image.originalUrl || 
         primaryImage.image.thumbnailUrl ||
         'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800';
};

// Helper function to get image alt text
const getImageAlt = (images: RestaurantWithDetails['images'], restaurantName: string): string => {
  if (images.length === 0) {
    return `${restaurantName} interior`;
  }

  const primaryImage = images.find(img => img.isPrimary) || images[0];
  return primaryImage.image.altText || 
         primaryImage.image.title || 
         `${restaurantName} interior`;
};

// Helper function to format price range
const formatPriceRange = (priceRange: string | null): string => {
  if (!priceRange) return 'Moderate';
  return priceRange;
};

// Helper function to format average meal price
const formatAverageMeal = (averageMeal: number | null, currency: string): string => {
  if (!averageMeal) return '';
  return `Average: ${currency} ${averageMeal.toLocaleString()}`;
};

const Restaurants: React.FC<RestaurantCardProps> = ({ restaurants }) => {
  // State to track current image index for each restaurant (for future slideshow functionality)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  // Initialize image indices
  useEffect(() => {
    const initialIndices: { [key: string]: number } = {};
    restaurants.forEach((restaurant) => {
      initialIndices[restaurant.id] = 0;
    });
    setCurrentImageIndex(initialIndices);
  }, [restaurants]);

  // Don't render if no restaurants
  if (!restaurants || restaurants.length === 0) {
    return (
      <Box 
        sx={{ 
          py: { xs: 8, md: 16 },
          backgroundColor: '#f8f9fa',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" color="text.secondary">
            No restaurants available at this time.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 16 },
        backgroundColor: '#f8f9fa',
        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="overline"
            sx={{
              color: '#6b7280',
              fontWeight: 700,
              letterSpacing: 3,
              fontSize: '0.875rem',
              mb: 2,
              display: 'block',
              textTransform: 'uppercase',
            }}
          >
            Culinary Excellence
          </Typography>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.75rem', md: '4rem', lg: '5rem' },
              lineHeight: { xs: 0.9, md: 0.85 },
              color: '#111827',
              mb: 4,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            OUR RESTAURANTS
          </Typography>
          <Typography
            sx={{
              color: '#6b7280',
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto',
              fontWeight: 400,
              mt: 3,
            }}
          >
            Experience culinary excellence across all our properties. Each restaurant
            offers unique flavors inspired by its surroundings, crafted by world-class chefs.
          </Typography>
        </Box>
      </Container>

      {/* Restaurants List - Full Width */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          width: '100%',
        }}
      >
        {restaurants.map((restaurant, index) => {
          const isEven = index % 2 === 0;
          const restaurantImages = restaurant.images || [];
          const imageUrl = getImageUrl(restaurantImages);
          const imageAlt = getImageAlt(restaurantImages, restaurant.name);
          
          return (
            <motion.div
              key={restaurant.id}
              initial={isEven ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                type: "tween"
              }}
            >
              <Card
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 0,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: 'none',
                  width: '100vw',
                  position: 'relative',
                  left: '50%',
                  right: '50%',
                  marginLeft: '-50vw',
                  marginRight: '-50vw',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    '& .restaurant-image': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { 
                      xs: 'column', 
                      md: isEven ? 'row' : 'row-reverse' 
                    },
                    minHeight: { xs: 'auto', md: '500px' },
                    maxWidth: '100%',
                  }}
                >
                  {/* Image Section */}
                  <Box 
                    sx={{ 
                      flex: { xs: '1', md: '0 0 50%' },
                      position: 'relative',
                      overflow: 'hidden',
                      height: { xs: '350px', md: 'auto' },
                      minHeight: { md: '100%' },
                    }}
                  >
                    {/* Image Container */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={imageAlt}
                        className="restaurant-image"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />

                      {/* Image Overlay for Better Text Visibility */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
                        }}
                      />
                    </Box>
                    
                    {/* Restaurant Type Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 24,
                        [isEven ? 'right' : 'left']: 24,
                        backgroundColor: 'white',
                        px: 3,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 2,
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#111827',
                          fontSize: '0.875rem',
                          textTransform: 'capitalize',
                        }}
                      >
                        {restaurant.type.replace('_', ' ')}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Content Section */}
                  <Box 
                    sx={{ 
                      flex: { xs: '1', md: '0 0 50%' },
                      display: 'flex',
                      flexDirection: 'column',
                      maxWidth: '100%',
                    }}
                  >
                    <CardContent 
                      sx={{ 
                        p: { xs: 4, md: 8 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: { xs: 'center', md: isEven ? 'left' : 'right' },
                        maxWidth: '100%',
                      }}
                    >
                      {/* Restaurant Number */}
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#6b7280',
                          mb: 2,
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                        }}
                      >
                        Restaurant {String(index + 1).padStart(2, '0')}
                      </Typography>

                      {/* Restaurant Name */}
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                          color: '#111827',
                          mb: 3,
                          letterSpacing: '-0.02em',
                          lineHeight: 0.9,
                          textTransform: 'uppercase',
                          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                          wordBreak: 'break-word',
                        }}
                      >
                        {restaurant.name}
                      </Typography>
                      
                      {/* Location */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 4,
                        justifyContent: { 
                          xs: 'center', 
                          md: isEven ? 'flex-start' : 'flex-end' 
                        },
                      }}>
                        <LocationOn sx={{ 
                          color: '#6b7280',
                          mr: 1,
                          fontSize: 20,
                        }} />
                        <Typography 
                          sx={{ 
                            color: '#6b7280',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                          }}
                        >
                          {restaurant.location || restaurant.businessUnit.displayName}
                        </Typography>
                      </Box>

                      {/* Description */}
                      <Typography
                        sx={{
                          color: '#6b7280',
                          fontSize: { xs: '1.1rem', md: '1.2rem' },
                          lineHeight: 1.6,
                          mb: 5,
                          fontWeight: 400,
                          maxWidth: '500px',
                          mx: { xs: 'auto', md: isEven ? '0' : 'auto' },
                          ml: { md: isEven ? '0' : 'auto' },
                        }}
                      >
                        {restaurant.shortDesc || restaurant.description}
                      </Typography>

                      {/* Cuisine Specialties */}
                      <Box sx={{ mb: 5 }}>
                        <Typography 
                          sx={{ 
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#111827',
                            mb: 2,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                          }}
                        >
                          Cuisine Specialties
                        </Typography>
                        <Stack 
                          direction="row" 
                          spacing={3} 
                          sx={{ 
                            flexWrap: 'wrap', 
                            gap: 2,
                            justifyContent: { 
                              xs: 'center', 
                              md: isEven ? 'flex-start' : 'flex-end' 
                            },
                          }}
                        >
                          {restaurant.cuisine.slice(0, 3).map((type) => (
                            <Typography
                              key={type}
                              sx={{
                                fontSize: '0.95rem',
                                color: '#6b7280',
                                fontWeight: 500,
                                position: 'relative',
                                '&::before': {
                                  content: '"•"',
                                  color: '#111827',
                                  fontWeight: 700,
                                  mr: 1,
                                }
                              }}
                            >
                              {type}
                            </Typography>
                          ))}
                          {restaurant.cuisine.length > 3 && (
                            <Typography
                              sx={{
                                fontSize: '0.95rem',
                                color: '#6b7280',
                                fontWeight: 500,
                                position: 'relative',
                                '&::before': {
                                  content: '"•"',
                                  color: '#111827',
                                  fontWeight: 700,
                                  mr: 1,
                                }
                              }}
                            >
                              +{restaurant.cuisine.length - 3} more
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      {/* Price Information */}
                      {(restaurant.priceRange || restaurant.averageMeal) && (
                        <Box sx={{ mb: 4 }}>
                          <Typography 
                            sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#111827',
                              mb: 1,
                              textTransform: 'uppercase',
                              letterSpacing: '2px',
                            }}
                          >
                            Pricing
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.95rem',
                              color: '#6b7280',
                              fontWeight: 500,
                            }}
                          >
                            {formatPriceRange(restaurant.priceRange)}
                            {restaurant.averageMeal && (
                              <span> • {formatAverageMeal(Number(restaurant.averageMeal), restaurant.currency)}</span>
                            )}
                          </Typography>
                        </Box>
                      )}

                      {/* View Menu Button */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: { 
                            xs: 'center', 
                            md: isEven ? 'flex-start' : 'flex-end' 
                          },
                        }}
                      >
                        <Button
                          endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
                          sx={{
                            backgroundColor: '#111827',
                            color: 'white',
                            px: 6,
                            py: 2.5,
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            borderRadius: 0,
                            minWidth: '200px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#1f2937',
                              transform: 'translateY(-3px)',
                              boxShadow: '0 12px 24px rgba(17, 24, 39, 0.3)',
                            },
                          }}
                        >
                          View Menu
                        </Button>
                      </Box>
                    </CardContent>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          );
        })}
      </Box>

      {/* Bottom Section */}
      <Container maxWidth="xl">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: { xs: 4, md: 8 },
            py: { xs: 6, md: 8 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4rem' },
              color: '#111827',
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
            }}
          >
            Ready to experience
            <br />
            culinary excellence?
          </Typography>
          
          <Button
            sx={{
              backgroundColor: '#111827',
              color: 'white',
              px: 10,
              py: 3.5,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: 0,
              mt: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#1f2937',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 24px rgba(17, 24, 39, 0.3)',
              },
            }}
          >
            Make Reservation
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Restaurants;