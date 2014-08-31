Ext.define('MyApp.view.MyStockPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.MyStockPanel',
    
    itemId: 'stockPanel',
    id:'stockPanelId',
    frame: true,
    title: '库存管理',
    
    layout: {
        type: 'accordion',
        multi:true
    },
    
    items:[{
    	xtype: 'MyStock'
    },{
    	xtype: 'MyStockDetail'
    }],
    
    initComponent: function(){
    	Ext.QuickTips.init();
    	Ext.applyIf(this, {
    	});
    	this.callParent(arguments);
    }
});
