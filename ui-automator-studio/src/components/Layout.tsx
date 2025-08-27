import { AppBar, Box, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import type { PropsWithChildren } from 'react'

export function Layout({ children }: PropsWithChildren) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<CssBaseline />
			<AppBar position="static" color="primary" enableColorOnDark>
				<Toolbar>
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						UI Automator Studio
					</Typography>
				</Toolbar>
			</AppBar>
			<Box component="main" sx={{ flex: 1, overflow: 'hidden' }}>{children}</Box>
		</Box>
	)
}

export default Layout

