/*
 *  Document   : base_pages_dashboard_v3.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Dashboard v3 Page
 */

var BasePagesDashboardv3 = function() {
    // Chart.js Chart, for more examples you can check out http://www.chartjs.org/docs
    var initDashv3ChartJS = function(){
        // Set Global Chart.js configuration
        Chart.defaults.global.defaultFontColor              = '#555555';
        Chart.defaults.global.defaultFontFamily             = 'Open Sans';
        Chart.defaults.global.defaultFontStyle              = '600';
        Chart.defaults.scale.gridLines.color                = "transparent";
        Chart.defaults.scale.gridLines.zeroLineColor        = "transparent";
        Chart.defaults.scale.display                        = false;
        Chart.defaults.scale.ticks.beginAtZero              = true;
        Chart.defaults.global.elements.line.borderWidth     = 2;
        Chart.defaults.global.elements.point.radius         = 5;
        Chart.defaults.global.elements.point.hoverRadius    = 7;
        Chart.defaults.global.tooltips.cornerRadius         = 3;
        Chart.defaults.global.legend.display                = false;

        // Get Chart Container
        var $dashv3ChartEarningsCon = jQuery('.js-dashv3-chartjs-earnings');
        var $dashv3ChartSalesCon    = jQuery('.js-dashv3-chartjs-sales');

        // Earnings Chart Data
        var $dashv3ChartEarningsData = {
            labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            datasets: [
                {
                    label: 'Last Week',
                    fill: true,
                    backgroundColor: 'rgba(68, 180, 166, .07)',
                    borderColor: 'rgba(68, 180, 166, .25)',
                    pointBackgroundColor: 'rgba(68, 180, 166, .25)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(68, 180, 166, 1)',
                    data: [600, 350, 1100, 420, 750, 1050, 670]
                },
                {
                    label: 'This Week',
                    fill: true,
                    backgroundColor: 'rgba(68, 180, 166, .25)',
                    borderColor: 'rgba(68, 180, 166, .55)',
                    pointBackgroundColor: 'rgba(68, 180, 166, .55)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(68, 180, 166, 1)',
                    data: [490, 430, 560, 790, 1200, 950, 1500]
                }
            ]
        };

        // Sales Chart Data
        var $dashv3ChartSalesData = {
            labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            datasets: [
                {
                    label: 'Last Week',
                    fill: true,
                    backgroundColor: 'rgba(164, 138, 212, .07)',
                    borderColor: 'rgba(164, 138, 212, .25)',
                    pointBackgroundColor: 'rgba(164, 138, 212, .25)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(164, 138, 212, 1)',
                    data: [60, 40, 90, 35, 85, 65, 77]
                },
                {
                    label: 'This Week',
                    fill: true,
                    backgroundColor: 'rgba(164, 138, 212, .25)',
                    borderColorc: 'rgba(164, 138, 212, .55)',
                    pointBackgroundColor: 'rgba(164, 138, 212, .55)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(164, 138, 212, 1)',
                    data: [50, 33, 25, 82, 120, 95, 150]
                }
            ]
        };

        // Init Earnings Chart
        var $dashv3ChartEarnings    = new Chart($dashv3ChartEarningsCon, { type: 'line', data: $dashv3ChartEarningsData });
        var $dashv3ChartSales       = new Chart($dashv3ChartSalesCon, { type: 'line', data: $dashv3ChartSalesData });
    };

    return {
        init: function () {
            // Init ChartJS charts
            initDashv3ChartJS();
        }
    };
}();

// Initialize when page loads
jQuery(function(){ BasePagesDashboardv3.init(); });