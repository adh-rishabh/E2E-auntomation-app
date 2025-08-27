import { Box, Chip, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import type { Device } from '../store/useAppStore'
import { useAppStore } from '../store/useAppStore'

function statusColor(status: Device['status']) {
	switch (status) {
		case 'connected':
			return 'success'
		case 'busy':
			return 'warning'
		default:
			return 'default'
	}
}

export function DevicePanel() {
	const { devices, selectedDeviceId, setDevices, selectDevice } = useAppStore()

	useEffect(() => {
		// Mock devices list
		const mock: Device[] = [
			{ deviceId: 'samsung-s23-ultra', name: 'Samsung S23 Ultra', status: 'connected' },
			{ deviceId: 'samsung-a54', name: 'Samsung A54', status: 'busy' },
			{ deviceId: 'samsung-tab-s8', name: 'Samsung Tab S8', status: 'disconnected' },
		]
		setDevices(mock)
	}, [setDevices])

	return (
		<Box sx={{ p: 2, borderRight: 1, borderColor: 'divider', height: '100%', overflow: 'auto' }}>
			<Typography variant="subtitle2" gutterBottom>
				Devices
			</Typography>
			<FormControl fullWidth size="small">
				<InputLabel id="device-select-label">Active device</InputLabel>
				<Select
					labelId="device-select-label"
					value={selectedDeviceId ?? ''}
					label="Active device"
					onChange={(e) => selectDevice(e.target.value ? String(e.target.value) : null)}
				>
					<MenuItem value="">
						<em>None</em>
					</MenuItem>
					{devices.map((d) => (
						<MenuItem key={d.deviceId} value={d.deviceId}>
							<Stack direction="row" spacing={1} alignItems="center">
								<span>{d.name}</span>
								<Chip size="small" color={statusColor(d.status) as any} label={d.status} />
							</Stack>
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<Divider sx={{ my: 2 }} />
			<Stack spacing={1}>
				{devices.map((d) => (
					<Stack key={d.deviceId} direction="row" justifyContent="space-between">
						<Typography variant="body2">{d.name}</Typography>
						<Chip size="small" color={statusColor(d.status) as any} label={d.status} />
					</Stack>
				))}
			</Stack>
		</Box>
	)
}

export default DevicePanel

