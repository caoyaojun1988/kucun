/*
 * File: app/view/MyChart.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.view.MyChart', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.MyChart',

    itemId: 'trendChart',
    layout: {
        type: 'border'
    },
    title: '图表',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            dockedItems: [
                {
                    xtype: 'toolbar',
                    height: 30,
                    region: 'north',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'label',
                            text: '最近'
                        },
                        {
                            xtype: 'combobox',
                            itemId: 'comboLatest',
                            value: 1,
                            matchFieldWidth: false,
                            displayField: 'name',
                            queryMode: 'local',
                            store: 'LatestMonths',
                            valueField: 'value'
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'chart',
                    autoRender: false,
                    itemId: 'myChart',
                    animate: true,
                    insetPadding: 20,
                    store: 'MyChartStore',
                    region: 'center',
                    axes: [
                        {
                            type: 'Numeric',
                            fields: [
                                'data1',
                                'data2',
                                'data3'
                            ],
                            grid: '{\n                    odd: {\n                        opacity: 1,\n                        fill: \'#ddd\',\n                        stroke: \'#bbb\',\n                        \'stroke-width\': 0.5\n                    }',
                            position: 'left',
                            title: '质量'
                        },
                        {
                            type: 'Category',
                            fields: [
                                'name'
                            ],
                            position: 'bottom',
                            title: '月份'
                        }
                    ],
                    series: [
                        {
                            type: 'line',
                            highlight: {
                                size: 7,
                                radius: 7
                            },
                            title: '质量',
                            xField: 'name',
                            yField: [
                                'data1'
                            ],
                            smooth: 3
                        }
                    ],
                    legend: {
                        position: 'right'
                    }
                }
            ]
        });

        me.callParent(arguments);
    }

});
