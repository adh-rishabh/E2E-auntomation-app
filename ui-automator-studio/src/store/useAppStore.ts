import { create } from 'zustand'

export type Device = {
	deviceId: string
	name: string
	status: 'connected' | 'disconnected' | 'busy'
}

export type ScriptRun = {
	id: string
	scriptText: string
	deviceId: string | null
	status: 'queued' | 'running' | 'passed' | 'failed' | 'cancelled'
	logs: string[]
	startedAt?: number
	finishedAt?: number
}

type AppState = {
	scriptModeEnabled: boolean
	currentScriptText: string
	singleBlock: boolean
	devices: Device[]
	selectedDeviceId: string | null
	runs: ScriptRun[]
	setScriptModeEnabled: (enabled: boolean) => void
	setCurrentScriptText: (text: string) => void
	setSingleBlock: (single: boolean) => void
	setDevices: (devices: Device[]) => void
	selectDevice: (deviceId: string | null) => void
	queueRun: (scriptText: string) => string
	appendRunLog: (runId: string, line: string) => void
	setRunStatus: (runId: string, status: ScriptRun['status']) => void
}

export const useAppStore = create<AppState>((set, get) => ({
	scriptModeEnabled: false,
	currentScriptText: '',
	singleBlock: true,
	devices: [],
	selectedDeviceId: null,
	runs: [],
	setScriptModeEnabled: (enabled) => set({ scriptModeEnabled: enabled }),
	setCurrentScriptText: (text) => set({ currentScriptText: text }),
	setSingleBlock: (single) => set({ singleBlock: single }),
	setDevices: (devices) => set({ devices }),
	selectDevice: (deviceId) => set({ selectedDeviceId: deviceId }),
	queueRun: (scriptText) => {
		const runId = `run_${Date.now()}`
		const { selectedDeviceId } = get()
		set((state) => ({
			runs: [
				{
					id: runId,
					scriptText,
					deviceId: selectedDeviceId,
					status: 'queued',
					logs: [],
					startedAt: Date.now(),
				},
				...state.runs,
			],
		}))
		return runId
	},
	appendRunLog: (runId, line) =>
		set((state) => ({
			runs: state.runs.map((r) =>
				r.id === runId ? { ...r, logs: [...r.logs, line] } : r
			),
		})),
	setRunStatus: (runId, status) =>
		set((state) => ({
			runs: state.runs.map((r) =>
				r.id === runId ? { ...r, status, finishedAt: Date.now() } : r
			),
		})),
}))

