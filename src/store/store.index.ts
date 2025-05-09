import { create, type StoreApi, type UseBoundStore } from "zustand";
import createLoadingSlice, { ILoadingSlice } from "./loading.slice";
import createResetSlice, { IResetSlice } from "./reset.slice";
import createScoreSlice, { IScoreSlice } from "./score.slice";

// !: Don't touch this part
type WithSelectors<S> = S extends { getState: () => infer T }
	? S & { use: { [K in keyof T]: () => T[K] } }
	: never;

// !: Don't touch this part
function createSelectors<S extends UseBoundStore<StoreApi<object>>>(_store: S) {
	const store = _store as WithSelectors<typeof _store>;
	store.use = {};
	for (const k of Object.keys(store.getState())) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
	}

	return store;
}

// * update store from here
const useStoreBase = create<ILoadingSlice & IResetSlice & IScoreSlice>()((...args) => ({
	...createLoadingSlice(...args),
	...createResetSlice(...args),
	...createScoreSlice(...args),
}));

const useStore = createSelectors(useStoreBase);

export default useStore;
