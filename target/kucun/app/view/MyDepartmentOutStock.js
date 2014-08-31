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
    	groupHeaderTpl: '{name}',
        ftype: 'groupingsummary',
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
                    value:new Date(),
                    listeners: {
	                	change: function (filed, newValue, oldValue, op) {
                			var btnInOrderTime = Ext.getCmp('btnDepartmentOutTime');
                			btnInOrderTime.setValue("0");
	                	}
	                }
                },
                {
                    xtype: 'label',
                    text: '到'
                },
                {
                    xtype: 'datefield',
                    id: 'btnDepartmentOutEnd',
                    format: 'Y-m-d',
                    value:new Date(),
                    listeners: {
	                	change: function (filed, newValue, oldValue, op) {
                			var btnInOrderTime = Ext.getCmp('btnDepartmentOutTime');
                			btnInOrderTime.setValue("0");
	                	}
	                }
                },{
                	id:'btnDepartmentOutTime',
                	xtype: 'combo',
                    fieldLabel: '快捷时间',
                    anchor: '100%',
                    store:'MyQuictTimeStore',
                    value:'0',
                    valueField: 'id',
                    displayField: 'name',
           	
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
		            dataIndex: 'departmentName',
		            hidden: true,
		            width: 108,
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
			         sortable: true,
			         summaryType: 'sum'
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'deparmntOutStock_stockworth',
				     dataIndex: 'stockWorth',
				     text: '金额',
				     sortable: true,
				     summaryType: 'sum'
				},{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'deparmntOutStock_number',
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
    	
    	var btnCreateTimeBegin = Ext.getCmp('btnDepartmentOutBegin').getValue();
    	var btnCreateTimeEnd = Ext.getCmp('btnDepartmentOutEnd').getValue();
    	var btnDepartmentOutTime = Ext.getCmp('btnDepartmentOutTime').getValue();
    	if(btnDepartmentOutTime==1){ //今日
    		btnCreateTimeBegin = new Date();
    		btnCreateTimeEnd =new Date();
    	}else if(btnDepartmentOutTime==2){//昨日
    		btnCreateTimeBegin = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
        	btnCreateTimeEnd = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
    	}else if(btnDepartmentOutTime==3){ //本月
    		btnCreateTimeBegin = Ext.Date.getFirstDateOfMonth(new Date());
        	btnCreateTimeEnd = Ext.Date.getLastDateOfMonth(new Date());
    	}else if(btnDepartmentOutTime==4){//上月
    		btnCreateTimeBegin = Ext.Date.add(Ext.Date.getFirstDateOfMonth(new Date()), Ext.Date.MONTH, -1);
        	btnCreateTimeEnd = Ext.Date.getLastDateOfMonth(btnCreateTimeBegin);
    	}
    	
    	
    	
    	
    	var proxy = this.store.getProxy(); 
        proxy.extraParams['beginTimeStr'] = Ext.Date.format(btnCreateTimeBegin, 'Y-m-d'); 
        proxy.extraParams['endTimeStr'] = Ext.Date.format(btnCreateTimeEnd, 'Y-m-d');
        
    	this.store.load();
    }
});