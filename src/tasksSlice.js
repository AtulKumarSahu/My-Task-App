import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        addTask: (state, action) => {
            state.push({
                id: Date.now().toString(),
                text: action.payload,
                completed: false,
            });
        },
        toggleTask: (state, action) => {
            const task = state.find(t => t.id === action.payload);
            if (task) task.completed = !task.completed;
        },
        deleteTask: (state, action) => {
            return state.filter(t => t.id !== action.payload);
        },
    },
});

export const { addTask, toggleTask, deleteTask } = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
