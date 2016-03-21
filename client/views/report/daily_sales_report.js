initializeGraph = function () {


    var data = clientItemTotalDailySales.find({
        transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
    }, {
        sort: {
            soldRevenue: 1
        }
    }).fetch();

    var columns = ["Goal", "Sold"];

    var barChartData = new d3.range(0, 2).map(function (d, i) {
        return i == 0 ? {
            key: columns[i],
            values: _.map(data, function (sale) {
                return {
                    x: sale.itemName,
                    y: sale.goalRevenue ? sale.goalRevenue : 0
                }
            })
        } : {
            key: columns[i],
            values: _.map(data, function (sale) {
                return {
                    x: sale.itemName,
                    y: sale.soldRevenue ? sale.soldRevenue : 0
                }
            })
        };
    });

    var chart;

    nv.addGraph(function () {
        chart = nv.models.multiBarChart()
            .color(["#4caf50", "#e5af19"])
            .duration(300)
            .margin({bottom: 100, left: 70})
            .rotateLabels(45)
            .groupSpacing(0.1)
        ;
        chart.reduceXTicks(false).staggerLabels(true);
        chart.xAxis
            .axisLabelDistance(35)
            .showMaxMin(false)
        ;
        chart.yAxis
            .axisLabelDistance(-5)
            .tickFormat(d3.format(',.01f'))
        ;
        chart.dispatch.on('renderEnd', function () {
            nv.log('Render Complete');
        });

        d3.select('#daily-sales-graph-container svg')
            .datum(barChartData)
            .call(chart);

        nv.utils.windowResize(chart.update);

        chart.dispatch.on('stateChange', function (e) {
            nv.log('New State:', JSON.stringify(e));
        });

        chart.state.dispatch.on('change', function (state) {
            nv.log('state', JSON.stringify(state));
        });

        return chart;
    });
};


Template.dailySalesGraph.onRendered(function () {
    Tracker.autorun(function () {
        initializeGraph();
    });
});

Template.dailySalesGraph.helpers({
    selectedDate: function () {
        return Session.get("selectedDate") ?
            moment(Session.get("selectedDate"), "DD-MM-YYYY").format("MMMM DD, YYYY") :
            moment().format("MMMM DD, YYYY");
    }
});