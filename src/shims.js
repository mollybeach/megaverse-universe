// Shim for async_hooks
export const async_hooks = {
    AsyncLocalStorage: class AsyncLocalStorage {
        getStore() { return null }
        run(store, callback) { return callback() }
    }
}