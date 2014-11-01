Ext.define('MyApp.view.MyViewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    height: 72,
                    padding: 0,
                    layout: {
                        align: 'stretch',
                        padding: 0,
                        type: 'hbox'
                    },
                    bodyPadding: 0,
                    region: 'north',
                    dockedItems: [
                        {
                            xtype: 'image',
                            height: 201,
                            width: 201,
                            src: 'images/logo.png',
                            dock: 'left'
                        },
                        {
                            xtype: 'label',
                            height: 73,
                            html: '<h1>演示</h1>',
                            padding: '40 auto 20 30',
                            text: '',
                            flex: 1,
                            dock: 'top',
                            weight: 10
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    itemId: 'tabPanel',
                    activeTab: 0,
                    region: 'center'
                },
                {
                    xtype: 'panel',
                    itemId: 'navi',
                    width: 163,
                    bodyPadding: 20,
                    title: '菜单',
                    region: 'west',
                    split: true,
                    items: [
                        {
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnInStock',
                            margin: 5,
                            width: 97,
                            enableToggle: true,
                            pressed: false,
                            scale: 'large',
                            text: '入库单',
                            toggleGroup: 'menu'
                        },
                        {
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnOutStock',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '出库单',
                            toggleGroup: 'menu'
                        },{
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnStockQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '库存管理',
                            toggleGroup: 'menu'
                        },
                        {
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnInStockQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '入库明细',
                            toggleGroup: 'menu'
                        },
                        {
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnOutStockQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '出库明细',
                            toggleGroup: 'menu'
                        },{
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnInStockTotalQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '入库汇总',
                            toggleGroup: 'menu'
                        },{
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnOutStockTotalQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '出库汇总',
                            toggleGroup: 'menu'
                        },{
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnDeparmentOutQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '部门汇总',
                            toggleGroup: 'menu'
                        },{
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnStockTotalByCategoryQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '类目汇总',
                            toggleGroup: 'menu'
                        },{
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnCategoryQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '物品类目',
                            toggleGroup: 'menu'
                        },
                        {
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnUnitQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '单位',
                            toggleGroup: 'menu'
                        },
                        {
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnDepartmentQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '部门',
                            toggleGroup: 'menu'
                        },
                        {
                            xtype: 'button',
                            height: 20,
                            itemId: 'btnStaffQuery',
                            margin: 5,
                            width: 96,
                            enableToggle: true,
                            scale: 'large',
                            text: '人员',
                            toggleGroup: 'menu'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});
