import { configureStore } from '@reduxjs/toolkit';
import { barChartConfigSlice } from '../../../components/DataViz/store/barChartSlice';
import { lineChartConfigSlice } from '../../../components/DataViz/store/lineChartSlice';
import { pieChartConfigSlice } from '../../../components/DataViz/store/pieChartSlice';
import { tableVisSlice } from '../../../components/DataViz/store/tableVisSlice';
import { semanticViewerSlice } from './semanticViewerSlice';

export const store = configureStore({
    reducer: {
        semanticViewer: semanticViewerSlice.reducer,
        barChartConfig: barChartConfigSlice.reducer,
        lineChartConfig: lineChartConfigSlice.reducer,
        pieChartConfig: pieChartConfigSlice.reducer,
        tableVisConfig: tableVisSlice.reducer,
    },
    devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
