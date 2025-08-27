import { Box, Button, Stack } from '@mui/material'
import { Layout } from '../components/Layout'
import { DevicePanel } from '../components/DevicePanel'
import { ScriptEditor } from '../components/ScriptEditor'
import { RunLogs } from '../components/RunLogs'
import { useAppStore } from '../store/useAppStore'

export function Studio() {
	const { queueRun, appendRunLog, setRunStatus, currentScriptText } = useAppStore()

	const handleRun = () => {
		const id = queueRun(currentScriptText)
		setRunStatus(id, 'running')
		appendRunLog(id, 'Connecting to device...')
		setTimeout(() => appendRunLog(id, 'Launching Camera app'), 500)
		setTimeout(() => appendRunLog(id, 'Switching to Photo mode'), 1000)
		setTimeout(() => appendRunLog(id, 'Capturing frame...'), 1500)
		setTimeout(() => {
			appendRunLog(id, 'Run passed')
			setRunStatus(id, 'passed')
		}, 2200)
	}

	return (
		<Layout>
			<Stack direction="row" sx={{ height: '100%' }}>
				<Box sx={{ width: 280 }}>
					<DevicePanel />
				</Box>
				<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
					<Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
						<Button variant="contained" onClick={handleRun} disabled={!currentScriptText.trim()}>
							Run Script
						</Button>
					</Box>
					<Box sx={{ flex: 1, minHeight: 0 }}>
						<ScriptEditor />
					</Box>
				</Box>
				<Box sx={{ width: 320 }}>
					<RunLogs />
				</Box>
			</Stack>
		</Layout>
	)
}

export default Studio

