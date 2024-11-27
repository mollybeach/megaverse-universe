/*import { create } from 'zustand'

interface PhaseState {
    phase: number
    setPhase: (phase: number) => void
}

export const usePhaseStore = create<PhaseState>((set) => ({
    phase: 1,
    setPhase: (phase) => set({ phase }),
}))

// Export these for non-React contexts
export const getPhase = () => usePhaseStore.getState().phase
export const setPhase = (phase: number) => usePhaseStore.getState().setPhase(phase)*/