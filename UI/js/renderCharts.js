$(function () {

    // Give the points a 3D feel by adding a radial gradient
    Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.4,
                cy: 0.3,
                r: 0.5
            },
            stops: [
            [0, color],
            [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
            ]
        };
    });

    // Set up the chart
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            margin: 100,
            type: 'scatter',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 250,
                viewDistance: 5,

                frame: {
                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                }
            }
        },
        title: {
            text: 'SWARM Algorithm Comparison'
        },
        subtitle: {
            text: 'Click and drag the plot area to rotate in space'
        },
        plotOptions: {
            scatter: {
                width: 10,
                height: 10,
                depth: 10
            }
        },
        yAxis: {
            min: 0,
            max: 10,
            title: "range"
        },
        xAxis: {
            min: 0,
            max: 10,
            gridLineWidth: 1
        },
        zAxis: {
            min: 0,
            max: 10
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Comparison',
            colorByPoint: true,
            data: [[1, 6, 5], [8, 7, 9], [1, 3, 4], [4, 6, 8], [5, 7, 7], [6, 9, 6]]
        }]
    });


    // Add mouse events for rotation
    $(chart.container).bind('mousedown.hc touchstart.hc', function (e) {
        e = chart.pointer.normalize(e);

        var posX = e.pageX,
        posY = e.pageY,
        alpha = chart.options.chart.options3d.alpha,
        beta = chart.options.chart.options3d.beta,
        newAlpha,
        newBeta,
            sensitivity = 5; // lower is more sensitive

            $(document).bind({
                'mousemove.hc touchdrag.hc': function (e) {
                // Run beta
                newBeta = beta + (posX - e.pageX) / sensitivity;
                newBeta = Math.min(100, Math.max(-100, newBeta));
                chart.options.chart.options3d.beta = newBeta;

                // Run alpha
                newAlpha = alpha + (e.pageY - posY) / sensitivity;
                newAlpha = Math.min(100, Math.max(-100, newAlpha));
                chart.options.chart.options3d.alpha = newAlpha;

                chart.redraw(false);
            },
            'mouseup touchend': function () {
                $(document).unbind('.hc');
            }
        });
        });

});


<!-- line chart-->

$(function () {
    $('#lineChart').highcharts({
        title: {
            text: 'Response Time',
            x: 0 //center
        },
        
        xAxis: {
            categories: ['Ant', 'Bee', 'RAMD', 'PSO']
        },
        yAxis: {
            title: {
                text: 'Time(seconds)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Ant',
            data: [9.6, 17.3, 13.9, 18.3]
        }, {
            name: 'Bee',
            data: [8.6, 18.1, 14.1, 9.5]
        }, {
            name: 'RAMD',
            data: [8.9, 17.9, 9.5, 14.3]
        }, {
            name: 'PSO',
            data: [8.6, 16.6, 9.8, 14.25]
        }]
    });
});

$(function () {
    $('#utilization').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Resource Utilization Chart'
        },
        xAxis: {
            categories: ['Memory', 'Storage', 'Bandwidth']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Resources Consumed'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -70,
            verticalAlign: 'top',
            y: 20,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>' +
                'Total: ' + this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black, 0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: 'Used',
            data: [5, 3, 4]
        }, {
            name: 'Available',
            data: [2, 3, 5]
        }]
    });
});

$(function () {
    $('#container2').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Algorithm Comparison'
        },
       
        xAxis: {
            categories: [
                'RAM',
                'Storage',
                'Bandwith'               
            ]
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Comparison'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Ant Colony Algorithm',
            data: [49.9, 71.5, 106.4]

        }, {
            name: 'Honey Bee Algorithm',
            data: [83.6, 78.8, 98.5]

        }, {
            name: 'RAMD Algorithm',
            data: [48.9, 38.8, 39.3]

        }, {
            name: 'PSO Algorithm',
            data: [42.4, 33.2, 34.5]

        }]
    });
});