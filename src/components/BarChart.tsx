import React from 'react';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    VerticalBarSeriesCanvas,
    LabelSeries
} from 'react-vis';
import Tooltip from '@material-ui/core/Tooltip';



function BarChart(props) {
    let greenData = props.data.greenData; //[{ x: 'A', y: 10 }, { x: 'B', y: 5 }, { x: 'C', y: 15 }];

    let blueData = props.data.blueData; //[{ x: 'A', y: 12 }, { x: 'B', y: 2 }, { x: 'C', y: 11 }];

    let labelData = greenData.map((d, idx) => ({
        x: d.x,
        y: Math.max(greenData[idx].y, blueData[idx].y)
    }));
    const BarSeries = VerticalBarSeries;
    return (
        <div>

            <XYPlot xType="ordinal" width={1000} height={300} xDistance={200}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <BarSeries className="vertical-bar-series-example" data={greenData} />
                <BarSeries data={blueData} />
                <LabelSeries data={labelData} getLabel={d => d.x} />
            </XYPlot>
        </div>
    );

}

export default BarChart;
