import {
    ChartKind,
    isVizPieChartConfig,
    VIZ_DEFAULT_AGGREGATION,
    type DimensionType,
    type SqlRunnerPivotChartLayout,
    type VizAggregationOptions,
    type VizIndexType,
    type VizPieChartConfig,
    type VizPieChartOptions,
} from '@lightdash/common';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {
    setChartConfig,
    setChartOptionsAndConfig,
} from './actions/commonChartActions';

export type PieChartState = {
    defaultFieldConfig: SqlRunnerPivotChartLayout | undefined;
    config: VizPieChartConfig | undefined;
    options: VizPieChartOptions;
};

const initialState: PieChartState = {
    defaultFieldConfig: undefined,
    config: undefined,
    options: {
        groupFieldOptions: [],
        metricFieldOptions: [],
        customMetricFieldOptions: [],
    },
};

export const pieChartConfigSlice = createSlice({
    name: 'pieChartConfig',
    initialState,
    reducers: {
        setGroupFieldIds: (
            { config },
            action: PayloadAction<{
                reference: string;
                axisType: VizIndexType;
                dimensionType: DimensionType;
            }>,
        ) => {
            if (config?.fieldConfig?.x) {
                config.fieldConfig.x = {
                    reference: action.payload.reference,
                    axisType: action.payload.axisType,
                    dimensionType: action.payload.dimensionType,
                };
            }
        },
        setYAxisReference: (
            state,
            action: PayloadAction<{
                reference: string;
                index: number;
            }>,
        ) => {
            if (state.config?.fieldConfig?.y) {
                const yAxis = state.config.fieldConfig.y[action.payload.index];
                if (yAxis) {
                    yAxis.reference = action.payload.reference;
                    yAxis.aggregation =
                        state.options.metricFieldOptions.find(
                            (option) =>
                                option.reference === action.payload.reference,
                        )?.aggregationOptions?.[0] ?? VIZ_DEFAULT_AGGREGATION;
                }
            }
        },
        setYAxisAggregation: (
            { config },
            action: PayloadAction<{
                index: number;
                aggregation: VizAggregationOptions;
            }>,
        ) => {
            if (!config) return;
            if (!config?.fieldConfig?.y) return;

            const yAxis = config.fieldConfig.y[action.payload.index];
            if (yAxis) {
                yAxis.aggregation = action.payload.aggregation;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setChartOptionsAndConfig, (state, action) => {
            if (action.payload.type !== ChartKind.PIE) {
                return;
            }

            state.options = action.payload.options;

            // Only set the initial config if it's not already set and the fieldConfig is present
            if (!state.config && action.payload.config.fieldConfig) {
                state.config = action.payload.config;
            }
        });
        builder.addCase(setChartConfig, (state, action) => {
            if (isVizPieChartConfig(action.payload)) {
                state.config = action.payload;
            }
        });
    },
});
export const { setGroupFieldIds, setYAxisReference, setYAxisAggregation } =
    pieChartConfigSlice.actions;
