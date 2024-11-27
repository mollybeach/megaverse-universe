/*
* Title: Space Error Message
* Path: src/utils/spaceErrorMessage.ts
* Description: This file contains a function that returns a random error message based on the action performed.
*/

export const getSpaceErrorMessage = (action: 'add' | 'delete' | 'sync') => {
    const messages = {
        add: [
            "🚀 Oops! Space turbulence detected while adding to the Megaverse!",
            "⭐ Houston, we have a problem adding to the universe...",
            "🛸 Cosmic rays interfered with the transmission...",
            "⭐ The space-time continuum hiccupped during creation...",
            "⭐ Cosmic dust failed to coalesce into a new star in the Megaverse..."
        ],
        delete: [
            "🌚 Black hole encountered while removing from the Megaverse!",
            "🚀 Stardust interference prevented deletion...",
            "🛸 The alien overlords rejected this deletion request...",
            "⭐ This piece of the universe refuses to be unmade...",
            "⭐ The quantum eraser needs new batteries..",
            "⭐ The space garbage collector is on lunch break...",
            "🚀 The celestial shredder is temporarily jammed..."
        ],
        sync: [
            "⭐ The universe's synchronization crystals are misaligned...",
            "🚀 The space-time GPS lost signal during sync...",
            "🛸 Quantum entanglement failed during universe sync...",
            "🚀 The cosmic alignment is temporarily disturbed...",
            "🌍 The universal matrix needs a moment to recalibrate..."
        ]
    };

    const categoryMessages = messages[action];
    return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
};