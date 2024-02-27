/*
 *  Document   : base_pages_crypto_dashboard.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Crypto Dashboard Page
 */

var BasePagesCryptoDashboard = function() {
    // Crypto Charts, for more examples you can check out http://www.chartjs.org/docs
    var initChartsCrypto = function () {
        // Set Global Chart.js configuration
        Chart.defaults.global.defaultFontColor              = '#999';
        Chart.defaults.global.defaultFontFamily             = 'Open Sans';
        Chart.defaults.global.defaultFontStyle              = '600';
        Chart.defaults.scale.gridLines.color                = "transparent";
        Chart.defaults.global.elements.point.radius         = 5;
        Chart.defaults.global.elements.point.hoverRadius    = 7;
        Chart.defaults.global.tooltips.titleFontFamily      = 'Source Sans Pro';
        Chart.defaults.global.tooltips.bodyFontFamily       = 'Open Sans';
        Chart.defaults.global.tooltips.cornerRadius         = 3;
        Chart.defaults.global.legend.labels.boxWidth        = 15;
        Chart.defaults.global.legend.display                = false;

        // Get Chart Containers
        var $chart2BitcoinCon  = jQuery('.js-chartjs2-bitcoin');
        var $chart2EthereumCon = jQuery('.js-chartjs2-ethereum');
        var $chart2LitecoinCon = jQuery('.js-chartjs2-litecoin');

        // Helper Classes
        var $chart2Bitcoin, $chart2Ethereum, $chart2Litecoin;

        // Set up labels
        var $chartCryptolabels = [];
        for (i = 0; i < 30; i++) {
            $chartCryptolabels[i] = (i === 29) ? '1 day ago' : (30 - i) + ' days ago';
        }

        // Cryto Data
        $chart2BitcoinData  = [10500, 10400, 9500, 8268, 10218, 8250, 8707, 9284, 9718, 9950, 9879, 10147, 10883, 11071, 11332, 11584, 11878, 13540, 16501, 16007, 15142, 14869, 16762, 17276, 16808, 16678, 16771, 12900, 13100, 14000];
        $chart2EthereumData = [500, 525, 584, 485, 470, 320, 380, 580, 620, 785, 795, 801, 799, 750, 900, 920, 930, 1300, 1250, 1150, 1365, 1258, 980, 870, 860, 925, 999, 1050, 1090, 1100];
        $chart2LitecoinData = [300, 320, 330, 331, 335, 340, 358, 310, 220, 180, 190, 195, 203, 187, 198, 258, 270, 340, 356, 309, 218, 230, 242, 243, 250, 210, 205, 226, 214, 250];

        // Init Bitcoin Chart on Tab Shown
        jQuery('a[href="#crypto-coins-btc"]', 'ul#crypto-tabs').on('shown.bs.tab', function(e) {
            // if already exists destroy it
            if ($chart2Bitcoin) {
                $chart2Bitcoin.destroy();
            }

            // Init Chart
            $chart2Bitcoin = new Chart($chart2BitcoinCon, {
                type: 'line',
                data: {
                    labels: $chartCryptolabels,
                    datasets: [
                        {
                            label: 'Bitcoin Price',
                            fill: true,
                            backgroundColor: 'rgba(255,193,7,.25)',
                            borderColor: 'rgba(255,193,7,1)',
                            pointBackgroundColor: 'rgba(255,193,7,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(255,193,7,1)',
                            data: $chart2BitcoinData
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 6000,
                                suggestedMax: 20000
                            }
                        }]
                    },
                    tooltips: {
                        intersect: false,
                        callbacks: {
                            label: function(tooltipItems, data) {
                                return ' $' + tooltipItems.yLabel;
                            }
                        }
                    }
                }
            });
        });

        // Init Ethereum Chart on Tab Shown
        jQuery('a[href="#crypto-coins-eth"]', 'ul#crypto-tabs').on('shown.bs.tab', function(e) {
            // if already exists destroy it
            if ($chart2Ethereum) {
                $chart2Ethereum.destroy();
            }

            // Init Chart
            $chart2Ethereum = new Chart($chart2EthereumCon, {
                type: 'line',
                data: {
                    labels: $chartCryptolabels,
                    datasets: [
                        {
                            label: 'Ethereum Price',
                            fill: true,
                            backgroundColor: 'rgba(111,124,186, .25)',
                            borderColor: 'rgba(111,124,186, 1)',
                            pointBackgroundColor: 'rgba(111,124,186, 1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(111,124,186, 1)',
                            data: $chart2EthereumData
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 1500
                            }
                        }]
                    },
                    tooltips: {
                        intersect: false,
                        callbacks: {
                            label: function(tooltipItems, data) {
                                return ' $' + tooltipItems.yLabel;
                            }
                        }
                    }
                }
            });
        });

        // Init Litecoin Chart on Tab Shown
        jQuery('a[href="#crypto-coins-ltc"]', 'ul#crypto-tabs').on('shown.bs.tab', function(e) {
            // if already exists destroy it
            if ($chart2Litecoin) {
                $chart2Litecoin.destroy();
            }

            // Init Chart
            $chart2Litecoin = new Chart($chart2LitecoinCon, {
                type: 'line',
                data: {
                    labels: $chartCryptolabels,
                    datasets: [
                        {
                            label: 'Litecoin Price',
                            fill: true,
                            backgroundColor: 'rgba(181,181,181,.25)',
                            borderColor: 'rgba(181,181,181,1)',
                            pointBackgroundColor: 'rgba(181,181,181,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(181,181,181,1)',
                            data: $chart2LitecoinData
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 400
                            }
                        }]
                    },
                    tooltips: {
                        intersect: false,
                        callbacks: {
                            label: function(tooltipItems, data) {
                                return ' $' + tooltipItems.yLabel;
                            }
                        }
                    }
                }
            });
        });

        // Shown Bitcoin Tab
        jQuery('a[href="#crypto-coins-btc"]', 'ul#crypto-tabs').tab('show');
    };

    return {
        init: function () {
            // Init Crypto charts
            initChartsCrypto();
        }
    };
}();

// Initialize when page loads
jQuery(function(){ BasePagesCryptoDashboard.init(); });