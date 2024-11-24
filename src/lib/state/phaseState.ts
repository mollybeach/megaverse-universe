const phaseState = {
    phase: 1,
};

export const setPhase = (value: number) => {
    phaseState.phase= value;
};

export const getPhaseState = () => phaseState;