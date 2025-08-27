import { Box, Stack, Switch, Tooltip, Typography } from '@mui/material'
import Editor from '@monaco-editor/react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export function ScriptEditor() {
	const {
		scriptModeEnabled,
		setScriptModeEnabled,
		singleBlock,
		setSingleBlock,
		currentScriptText,
		setCurrentScriptText,
	} = useAppStore()

	const [hoverTask, setHoverTask] = useState<string | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)

	const editorValue = useMemo(() => {
		if (!singleBlock) return currentScriptText
		// When single block is enabled, collapse multiple lines into one visible block delimiter
		return currentScriptText
	}, [singleBlock, currentScriptText])

	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		if (!scriptModeEnabled) return
		const el = containerRef.current
		if (!el) return
		const rect = el.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		// Simple heuristic to surface contextual tasks
		if (y < 60) {
			setHoverTask('Generate: Open Camera App')
		} else if (x < 200) {
			setHoverTask('Generate: Capture Photo')
		} else if (x > rect.width - 200) {
			setHoverTask('Generate: Switch to Video Mode')
		} else {
			setHoverTask(null)
		}
	}, [scriptModeEnabled])

	return (
		<Box ref={containerRef} sx={{ position: 'relative', height: '100%' }} onMouseMove={handleMouseMove}>
			<Stack direction="row" spacing={2} alignItems="center" sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
				<Typography variant="subtitle2">Script Mode</Typography>
				<Switch checked={scriptModeEnabled} onChange={(e) => setScriptModeEnabled(e.target.checked)} />
				<Typography variant="subtitle2">Single Block</Typography>
				<Switch checked={singleBlock} onChange={(e) => setSingleBlock(e.target.checked)} />
			</Stack>
			{hoverTask && scriptModeEnabled && (
				<Tooltip title="Click to insert task" open placement="top">
					<Box
						onClick={() => setCurrentScriptText((currentScriptText ? currentScriptText + '\n' : '') + `# ${hoverTask}`)}
						sx={{
							position: 'absolute',
							top: 64,
							left: 16,
							backgroundColor: 'warning.main',
							color: 'warning.contrastText',
							px: 1.5,
							py: 0.5,
							borderRadius: 1,
							cursor: 'pointer',
							boxShadow: 2,
						}}
					>
						<Typography variant="caption">{hoverTask}</Typography>
					</Box>
				</Tooltip>
			)}
			<Box sx={{ height: 'calc(100% - 48px)' }}>
				<Editor
					height="100%"
					defaultLanguage="python"
					value={editorValue}
					onChange={(v) => setCurrentScriptText(v ?? '')}
					options={{
						minimap: { enabled: false },
						wordWrap: 'on',
						scrollBeyondLastLine: false,
						automaticLayout: true,
					}}
				/>
			</Box>
		</Box>
	)
}

export default ScriptEditor

