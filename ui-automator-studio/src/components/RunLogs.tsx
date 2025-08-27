import { Box, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { useAppStore } from '../store/useAppStore'

export function RunLogs() {
	const { runs } = useAppStore()
	const active = runs[0]
	return (
		<Box sx={{ p: 2, borderLeft: 1, borderColor: 'divider', height: '100%', overflow: 'auto' }}>
			<Typography variant="subtitle2" gutterBottom>
				Run Logs
			</Typography>
			{!active && <Typography variant="body2">No runs yet.</Typography>}
			{active && (
				<Stack spacing={1}>
					<Typography variant="body2">Run ID: {active.id}</Typography>
					<Typography variant="body2">Status: {active.status}</Typography>
					<Divider />
					<List dense>
						{active.logs.map((l, i) => (
							<ListItem key={i} sx={{ py: 0 }}>
								<ListItemText primaryTypographyProps={{ variant: 'caption' }} primary={l} />
							</ListItem>
						))}
					</List>
				</Stack>
			)}
		</Box>
	)
}

export default RunLogs

