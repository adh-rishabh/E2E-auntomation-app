import { Box, Button, Stack, Tooltip } from '@mui/material'
import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export function TopShortcuts() {
	const { saveSnapshotToHistory, createScript, currentScriptText } = useAppStore()

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
				e.preventDefault()
				saveSnapshotToHistory()
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
				e.preventDefault()
				createScript()
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [saveSnapshotToHistory, createScript])

	return (
		<Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
			<Stack direction="row" spacing={1}>
				<Tooltip title="Ctrl/Cmd+S">
					<Button variant="outlined" onClick={() => saveSnapshotToHistory()} disabled={!currentScriptText.trim()}>
						Save Snapshot
					</Button>
				</Tooltip>
				<Tooltip title="Ctrl/Cmd+N">
					<Button variant="outlined" onClick={() => createScript()}>New Script</Button>
				</Tooltip>
			</Stack>
		</Box>
	)
}

export default TopShortcuts

