'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowForward, Star } from '@mui/icons-material';
import { HeroData, incrementHeroView, incrementHeroClick } from '../lib/actions/heroes';

interface HeroProps {
  heroData?: HeroData | null;
}

const Hero: React.FC<HeroProps> = ({ heroData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Default fallback data if no hero data is provided
  const defaultHero: Partial<HeroData> = {
    title: 'Experience Luxury Beyond Imagination',
    subtitle: 'Award-winning luxury hospitality since 1995',
    description: 'Discover our world-class hotels and resorts across breathtaking locations. Where every moment becomes an unforgettable memory.',
    backgroundImage: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    primaryButtonText: 'Explore Our Properties',
    primaryButtonUrl: '/properties',
    secondaryButtonText: 'View Special Offers',
    secondaryButtonUrl: '/offers',
    textAlignment: 'center',
    overlayOpacity: 0.4,
    textColor: 'white'
  };

  const hero = heroData || defaultHero;

  // Track view count when component mounts
  useEffect(() => {
    if (heroData?.id) {
      incrementHeroView(heroData.id).catch(console.error);
    }
  }, [heroData?.id]);

  const handleButtonClick = async (url?: string | null) => {
    if (heroData?.id) {
      // Track click count using server action
      try {
        await incrementHeroClick(heroData.id);
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    }
    
    if (url) {
      window.location.href = url;
    }
  };

  // Parse title to handle line breaks
  const titleParts = hero.title?.split('\n') || ['Experience Luxury', 'Beyond Imagination'];
  
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: hero.displayType === 'banner' ? '60vh' : '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: hero.backgroundImage ? `url(${hero.backgroundImage})` : `url(${defaultHero.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: hero.overlayColor || `rgba(0, 0, 0, ${hero.overlayOpacity || 0.4})`,
          zIndex: 1,
        },
      }}
    >
      {/* Background Video if provided */}
      {hero.backgroundVideo && (
        <Box
          component="video"
          autoPlay
          muted
          loop
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src={hero.backgroundVideo} type="video/mp4" />
        </Box>
      )}

      {/* Overlay Image if provided */}
      {hero.overlayImage && (
        <Box
          component="img"
          src={hero.overlayImage}
          alt={hero.altText || 'Hero overlay'}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
        />
      )}

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: hero.textAlignment || 'center',
          color: hero.textColor || 'white',
        }}
      >
        {/* Subtitle with stars */}
        {hero.subtitle && (
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} justifyContent={hero.textAlignment === 'left' ? 'flex-start' : hero.textAlignment === 'right' ? 'flex-end' : 'center'} alignItems="center" sx={{ mb: 2 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} sx={{ color: '#FFD700', fontSize: 24 }} />
              ))}
            </Stack>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
              {hero.subtitle}
            </Typography>
          </Box>
        )}

        {/* Main Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 3,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: isMobile ? '3rem' : '4.5rem',
            lineHeight: 1.1,
            color: hero.textColor || 'white',
          }}
        >
          {titleParts[0]}
          {titleParts[1] && (
            <>
              <br />
              <Box component="span" sx={{ color: 'secondary.main' }}>
                {titleParts[1]}
              </Box>
            </>
          )}
        </Typography>

        {/* Description */}
        {hero.description && (
          <Typography
            variant="h5"
            sx={{
              mb: 5,
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: 600,
              mx: hero.textAlignment === 'center' ? 'auto' : 0,
              lineHeight: 1.6,
              fontSize: isMobile ? '1.25rem' : '1.5rem',
            }}
          >
            {hero.description}
          </Typography>
        )}

        {/* Action Buttons */}
        {(hero.primaryButtonText || hero.secondaryButtonText) && (
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={3}
            justifyContent={hero.textAlignment === 'left' ? 'flex-start' : hero.textAlignment === 'right' ? 'flex-end' : 'center'}
            alignItems="center"
          >
            {/* Primary Button */}
            {hero.primaryButtonText && (
              <Button
                variant={hero.primaryButtonStyle === 'outlined' ? 'outlined' : 'contained'}
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => handleButtonClick(hero.primaryButtonUrl)}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  backgroundColor: hero.primaryButtonStyle === 'outlined' ? 'transparent' : 'secondary.main',
                  color: hero.primaryButtonStyle === 'outlined' ? 'white' : 'white',
                  borderRadius: 3,
                  border: hero.primaryButtonStyle === 'outlined' ? '2px solid white' : 'none',
                  borderColor: hero.primaryButtonStyle === 'outlined' ? 'white' : undefined,
                  boxShadow: hero.primaryButtonStyle === 'outlined' ? 'none' : '0 8px 24px rgba(255, 152, 0, 0.3)',
                  '&:hover': {
                    backgroundColor: hero.primaryButtonStyle === 'outlined' ? 'rgba(255, 255, 255, 0.1)' : 'secondary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: hero.primaryButtonStyle === 'outlined' ? 'none' : '0 12px 32px rgba(255, 152, 0, 0.4)',
                    borderColor: hero.primaryButtonStyle === 'outlined' ? 'secondary.main' : undefined,
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {hero.primaryButtonText}
              </Button>
            )}
            
            {/* Secondary Button */}
            {hero.secondaryButtonText && (
              <Button
                variant={hero.secondaryButtonStyle === 'contained' ? 'contained' : 'outlined'}
                size="large"
                onClick={() => handleButtonClick(hero.secondaryButtonUrl)}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  backgroundColor: hero.secondaryButtonStyle === 'contained' ? 'secondary.main' : 'transparent',
                  borderColor: hero.secondaryButtonStyle === 'contained' ? undefined : 'white',
                  color: hero.secondaryButtonStyle === 'contained' ? 'white' : 'white',
                  borderRadius: 3,
                  borderWidth: 2,
                  boxShadow: hero.secondaryButtonStyle === 'contained' ? '0 8px 24px rgba(255, 152, 0, 0.3)' : 'none',
                  '&:hover': {
                    backgroundColor: hero.secondaryButtonStyle === 'contained' ? 'secondary.dark' : 'rgba(255, 152, 0, 0.1)',
                    borderColor: hero.secondaryButtonStyle === 'contained' ? undefined : 'secondary.main',
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: hero.secondaryButtonStyle === 'contained' ? '0 12px 32px rgba(255, 152, 0, 0.4)' : 'none',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {hero.secondaryButtonText}
              </Button>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Hero;