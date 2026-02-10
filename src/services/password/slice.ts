import { forgot, reset } from '@actions';
import { createSlice } from '@reduxjs/toolkit';

type TInitialState = {
	error: string | null,
	isResponse: boolean
}

const initialState: TInitialState = {
	error: null,
	isResponse: false
}


export const passwordSlice = createSlice({
	name: 'password',
	initialState,
	reducers: {},
	selectors: {
		selectPasswordError: (state) => state.error,
		selectIsResponse: (state) => state.isResponse
	},
	extraReducers: (builder) => {
		builder.addCase(forgot.fulfilled, (state) => {
			state.isResponse = false,
			state.error = null
		})
		.addCase(forgot.rejected, (state, action) => {
			state.error = String(action.error.message)
			state.isResponse = false
		})
		.addCase(forgot.pending, (state) => {
			state.isResponse = true
		})

		.addCase(reset.fulfilled, (state) => {
			state.isResponse = false,
			state.error = null
		})
		.addCase(reset.rejected, (state, action) => {
			state.isResponse = false,
			state.error = String(action.error.message)
		})
		.addCase(reset.pending, (state) => {
			state.isResponse = true
		})
	}
})

export const {selectPasswordError, selectIsResponse} = passwordSlice.selectors
