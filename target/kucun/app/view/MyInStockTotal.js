Ext.define('MyApp.view.MyInStockTotal', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyInStockTotal',
    store: 'MyInStockTotalStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'inStockTotalQuery',
    layout: {
        type: 'border'
    },
    title: '入库汇总',
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
                    id: 'btnQeryInTotalBegin',
                    format: 'Y-m-d',
                    value:new Date(),
                    listeners: {
	                	change: function (filed, newValue, oldValue, op) {
                			var btnInOrderTime = Ext.getCmp('btnQueryInTotalTime');
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
                    id: 'btnQeryInTotalEnd',
                    format: 'Y-m-d',
                    value:new Date(),
                    listeners: {
	                	change: function (filed, newValue, oldValue, op) {
                			var btnInOrderTime = Ext.getCmp('btnQueryInTotalTime');
                			btnInOrderTime.setValue("0");
	                	}
	                }
                },{
                	id:'btnQueryInTotalTime',
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
		            header: "物品编号",
		            itemId:'inStockTotal_sotck',
		            dataIndex: 'stock',
		            hidden: false,
		            width: 108,
		             summaryType: 'count',
	                 summaryRenderer: function (value, summaryData, dataIndex) {
	                     return '总数'+value;
	                 }
			     },{
		            header: "物品名称",
		            itemId:'inStockTotal_sotckName',
		            dataIndex: 'stockName',
		            hidden: false,
		            width: 108
				 },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         itemId:'inStockTotal_sotckSepcification',
			         dataIndex: 'stockSpecification',
			         text: '物品规格',
			         sortable: true
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'inStockTotal_sotckUnit',
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
			         itemId:'inStockTotal_sotckNymber',
			         dataIndex: 'stockNumber',
			         text: '数量',
			         sortable: true,
	                 summaryType: 'sum'
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'inStockTotal_sotckWorth',
				     dataIndex: 'stockWorth',
				     text: '金额',
				     sortable: true,
	                 summaryType: 'sum'
				},{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'inStockTotal_number',
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
    	var btnCreateTimeBegin = Ext.getCmp('btnQeryInTotalBegin').getValue();
    	var btnCreateTimeEnd = Ext.getCmp('btnQeryInTotalEnd').getValue();
    	var btnQueryInTotalTime = Ext.getCmp('btnQueryInTotalTime').getValue();
    	if(btnQueryInTotalTime==1){ //今日
    		btnCreateTimeBegin = new Date();
    		btnCreateTimeEnd =new Date();
    	}else if(btnQueryInTotalTime==2){//昨日
    		btnCreateTimeBegin = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
        	btnCreateTimeEnd = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
    	}else if(btnQueryInTotalTime==3){ //本月
    		btnCreateTimeBegin = Ext.Date.getFirstDateOfMonth(new Date());
        	btnCreateTimeEnd = Ext.Date.getLastDateOfMonth(new Date());
    	}else if(btnQueryInTotalTime==4){//上月
    		btnCreateTimeBegin = Ext.Date.add(Ext.Date.getFirstDateOfMonth(new Date()), Ext.Date.MONTH, -1);
        	btnCreateTimeEnd = Ext.Date.getLastDateOfMonth(btnCreateTimeBegin);
    	}
    	
    	
    	var proxy = this.store.getProxy(); 
        proxy.extraParams['beginTimeStr'] = Ext.Date.format(btnCreateTimeBegin, 'Y-m-d'); 
        proxy.extraParams['endTimeStr'] = Ext.Date.format(btnCreateTimeEnd, 'Y-m-d');
        
    	this.store.load();
    }
});