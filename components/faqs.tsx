'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import { ExpandMore, ArrowForward } from '@mui/icons-material';
import { faqs } from '../data/faqs';

const FAQ: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));
  
  const filteredFaqs = selectedCategory 
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs;

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
            Support Center
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
            FREQUENTLY
            <br />
            ASKED QUESTIONS
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
            Find answers to common questions about our properties, services, 
            and booking policies. Get the information you need instantly.
          </Typography>
        </Box>

        {/* Category Filters */}
        <Box sx={{ mb: { xs: 6, md: 10 }, display: 'flex', justifyContent: 'center' }}>
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              flexWrap: 'wrap', 
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <Chip
              label="All Categories"
              onClick={() => setSelectedCategory(null)}
              sx={{
                backgroundColor: selectedCategory === null ? '#111827' : 'white',
                color: selectedCategory === null ? 'white' : '#111827',
                fontSize: '0.875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: 0,
                height: 40,
                px: 3,
                border: `2px solid ${selectedCategory === null ? '#111827' : '#e5e7eb'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: selectedCategory === null ? '#1f2937' : '#111827',
                  color: 'white',
                  borderColor: '#111827',
                  transform: 'translateY(-2px)',
                },
              }}
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  backgroundColor: selectedCategory === category ? '#111827' : 'white',
                  color: selectedCategory === category ? 'white' : '#111827',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderRadius: 0,
                  height: 40,
                  px: 3,
                  border: `2px solid ${selectedCategory === category ? '#111827' : '#e5e7eb'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? '#1f2937' : '#111827',
                    color: 'white',
                    borderColor: '#111827',
                    transform: 'translateY(-2px)',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* FAQ Accordions */}
        <Box sx={{ maxWidth: '900px', mx: 'auto', mb: { xs: 8, md: 12 } }}>
          {filteredFaqs.map((faq, index) => (
            <Box
              key={faq.id}
              sx={{
                mb: 3,
                backgroundColor: 'white',
                borderRadius: 0,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              <Accordion
                expanded={expanded === faq.id}
                onChange={handleChange(faq.id)}
                sx={{
                  boxShadow: 'none',
                  border: 'none',
                  borderRadius: 0,
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMore 
                      sx={{ 
                        color: '#111827',
                        fontSize: 28,
                        transition: 'transform 0.3s ease',
                      }} 
                    />
                  }
                  sx={{
                    backgroundColor: expanded === faq.id ? '#f8f9fa' : 'white',
                    minHeight: 80,
                    px: { xs: 3, md: 4 },
                    py: 2,
                    transition: 'all 0.3s ease',
                    '& .MuiAccordionSummary-content': {
                      margin: '16px 0',
                      alignItems: 'center',
                    },
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 3 }}>
                    {/* Question Number */}
                    <Box
                      sx={{
                        backgroundColor: expanded === faq.id ? '#111827' : '#f3f4f6',
                        color: expanded === faq.id ? 'white' : '#6b7280',
                        width: 40,
                        height: 40,
                        borderRadius: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Box>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1.1rem', md: '1.25rem' },
                          color: '#111827',
                          lineHeight: 1.4,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {faq.question}
                      </Typography>
                    </Box>

                    <Chip
                      label={faq.category}
                      sx={{
                        backgroundColor: expanded === faq.id ? '#111827' : '#e5e7eb',
                        color: expanded === faq.id ? 'white' : '#6b7280',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderRadius: 0,
                        height: 28,
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: 4,
                    pt: 0,
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <Box sx={{ pl: { xs: 0, md: 7 } }}>
                    <Typography
                      sx={{
                        color: '#6b7280',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 1.7,
                        fontWeight: 400,
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          ))}
        </Box>

        {/* Bottom CTA Section */}
        <Box 
          sx={{ 
            textAlign: 'center',
            backgroundColor: 'white',
            py: { xs: 8, md: 12 },
            px: { xs: 4, md: 6 },
            maxWidth: '800px',
            mx: 'auto',
            mt: { xs: 8, md: 12 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '3rem' },
              color: '#111827',
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
            }}
          >
            Still have
            <br />
            questions?
          </Typography>
          
          <Typography
            sx={{
              color: '#6b7280',
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              lineHeight: 1.6,
              mb: 6,
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            Our dedicated support team is here to help you with any additional 
            questions or concerns you may have.
          </Typography>
          
          <Button
            endIcon={<ArrowForward sx={{ fontSize: 18 }} />}
            sx={{
              backgroundColor: '#111827',
              color: 'white',
              px: 8,
              py: 3,
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: 0,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#1f2937',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 24px rgba(17, 24, 39, 0.3)',
              },
            }}
          >
            Contact Support
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQ;