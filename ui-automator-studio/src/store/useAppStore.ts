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

export type ScriptDoc = {
	id: string
	name: string
	text: string
	createdAt: number
	updatedAt: number
}

type AppState = {
	scriptModeEnabled: boolean
	currentScriptText: string
	singleBlock: boolean
	devices: Device[]
	selectedDeviceId: string | null
	runs: ScriptRun[]
	scriptDocs: ScriptDoc[]
	activeScriptId: string
	scriptHistory: { id: string; name: string; text: string; savedAt: number }[]
	setScriptModeEnabled: (enabled: boolean) => void
	setCurrentScriptText: (text: string) => void
	setSingleBlock: (single: boolean) => void
	setDevices: (devices: Device[]) => void
	selectDevice: (deviceId: string | null) => void
	queueRun: (scriptText: string) => string
	appendRunLog: (runId: string, line: string) => void
	setRunStatus: (runId: string, status: ScriptRun['status']) => void
	createScript: (name?: string, text?: string) => string
	setActiveScript: (id: string) => void
	renameActiveScript: (name: string) => void
	closeActiveScript: () => void
	saveSnapshotToHistory: (name?: string) => void
}

function nowId(prefix: string) {
	return `${prefix}_${Date.now()}`
}

export const useAppStore = create<AppState>((set, get) => ({
	scriptModeEnabled: false,
	currentScriptText: '',
	singleBlock: true,
	devices: [],
	selectedDeviceId: null,
	runs: [],
	scriptDocs: [
		{
			id: 'doc_0',
			name: 'Untitled Script',
			text: '',
			createdAt: Date.now(),
			updatedAt: Date.now(),
		},
	],
	activeScriptId: 'doc_0',
	scriptHistory: [],
	setScriptModeEnabled: (enabled) => set({ scriptModeEnabled: enabled }),
	setCurrentScriptText: (text) =>
		set((state) => ({
			currentScriptText: text,
			scriptDocs: state.scriptDocs.map((d) =>
				d.id === state.activeScriptId ? { ...d, text, updatedAt: Date.now() } : d
			),
		})),
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
	createScript: (name, text) => {
		const id = nowId('doc')
		const doc: ScriptDoc = {
			id,
			name: name ?? `Script ${get().scriptDocs.length + 1}`,
			text: text ?? '',
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}
		set((state) => ({
			scriptDocs: [...state.scriptDocs, doc],
			activeScriptId: id,
			currentScriptText: doc.text,
		}))
		return id
	},
	setActiveScript: (id) =>
		set((state) => {
			const doc = state.scriptDocs.find((d) => d.id === id)
			return doc ? { activeScriptId: id, currentScriptText: doc.text } : {}
		}),
	renameActiveScript: (name) =>
		set((state) => ({
			scriptDocs: state.scriptDocs.map((d) =>
				d.id === state.activeScriptId ? { ...d, name, updatedAt: Date.now() } : d
			),
		})),
	closeActiveScript: () =>
		set((state) => {
			if (state.scriptDocs.length <= 1) return {}
			const idx = state.scriptDocs.findIndex((d) => d.id === state.activeScriptId)
			const newDocs = state.scriptDocs.filter((d) => d.id !== state.activeScriptId)
			const newActive = newDocs[Math.max(0, idx - 1)]
			return {
				scriptDocs: newDocs,
				activeScriptId: newActive.id,
				currentScriptText: newActive.text,
			}
		}),
	saveSnapshotToHistory: (name) =>
		set((state) => {
			const active = state.scriptDocs.find((d) => d.id === state.activeScriptId)
			if (!active) return {}
			return {
				scriptHistory: [
					{ id: nowId('hist'), name: name ?? active.name, text: active.text, savedAt: Date.now() },
					...state.scriptHistory,
				],
			}
		}),
}))

