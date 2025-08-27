import { Box, Button, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { useAppStore } from '../store/useAppStore'

export function HistoryPanel() {
	const { scriptHistory, setCurrentScriptText } = useAppStore()

	return (
		<Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
				<Typography variant="subtitle2">Script History</Typography>
			</Stack>
			<Divider sx={{ mb: 1 }} />
			{scriptHistory.length === 0 && <Typography variant="body2">No history yet.</Typography>}
			<List dense>
				{scriptHistory.map((h) => (
					<ListItem key={h.id} secondaryAction={<Button onClick={() => setCurrentScriptText(h.text)}>Load</Button>}>
						<ListItemText
							primary={h.name}
							secondary={new Date(h.savedAt).toLocaleString()}
						/>
					</ListItem>
				))}
			</List>
		</Box>
	)
}

export default HistoryPanel

