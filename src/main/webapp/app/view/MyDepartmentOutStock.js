Ext.define('MyApp.view.MyDepartmentOutStock', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyDepartmentOutStock',
    store: 'MyDepartmentOutStockStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'departmentOutQuery',
    layout: {
        type: 'border'
    },
    title: '部门汇总',
    features: [{
        ftype: 'summary',
        dock: 'bottom'
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
                    id: 'btnDepartmentOutBegin',
                    format: 'Y-m-d',
                    value:new Date()
                },
                {
                    xtype: 'label',
                    text: '到'
                },
                {
                    xtype: 'datefield',
                    id: 'btnDepartmentOutEnd',
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
		            header: "部门名称",
		            itemId:'deparmntOutStock_department',
		            dataIndex: 'department',
		            hidden: false,
		            width: 108,
		            renderer:function(value,metadata,record,store){
		            	var kvstore =  Ext.data.StoreManager.get('MyDepartmentStore');
		            	var index = kvstore.find('id',value);
		            	var record = kvstore.getAt(index).get('name');
		            	return record; 
		            }
			     },{
		            header: "物品编号",
		            itemId:'deparmntOutStock_stock',
		            dataIndex: 'stock',
		            hidden: false,
		            width: 108
			     },{
		            header: "物品名称",
		            itemId:'deparmntOutStock_stockName',
		            dataIndex: 'stockName',
		            hidden: false,
		            width: 108
				 },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         itemId:'deparmntOutStock_stockSpecification',
			         dataIndex: 'stockSpecification',
			         text: '物品规格',
			         sortable: true
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'deparmntOutStock_stockUnit',
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
			         itemId:'deparmntOutStock_stockNumber',
			         dataIndex: 'stockNumber',
			         text: '数量',
			         sortable: true
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'deparmntOutStock_stockworth',
				     dataIndex: 'stockWorth',
				     text: '金额',
				     sortable: true
				},{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'deparmntOutStock_number',
				     dataIndex: 'number',
				     text: '笔数',
				     sortable: true
				}]
        });
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    
    onQueryClick:function(){
    	
    	var btnCreateTimeBegin = Ext.getCmp('btnDepartmentOutBegin').getValue();
    	var btnCreateTimeEnd = Ext.getCmp('btnDepartmentOutEnd').getValue();

    	
    	var proxy = this.store.getProxy(); 
        proxy.extraParams['beginTimeStr'] = Ext.Date.format(btnCreateTimeBegin, 'Y-m-d'); 
        proxy.extraParams['endTimeStr'] = Ext.Date.format(btnCreateTimeEnd, 'Y-m-d');
        
    	this.store.load();
    }
});