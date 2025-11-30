// Header.tsx
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Stack, Button } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#3A86FF', // friendly blue
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', // subtle shadow for depth
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
        {/* Logo / Branding */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'cursive',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
          }}
        >
          <IconButton sx={{ mr: 1, p: 0 }}>
            <LibraryBooksIcon sx={{ color: '#fff', fontSize: { xs: 28, md: 32 } }} />
          </IconButton>
          BlogIt
        </Typography>

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={{ xs: 1, md: 4 }} alignItems="center">
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: { xs: '0.9rem', md: '1rem' },
              '&:hover': { color: '#FFD166', transform: 'scale(1.05)', transition: '0.2s' },
            }}
          >
            Home
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: { xs: '0.9rem', md: '1rem' },
              '&:hover': { color: '#FFD166', transform: 'scale(1.05)', transition: '0.2s' },
            }}
          >
            Login
          </Button>

          <Button
            variant="contained"
            component={Link}
            to="/signup"
            sx={{
              backgroundColor: '#4361EE', // slightly darker friendly blue
              color: '#fff',
              borderRadius: '24px',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: { xs: '0.9rem', md: '1rem' },
              px: 3,
              py: 1.2,
              boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#3F51B5',
                transform: 'scale(1.05)',
                transition: '0.2s',
              },
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
