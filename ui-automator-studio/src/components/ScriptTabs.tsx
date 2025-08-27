import { Close } from '@mui/icons-material'
import { Box, IconButton, Tab, Tabs, TextField } from '@mui/material'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export function ScriptTabs() {
	const { scriptDocs, activeScriptId, setActiveScript, createScript, renameActiveScript, closeActiveScript } = useAppStore()
	const [editing, setEditing] = useState(false)

	return (
		<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
			<Tabs
				value={activeScriptId}
				variant="scrollable"
				scrollButtons="auto"
				onChange={(_, v) => setActiveScript(v)}
			>
				{scriptDocs.map((d) => (
					<Tab
						key={d.id}
						value={d.id}
						label={
							d.id === activeScriptId && editing ? (
								<TextField
									size="small"
									defaultValue={d.name}
									onBlur={(e) => {
										renameActiveScript(e.target.value.trim() || d.name)
										setEditing(false)
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
									}}
								/>
							) : (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onDoubleClick={() => setEditing(true)}>
									<span>{d.name}</span>
									{scriptDocs.length > 1 && (
										<IconButton size="small" onClick={(e) => { e.stopPropagation(); closeActiveScript() }}>
											<Close fontSize="small" />
										</IconButton>
									)}
								</Box>
							)
						}
					/>
				))}
				<Tab label="+" onClick={() => createScript()} />
			</Tabs>
		</Box>
	)
}

export default ScriptTabs

