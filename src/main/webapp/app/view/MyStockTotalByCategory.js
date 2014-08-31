Ext.define('MyApp.view.MyStockTotalByCategory', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyStockTotalByCategory',
    store: 'MyStockTotalStore',
    
    requires: [
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'stockTotalByCategoryQuery',
    layout: {
        type: 'border'
    },
    title: '类目汇总',
    
    features: [{
        ftype: 'summary',
        dock: 'bottom'
    }],
    
    categoryStore:Ext.create('MyApp.store.MyCategoryStore'),
    initComponent: function(){


        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
            dockedItems: [{
                xtype: 'toolbar',
                items: [{
                    xtype: 'label',
                    text: '从'
                },
                {
                    xtype: 'datefield',
                    id: 'btnstockTotalByCategoryBegin',
                    format: 'Y-m-d',
                    value:new Date(),
                    listeners: {
	                	change: function (filed, newValue, oldValue, op) {
                			var btnInOrderTime = Ext.getCmp('btnstockTotalByCategoryTime');
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
                    id: 'btnstockTotalByCategoryEnd',
                    format: 'Y-m-d',
                    value:new Date(),
                    listeners: {
	                	change: function (filed, newValue, oldValue, op) {
                			var btnInOrderTime = Ext.getCmp('btnstockTotalByCategoryTime');
                			btnInOrderTime.setValue("0");
	                	}
	                }
                },{
                	id:'btnstockTotalByCategoryTime',
                	xtype: 'combo',
                    fieldLabel: '快捷时间',
                    anchor: '100%',
                    store:'MyQuictTimeStore',
                    value:'0',
                    valueField: 'id',
                    displayField: 'name'
           	
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
		            header: "类目名称",
		            itemId:'stockTotalByCategory_categoryName',
		            dataIndex: 'category',
		            hidden: false,
		            width: 108,
		            renderer:function(value,metadata,record,store){
		            	var kvstore =  this.categoryStore;
		            	var index = kvstore.find('id',value);
		            	var record = kvstore.getAt(index).get('name');
		            	return record; 
		            }
				 },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         itemId:'stockTotalByCategory_number',
			         dataIndex: 'stockNumber',
			         text: '物品种类',
			         sortable: true
			    },{
			    	 text:"入库信息",
			    	 columns:[{
							  	 xtype: 'gridcolumn',
							    width: 100,
							    itemId:'stockTotalByCategory_instockNumber',
							    dataIndex: 'inStockNumber',
							    text: '笔数',
							    sortable: true,
							    summaryType: 'sum'
							},{
							  	 xtype: 'gridcolumn',
							    width: 100,
							    itemId:'stockTotalByCategory_instockWorth',
							    dataIndex: 'inStockWorth',
							    text: '金额',
							    sortable: true,
							    summaryType: 'sum'
							}]
			    },{
			    	text:"出库信息",
			    	columns:[{
					   	 xtype: 'gridcolumn',
					     width: 100,
					     itemId:'stockTotalByCategory_outStockNumber',
					     dataIndex: 'outStockNumber',
					     text: '笔数',
					     sortable: true,
		                 summaryType: 'sum'
					},{
					   	 xtype: 'gridcolumn',
					     width: 100,
					     itemId:'stockTotalByCategory_outStockWorth',
					     dataIndex: 'outStockWorth',
					     text: '金额',
					     sortable: true,
		                 summaryType: 'sum'
					}]
			    }]
        });
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    
    onQueryClick:function(){
    	var btnCreateTimeBegin = Ext.getCmp('btnstockTotalByCategoryBegin').getValue();
    	var btnCreateTimeEnd = Ext.getCmp('btnstockTotalByCategoryEnd').getValue();
    	var btnstockTotalByCategoryTime = Ext.getCmp('btnstockTotalByCategoryTime').getValue();
    	if(btnstockTotalByCategoryTime==1){ //今日
    		btnCreateTimeBegin = new Date();
    		btnCreateTimeEnd =new Date();
    	}else if(btnstockTotalByCategoryTime==2){//昨日
    		btnCreateTimeBegin = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
        	btnCreateTimeEnd = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
    	}else if(btnstockTotalByCategoryTime==3){ //本月
    		btnCreateTimeBegin = Ext.Date.getFirstDateOfMonth(new Date());
        	btnCreateTimeEnd = Ext.Date.getLastDateOfMonth(new Date());
    	}else if(btnstockTotalByCategoryTime==4){//上月
    		btnCreateTimeBegin = Ext.Date.add(Ext.Date.getFirstDateOfMonth(new Date()), Ext.Date.MONTH, -1);
        	btnCreateTimeEnd = Ext.Date.getLastDateOfMonth(btnCreateTimeBegin);
    	}
    	
    	
    	var proxy = this.store.getProxy(); 
        proxy.extraParams['beginTimeStr'] = Ext.Date.format(btnCreateTimeBegin, 'Y-m-d'); 
        proxy.extraParams['endTimeStr'] = Ext.Date.format(btnCreateTimeEnd, 'Y-m-d');
        
    	this.store.load();
    }
});
