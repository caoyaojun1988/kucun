Ext.define('MyApp.view.MyOutStockTotal', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyOutStockTotal',
    store: 'MyOutStockTotalStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'outStockTotalQuery',
    layout: {
        type: 'border'
    },
    title: '出库汇总',
    features: [{
        ftype: 'summary'
    }],
    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    xtype: 'label',
                    text: '从'
                },
                {
                    xtype: 'datefield',
                    id: 'btnQeryOutTotalBegin',
                    format: 'Y-m-d',
                    value:new Date()
                },
                {
                    xtype: 'label',
                    text: '到'
                },
                {
                    xtype: 'datefield',
                    id: 'btnQeryOutTotalEnd',
                    format: 'Y-m-d',
                    value:new Date()
                },{
                	iconCls: 'icon-query',
                	text: '查询',
                	disabled: false,
                	itemId: 'btnQry',
                	scope: this,
                    handler: this.onQueryClick
                }]
            }],
            columns: [new Ext.grid.RowNumberer({width: 50}),{
		            header: "物品编号",
		            itemId:'outStockTotal_stock',
		            dataIndex: 'stock',
		            hidden: false,
		            width: 108,
		             summaryType: 'count',
	                 summaryRenderer: function (value, summaryData, dataIndex) {
	                     return '总数'+value;
	                 }
			     },{
		            header: "物品名称",
		            itemId:'outStockTotal_stockName',
		            dataIndex: 'stockName',
		            hidden: false,
		            width: 108
				 },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         itemId:'outStockTotal_stockSpecification',
			         dataIndex: 'stockSpecification',
			         text: '物品规格',
			         sortable: true
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'outStockTotal_stockUnit',
				     dataIndex: 'stockUnit',
				     text: '单位',
				     sortable: true,
				     renderer:function(value,metadata,record,store){
			            	var kvstore =  Ext.data.StoreManager.get('MyUnitStore');
			            	var index = kvstore.find('id',value);
			            	var record = kvstore.getAt(index).get('name');
			            	return record; 
			            }
				},{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         itemId:'outStockTotal_stockNumber',
			         dataIndex: 'stockNumber',
			         text: '数量',
			         sortable: true,
	                 summaryType: 'sum'
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'outStockTotal_stockWorth',
				     dataIndex: 'stockWorth',
				     text: '金额',
				     sortable: true,
	                 summaryType: 'sum'
				},{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'outStockTotal_number',
				     dataIndex: 'number',
				     text: '笔数',
				     sortable: true,
	                 summaryType: 'sum'
				}]
        });
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    
    onQueryClick:function(){
    	var kvstore =  Ext.data.StoreManager.get('MyUnitStore');
    	kvstore.load();
    	
    	var btnCreateTimeBegin = Ext.getCmp('btnQeryOutTotalBegin').getValue();
    	var btnCreateTimeEnd = Ext.getCmp('btnQeryOutTotalEnd').getValue();

    	
    	var proxy = this.store.getProxy(); 
        proxy.extraParams['beginTimeStr'] = Ext.Date.format(btnCreateTimeBegin, 'Y-m-d'); 
        proxy.extraParams['endTimeStr'] = Ext.Date.format(btnCreateTimeEnd, 'Y-m-d');
        
    	this.store.load();
    }
});