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
                },
                {
                    xtype: 'label',
                    text: '到'
                },
                {
                    xtype: 'datefield',
                    id: 'btnQeryOutTotalEnd',
                },{
                	iconCls: 'icon-query',
                	text: '查询',
                	disabled: false,
                	itemId: 'btnQry',
                	scope: this,
                    handler: this.onQueryClick
                }]
            }, {
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                store: 'MyOutStockTotalStore',
                displayInfo: true
            }],
            columns: [{
		            header: "物品编号",
		            dataIndex: 'stock',
		            hidden: false,
		            width: 108
			     },{
		            header: "物品名称",
		            dataIndex: 'stockName',
		            hidden: false,
		            width: 108
				 },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         dataIndex: 'stockSpecification',
			         text: '物品规格',
			         sortable: true
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
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
			         dataIndex: 'stockNumber',
			         text: '数量',
			         sortable: true
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     dataIndex: 'stockWorth',
				     text: '金额',
				     sortable: true
				},{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     dataIndex: 'number',
				     text: '笔数',
				     sortable: true
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