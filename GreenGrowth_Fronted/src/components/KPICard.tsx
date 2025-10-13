import React from 'react';
import { Card, CardContent, Typography, Box, useTheme, alpha } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

// Define the types for the component's props
interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string; // <-- New optional prop for the delta/change
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  variant?: 'contained' | 'outlined';
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

/**
 * A KPI card component for displaying a primary value and a secondary subtitle.
 */
const KPICard: React.FC<KPICardProps> = ({
  icon,
  title,
  value,
  subtitle, // <-- Destructure the new prop
  color = 'primary',
  variant = 'outlined',
  onClick,
  sx = {}
}) => {
  const theme = useTheme();
  const isContained = variant === 'contained';

  const baseCardStyles: SxProps<Theme> = {
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: onClick ? 'pointer' : 'default',
    '&:hover': {
      transform: onClick ? 'translateY(-2px)' : 'none',
      boxShadow: onClick ? '0 6px 16px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.08)',
    },
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  };

  const variantStyles: SxProps<Theme> = isContained
    ? { backgroundColor: `${color}.main`, color: `${color}.contrastText` }
    : {
        backgroundColor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
      };

  const iconWrapperStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
    padding: 1.5,
    borderRadius: '12px',
    backgroundColor: isContained
      ? alpha(theme.palette.common.white, 0.15)
      : alpha(theme.palette[color]?.main || theme.palette.grey[500], 0.1),
    color: isContained ? `${color}.contrastText` : `${color}.main`,
  };

  return (
    <Card onClick={onClick} sx={{ ...baseCardStyles, ...variantStyles, ...sx }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={iconWrapperStyles}>{icon}</Box>
        <Box>
          <Typography variant="body2" fontWeight={600} color={isContained ? 'inherit' : 'text.secondary'}>
            {title}
          </Typography>
          <Typography variant="h5" component="p" fontWeight="bold" color="inherit">
            {value}
          </Typography>
           {/* Subtitle element for displaying the delta */}
          {subtitle && (
            <Typography variant="caption" color={isContained ? alpha(theme.palette.common.white, 0.7) : 'text.secondary'}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default KPICard;