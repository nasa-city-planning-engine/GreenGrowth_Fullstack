import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

// --- CHANGE 1 of 3: Add the optional 'useDecimal' prop ---
interface ParametersProps{
    name: string,
    min_value : number ,
    max_value : number,
    useDecimal?: boolean 
}

// --- CHANGE 2 of 3: Destructure the new prop with a default value ---
export default function Parameter ({ name, min_value, max_value, useDecimal = false } : ParametersProps) {
    const [value, setValue] = useState<number>(useDecimal ? 0.3 : 30); 
    
    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number)
    };

    return (
    <>
        {/* Row for Name and Current Value */}
        <Stack direction="row" justifyContent="space-between" sx={{ alignItems: 'center' }}>
            {/* Display the Parameter Name */}
            <Typography sx={{fontFamily: 'sans-serif', color: 'black'}}>{name}</Typography>
            
            {/* Display the Current Value */}
            <Typography sx={{fontFamily: 'sans-serif', color: 'black', fontWeight: 'bold'}}>
                {/* Conditionally format the output to one decimal place */}
                {useDecimal ? value.toFixed(1) : value}
            </Typography>
        </Stack>
        
        {/* Row for Slider and Range Info (MUI Stack for layout) */}
        <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
            
            {/* Optional: Show Min Value Label */}
            <Typography sx={{ color: 'black', fontSize: '0.8rem' }}>{min_value}</Typography>
            
            <Slider 
                aria-label={name} 
                value={value} 
                onChange={handleChange} 
                min={min_value} 
                max={max_value}
                // --- CHANGE 3 of 3: Conditionally set the step for decimal values ---
                step={useDecimal ? 0.1 : 1}
            />
            
            {/* Optional: Show Max Value Label */}
            <Typography sx={{ color: 'black', fontSize: '0.8rem' }}>{max_value}</Typography>
        </Stack>
    </>
    )
}