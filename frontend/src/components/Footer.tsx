import { Box, Typography, IconButton } from '@mui/material';
import { GrInstagram } from "react-icons/gr";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#3A86FF', // friendly blue like header
        color: '#fff',
        textAlign: 'center',
        p: 3,
        mt: 5,
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
      }}
    >
      <Typography
        variant='subtitle1'
        sx={{
          mb: 1,
          fontWeight: 'bold',
          fontFamily: 'cursive',
        }}
      >
        Stay connected with us
      </Typography>

      <Box>
        <IconButton
          href="https://instagram.com"
          target="_blank"
          sx={{
            color: '#fff',
            '&:hover': { color: '#E1306C', transform: 'scale(1.2)', transition: '0.2s' },
          }}
        >
          <GrInstagram size={24} />
        </IconButton>
        <IconButton
          href="https://facebook.com"
          target="_blank"
          sx={{
            color: '#fff',
            '&:hover': { color: '#1877F2', transform: 'scale(1.2)', transition: '0.2s' },
          }}
        >
          <FaFacebook size={24} />
        </IconButton>
        <IconButton
          href="https://twitter.com"
          target="_blank"
          sx={{
            color: '#fff',
            '&:hover': { color: '#1DA1F2', transform: 'scale(1.2)', transition: '0.2s' },
          }}
        >
          <FaTwitter size={24} />
        </IconButton>
      </Box>

      <Typography
        variant='caption'
        display="block"
        sx={{ mt: 2, color: '#fff', fontStyle: 'italic' }}
      >
        &copy; 2025 BlogIt. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
