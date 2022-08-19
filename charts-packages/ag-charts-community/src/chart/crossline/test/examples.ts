import { AgCartesianChartOptions, AgCrossLineOptions } from '../../agChartOptions';
import { DATA_MEAN_SEA_LEVEL } from '../../test/data';
import { loadExampleOptions } from '../../test/utils';
import { DATA_OIL_PETROLEUM } from './data';

export const GROUPED_BAR_CHART_EXAMPLE: AgCartesianChartOptions = loadExampleOptions('grouped-bar');
export const GROUPED_COLUMN_EXAMPLE: AgCartesianChartOptions = loadExampleOptions('grouped-column');
export const LINE_GRAPH_WITH_GAPS_EXAMPLE: AgCartesianChartOptions = loadExampleOptions('line-with-gaps');
export const XY_HISTOGRAM_WITH_MEAN_EXAMPLE: AgCartesianChartOptions = loadExampleOptions(
    'xy-histogram-with-mean-aggregation'
);
export const AREA_GRAPH_WITH_NEGATIVE_VALUES_EXAMPLE: AgCartesianChartOptions =
    loadExampleOptions('area-with-negative-values');

const baseChartOptions: AgCartesianChartOptions = {
    data: DATA_OIL_PETROLEUM,
    theme: {
        overrides: {
            line: {
                axes: {
                    number: {
                        gridStyle: [],
                    },
                    time: {
                        gridStyle: [],
                    },
                },
                series: {
                    highlightStyle: {
                        series: {
                            strokeWidth: 3,
                            dimOpacity: 0.2,
                        },
                    },
                },
            },
        },
    },
    series: [
        {
            type: 'line',
            xKey: 'date',
            yKey: 'petrol',
            stroke: '#01c185',
            marker: {
                stroke: '#01c185',
                fill: '#01c185',
            },
        },
        {
            type: 'line',
            xKey: 'date',
            yKey: 'diesel',
            stroke: '#000000',
            marker: {
                stroke: '#000000',
                fill: '#000000',
            },
        },
    ],
    axes: [
        {
            position: 'bottom',
            type: 'time',
            title: {
                text: 'Date',
            },
        },
        {
            position: 'left',
            type: 'number',
            title: {
                text: 'Price in pence',
            },
        },
    ],
};

const baseCrossLineOptions: AgCrossLineOptions = {
    type: 'range',
    fill: '#dbddf0',
    stroke: '#5157b7',
    fillOpacity: 0.4,
    label: {
        text: 'Price Peak',
        color: 'black',
        position: 'top',
        fontSize: 14,
    },
};

const createChartOptions = (
    crossLineOptions: Record<string, AgCrossLineOptions>
): Record<string, AgCartesianChartOptions> => {
    let result: Record<string, AgCartesianChartOptions> = {};

    for (const name in crossLineOptions) {
        const vertical = name.startsWith('V_');
        const horizontal = name.startsWith('H_');
        result[name] = {
            ...baseChartOptions,
            axes: baseChartOptions['axes']?.map((axis) => {
                const addCrossLines =
                    (vertical && axis.position === 'bottom') || (horizontal && axis.position === 'left');
                if (addCrossLines) {
                    return { ...axis, crossLines: [{ ...crossLineOptions[name] }] };
                }
                return axis;
            }),
        };
    }

    return result;
};

const verticalCrossLinesOptions: Record<string, AgCrossLineOptions> = {
    V_VALID_RANGE: {
        range: [new Date(2019, 4, 1), new Date(2019, 8, 1)],
        ...baseCrossLineOptions,
    },
    V_FLIPPED_VALID_RANGE: {
        range: [new Date(2019, 8, 1), new Date(2019, 4, 1)],
        ...baseCrossLineOptions,
    },
    V_RANGE_OUTSIDE_DOMAIN_MAX: {
        range: [new Date(2019, 4, 1), new Date(2022, 8, 1)],
        ...baseCrossLineOptions,
    },
    V_FLIPPED_RANGE_OUTSIDE_DOMAIN_MAX: {
        range: [new Date(2022, 8, 1), new Date(2019, 4, 1)],
        ...baseCrossLineOptions,
    },
    V_RANGE_OUTSIDE_DOMAIN_MIN: {
        range: [new Date(2017, 8, 1), new Date(2019, 4, 1)],
        ...baseCrossLineOptions,
    },
    V_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN: {
        range: [new Date(2019, 4, 1), new Date(2017, 8, 1)],
        ...baseCrossLineOptions,
    },
    V_RANGE_OUTSIDE_DOMAIN_MIN_MAX: {
        range: [new Date(2017, 8, 1), new Date(2022, 4, 1)],
        ...baseCrossLineOptions,
    },
    V_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN_MAX: {
        range: [new Date(2022, 4, 1), new Date(2017, 8, 1)],
        ...baseCrossLineOptions,
    },
    V_RANGE_OUTSIDE_DOMAIN: {
        range: [new Date(2022, 4, 1), new Date(2022, 8, 1)],
        ...baseCrossLineOptions,
    },
    V_INVALID_RANGE: {
        range: [new Date(2019, 4, 1), undefined],
        ...baseCrossLineOptions,
    },
    V_FLIPPED_INVALID_RANGE: {
        range: [undefined, new Date(2019, 4, 1)],
        ...baseCrossLineOptions,
    },
};

const horizontalCrossLinesOptions: Record<string, AgCrossLineOptions> = {
    H_VALID_RANGE: {
        range: [128, 134],
        ...baseCrossLineOptions,
    },
    H_FLIPPED_VALID_RANGE: {
        range: [134, 128],
        ...baseCrossLineOptions,
    },
    H_RANGE_OUTSIDE_DOMAIN_MAX: {
        range: [134, 160],
        ...baseCrossLineOptions,
    },
    H_FLIPPED_RANGE_OUTSIDE_DOMAIN_MAX: {
        range: [160, 134],
        ...baseCrossLineOptions,
    },
    H_RANGE_OUTSIDE_DOMAIN_MIN: {
        range: [100, 134],
        ...baseCrossLineOptions,
    },
    H_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN: {
        range: [134, 100],
        ...baseCrossLineOptions,
    },
    H_RANGE_OUTSIDE_DOMAIN_MIN_MAX: {
        range: [100, 160],
        ...baseCrossLineOptions,
    },
    H_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN_MAX: {
        range: [160, 100],
        ...baseCrossLineOptions,
    },
    H_RANGE_OUTSIDE_DOMAIN: {
        range: [90, 110],
        ...baseCrossLineOptions,
    },
    H_INVALID_RANGE: {
        range: [128, undefined],
        ...baseCrossLineOptions,
    },
    H_FLIPPED_INVALID_RANGE: {
        range: [undefined, 128],
        ...baseCrossLineOptions,
    },
};

const chartOptions: Record<string, AgCartesianChartOptions> = createChartOptions({
    ...verticalCrossLinesOptions,
    ...horizontalCrossLinesOptions,
});

export const VERTICAL_VALID_RANGE_CROSSLINES: AgCartesianChartOptions = chartOptions['V_VALID_RANGE'];
export const VERTICAL_FLIPPED_VALID_RANGE_CROSSLINES: AgCartesianChartOptions = chartOptions['V_FLIPPED_VALID_RANGE'];
export const VERTICAL_RANGE_OUTSIDE_DOMAIN_MAX_CROSSLINES: AgCartesianChartOptions =
    chartOptions['V_RANGE_OUTSIDE_DOMAIN_MAX'];
export const VERTICAL_FLIPPED_RANGE_OUTSIDE_DOMAIN_MAX_CROSSLINES: AgCartesianChartOptions =
    chartOptions['V_FLIPPED_RANGE_OUTSIDE_DOMAIN_MAX'];
export const VERTICAL_RANGE_OUTSIDE_DOMAIN_MIN_CROSSLINES: AgCartesianChartOptions =
    chartOptions['V_RANGE_OUTSIDE_DOMAIN_MIN'];
export const VERTICAL_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN_CROSSLINES: AgCartesianChartOptions =
    chartOptions['V_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN'];
export const VERTICAL_RANGE_OUTSIDE_DOMAIN_MIN_MAX_CROSSLINES: AgCartesianChartOptions =
    chartOptions['V_RANGE_OUTSIDE_DOMAIN_MIN_MAX'];
export const VERTICAL_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN_MAX_CROSSLINES: AgCartesianChartOptions =
    chartOptions['V_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN_MAX'];
export const VERTICAL_RANGE_OUTSIDE_DOMAIN_CROSSLINES: AgCartesianChartOptions = chartOptions['V_RANGE_OUTSIDE_DOMAIN'];
export const VERTICAL_INVALID_RANGE_CROSSLINES: AgCartesianChartOptions = chartOptions['V_INVALID_RANGE'];
export const VERTICAL_FLIPPED_INVALID_RANGE_CROSSLINES: AgCartesianChartOptions =
    chartOptions['V_FLIPPED_INVALID_RANGE'];

export const HORIZONTAL_VALID_RANGE_CROSSLINES: AgCartesianChartOptions = chartOptions['H_VALID_RANGE'];
export const HORIZONTAL_FLIPPED_VALID_RANGE_CROSSLINES: AgCartesianChartOptions = chartOptions['H_FLIPPED_VALID_RANGE'];
export const HORIZONTAL_RANGE_OUTSIDE_DOMAIN_MAX_CROSSLINES: AgCartesianChartOptions =
    chartOptions['H_RANGE_OUTSIDE_DOMAIN_MAX'];
export const HORIZONTAL_FLIPPED_RANGE_OUTSIDE_DOMAIN_MAX_CROSSLINES: AgCartesianChartOptions =
    chartOptions['H_FLIPPED_RANGE_OUTSIDE_DOMAIN_MAX'];
export const HORIZONTAL_RANGE_OUTSIDE_DOMAIN_MIN_CROSSLINES: AgCartesianChartOptions =
    chartOptions['H_RANGE_OUTSIDE_DOMAIN_MIN'];
export const HORIZONTAL_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN_CROSSLINES: AgCartesianChartOptions =
    chartOptions['H_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN'];
export const HORIZONTAL_RANGE_OUTSIDE_DOMAIN_MIN_MAX_CROSSLINES: AgCartesianChartOptions =
    chartOptions['H_RANGE_OUTSIDE_DOMAIN_MIN_MAX'];
export const HORIZONTAL_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN_MAX_CROSSLINES: AgCartesianChartOptions =
    chartOptions['H_FLIPPED_RANGE_OUTSIDE_DOMAIN_MIN_MAX'];
export const HORIZONTAL_RANGE_OUTSIDE_DOMAIN_CROSSLINES: AgCartesianChartOptions =
    chartOptions['H_RANGE_OUTSIDE_DOMAIN'];
export const HORIZONTAL_INVALID_RANGE_CROSSLINES: AgCartesianChartOptions = chartOptions['H_INVALID_RANGE'];
export const HORIZONTAL_FLIPPED_INVALID_RANGE_CROSSLINES: AgCartesianChartOptions =
    chartOptions['H_FLIPPED_INVALID_RANGE'];

const xAxisCrossLineStyle = {
    fill: 'rgba(0,118,0,0.5)',
    fillOpacity: 0.2,
    stroke: 'green',
    strokeWidth: 1,
};

const yAxisCrossLineStyle = {
    fill: 'pink',
    fillOpacity: 0.2,
    stroke: 'red',
    strokeWidth: 1,
};

export const SCATTER_CROSSLINES: AgCartesianChartOptions = {
    title: {
        text: 'Mean Sea Level (mm)',
    },
    data: DATA_MEAN_SEA_LEVEL,
    series: [
        {
            type: 'scatter',
            xKey: 'time',
            yKey: 'mm',
        },
    ],
    axes: [
        {
            position: 'left',
            type: 'number',
            crossLines: [
                {
                    type: 'range',
                    range: [10, 30],
                    label: {
                        text: '10 - 30',
                        position: 'right',
                    },
                    ...yAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: 60,
                    label: {
                        text: '60',
                        position: 'right',
                    },
                    ...yAxisCrossLineStyle,
                },
            ],
        },
        {
            position: 'bottom',
            type: 'number',
            crossLines: [
                {
                    type: 'range',
                    range: [2001, 2003],
                    label: {
                        text: '2001 - 2003',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'range',
                    range: [2013, 2014],
                    label: {
                        text: '2013 - 20014',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: 2008,
                    label: {
                        text: '2008',
                    },
                    ...xAxisCrossLineStyle,
                },
            ],
        },
    ],
    legend: {
        enabled: true,
        position: 'right',
    },
};

export const LINE_CROSSLINES: AgCartesianChartOptions = {
    ...LINE_GRAPH_WITH_GAPS_EXAMPLE,
    axes: [
        {
            type: 'category',
            position: 'bottom',
            title: {
                text: 'Week',
            },
            label: {
                formatter: (params) => (params.index % 3 ? '' : params.value),
            },
            crossLines: [
                {
                    type: 'range',
                    range: ['1', '13'],
                    label: {
                        text: '1 - 13',
                        position: 'top',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'range',
                    range: ['34', '45'],
                    label: {
                        text: '34 - 45',
                        position: 'top',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: '27',
                    label: {
                        text: '27',
                        position: 'top',
                    },
                    ...xAxisCrossLineStyle,
                },
            ],
        },
        {
            type: 'number',
            position: 'left',
            title: {
                text: '£ per kg',
            },
            nice: false,
            min: 0.2,
            max: 1,
            crossLines: [
                {
                    type: 'range',
                    range: [0.25, 0.33],
                    label: {
                        text: '0.25 - 0.33',
                        position: 'insideLeft',
                        padding: 10,
                    },
                    ...yAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: 0.87,
                    label: {
                        text: '0.87',
                        position: 'topRight',
                    },
                    ...yAxisCrossLineStyle,
                },
            ],
        },
    ],
};

export const AREA_CROSSLINES: AgCartesianChartOptions = {
    ...AREA_GRAPH_WITH_NEGATIVE_VALUES_EXAMPLE,
    axes: [
        {
            type: 'category',
            position: 'bottom',
            crossLines: [
                {
                    type: 'range',
                    range: ['Q1', 'Q2'],
                    label: {
                        text: 'Q1 - Q2',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'range',
                    range: ['Q3', 'Q4'],
                    label: {
                        text: 'Q3 - Q4',
                    },
                    ...xAxisCrossLineStyle,
                },
            ],
        },
        {
            type: 'number',
            position: 'left',
            title: {
                text: 'Thousand tonnes of oil equivalent',
            },
            crossLines: [
                {
                    type: 'range',
                    range: [800, 1000],
                    label: {
                        text: '800 - 1000',
                        position: 'insideBottomLeft',
                    },
                    ...yAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: -700,
                    label: {
                        text: '-700',
                        position: 'topLeft',
                    },
                    ...yAxisCrossLineStyle,
                },
            ],
        },
    ],
};

export const COLUMN_CROSSLINES: AgCartesianChartOptions = {
    ...GROUPED_COLUMN_EXAMPLE,
    axes: [
        {
            position: 'bottom',
            type: 'category',
            crossLines: [
                {
                    type: 'range',
                    range: ['2015', '2016'],
                    label: {
                        text: '2015 - 2016',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'range',
                    range: ['2017', '2019'],
                    label: {
                        text: '2017 - 2019',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: '2012',
                    label: {
                        text: '2012',
                    },
                    ...xAxisCrossLineStyle,
                },
            ],
        },
        {
            position: 'left',
            type: 'number',
            crossLines: [
                {
                    type: 'range',
                    range: [7000, 8000],
                    label: {
                        text: '7000 - 8000',
                        position: 'right',
                        rotation: -90,
                    },
                    ...yAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: 3500,
                    label: {
                        text: '3500',
                        position: 'right',
                        rotation: -90,
                    },
                    ...yAxisCrossLineStyle,
                },
            ],
        },
    ],
};

export const BAR_CROSSLINES: AgCartesianChartOptions = {
    ...GROUPED_BAR_CHART_EXAMPLE,
    axes: [
        {
            position: 'left',
            type: 'category',
            crossLines: [
                {
                    type: 'range',
                    range: ['Whole economy', 'Public sector'],
                    label: {
                        text: 'Whole economy - Public sector',
                        position: 'right',
                        rotation: -90,
                    },
                    ...yAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: 'Manufacturing',
                    label: {
                        text: 'Manufacturing',
                        position: 'right',
                        rotation: -90,
                    },
                    ...yAxisCrossLineStyle,
                },
            ],
        },
        {
            position: 'bottom',
            type: 'number',
            crossLines: [
                {
                    type: 'range',
                    range: [0.5, 1.4],
                    label: {
                        text: '0.5 - 1.4',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'range',
                    range: [2.3, 2.5],
                    label: {
                        text: '2.3 - 2.5',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: 3.6,
                    label: {
                        text: '3.6',
                    },
                    ...xAxisCrossLineStyle,
                },
            ],
        },
    ],
};

export const HISTOGRAM_CROSSLINES: AgCartesianChartOptions = {
    ...XY_HISTOGRAM_WITH_MEAN_EXAMPLE,
    axes: [
        {
            position: 'bottom',
            type: 'number',
            title: {
                enabled: true,
                text: 'Engine Size (Cubic inches)',
            },
            crossLines: [
                {
                    type: 'range',
                    range: [70, 100],
                    label: {
                        text: '70 - 100',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'range',
                    range: [200, 285],
                    label: {
                        text: '200 - 285',
                    },
                    ...xAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: 300,
                    label: {
                        text: '300',
                    },
                    ...xAxisCrossLineStyle,
                },
            ],
        },
        {
            position: 'left',
            type: 'number',
            title: {
                text: 'Highway MPG',
            },
            crossLines: [
                {
                    type: 'range',
                    range: [10, 15],
                    label: {
                        text: '70 - 100',
                        position: 'insideTopRight',
                        color: 'orange',
                    },
                    ...yAxisCrossLineStyle,
                },
                {
                    type: 'line',
                    value: 50,
                    label: {
                        text: '50',
                        position: 'bottomRight',
                        color: 'orange',
                    },
                    ...yAxisCrossLineStyle,
                },
            ],
        },
    ],
};
