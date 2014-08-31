Ext.define('MyApp.view.MyInStockDetailPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.MyInStockDetailPanel',
    
    itemId: 'inStockDetailPanel',
    id:'inStockDetailPanelId',
    frame: true,
    title: '入库明细',
    
    layout: {
        type: 'accordion',
        multi:true
    },
    
    items:[{
    	xtype: 'MyInStockDetailOrder'
    },{
    	xtype: 'MyInStockDetail'
    }],
    
    initComponent: function(){
    	Ext.QuickTips.init();
    	Ext.applyIf(this, {
    	});
    	this.callParent(arguments);
    }
});
