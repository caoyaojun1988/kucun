Ext.define('MyApp.view.MyOutStockDetailPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.MyOutStockDetailPanel',
    
    itemId: 'outStockDetailPanel',
    id:'outStockDetailPanelId',
    frame: true,
    title: '出库明细',
    
    layout: {
        type: 'accordion',
        multi:true
    },
    
    items:[{
    	xtype: 'MyOutStockDetailOrder'
    },{
    	xtype: 'MyOutStockDetail'
    }],
    
    initComponent: function(){
    	Ext.QuickTips.init();
    	Ext.applyIf(this, {
    	});
    	this.callParent(arguments);
    }
});
