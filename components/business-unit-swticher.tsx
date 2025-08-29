"use client"

import * as React from "react"
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material"
import {
  Store as StoreIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from "@mui/icons-material"
import { useParams, useRouter } from "next/navigation"
import type { BusinessUnitItem } from "../types/business-unit-types"
import { useBusinessUnitModal } from "../hooks/use-bu-modal"

interface BusinessUnitSwitcherProps {
  items: BusinessUnitItem[] // This prop is expected to be pre-filtered by the parent Server Component
  className?: string
}

export default function BusinessUnitSwitcher({ 
  className, 
  items = [] 
}: BusinessUnitSwitcherProps) {
  const businessUnitModal = useBusinessUnitModal()
  const params = useParams()
  const router = useRouter()

  // Determine if the switcher should be an interactive dropdown.
  // This will be true for Admins (items.length > 1, as they get all units)
  // and false for regular users (items.length <= 1, as they only see their assigned units).
  const isSwitcherActive = items.length > 1
  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))
  const currentBusinessUnit = formattedItems.find((item) => item.value === params.businessUnitId)
  const [open, setOpen] = React.useState(false)

  const onBusinessUnitSelect = (businessUnit: { value: string; label: string } | null) => {
    if (businessUnit) {
      setOpen(false)
      router.push(`/${businessUnit.value}`)
      router.refresh()
    }
  }

  // --- RENDER A STATIC, NON-CLICKABLE DISPLAY FOR REGULAR USERS ---
  if (!isSwitcherActive) {
    return (
      <Box
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          fontSize: '0.875rem',
          fontWeight: 500,
          px: 1.5,
          py: 1,
          border: '1px solid transparent',
          borderRadius: 1,
        }}
      >
        <StoreIcon sx={{ mr: 1, fontSize: '1rem' }} />
        <Typography 
          variant="body2" 
          noWrap 
          sx={{ fontWeight: 500 }}
        >
          {currentBusinessUnit?.label || "No Unit Assigned"}
        </Typography>
      </Box>
    )
  }

  // --- RENDER THE FULL, INTERACTIVE DROPDOWN FOR ADMINISTRATORS ---
  return (
    <Box className={className} sx={{ width: 'calc(100% - 16px)' }}>
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={currentBusinessUnit || null}
        onChange={(event, newValue) => onBusinessUnitSelect(newValue)}
        options={formattedItems}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            variant="outlined"
            placeholder="Select Unit..."
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <StoreIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
              ),
              endAdornment: (
                <ExpandMoreIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                height: '40px',
              },
            }}
          />
        )}
        renderOption={(props, option, { selected }) => (
          <React.Fragment key={option.value}>
            <MenuItem {...props} selected={selected}>
              <ListItemIcon sx={{ minWidth: '32px' }}>
                <StoreIcon sx={{ fontSize: '1rem' }} />
              </ListItemIcon>
              <ListItemText 
                primary={option.label} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  noWrap: true 
                }} 
              />
              {selected && (
                <CheckIcon sx={{ ml: 'auto', fontSize: '1rem' }} />
              )}
            </MenuItem>
            {option === formattedItems[formattedItems.length - 1] && (
              <>
                <Divider />
                <MenuItem
                  onClick={() => {
                    setOpen(false)
                    businessUnitModal.onOpen()
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '32px' }}>
                    <AddIcon sx={{ fontSize: '1.25rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Create Business Unit"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </MenuItem>
              </>
            )}
          </React.Fragment>
        )}
        slotProps={{
          paper: {
            sx: {
              width: 256,
              maxHeight: 300,
            },
          },
        }}
        noOptionsText="No business unit found."
      />
    </Box>
  )
}