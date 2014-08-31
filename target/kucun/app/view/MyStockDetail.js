Ext.define('MyApp.view.MyStockDetail', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyStockDetail',
    store: 'MyStockDetailStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'stockDetailQuery',
    layout: {
        type: 'border'
    },
    title: '明细',
    
    initComponent: function(){

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
            columns: [new Ext.grid.RowNumberer({width: 50}),{
	            header: "物品编号",
	            itemId:'stockDetail_stockid',
	            dataIndex: 'stockId',
	            width:100,
	            hidden: false
		     },{
	           	 xtype: 'datecolumn',
	             width: 100,
	             itemId:'stockDetail_createDate',
	             dataIndex: 'createDate',
	             text: '时间',
	             sortable: true,
	             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
	        },{
	            header: "订单编号",
	            itemId:'stockDetail_orderId',
	            dataIndex: 'orderId',
	            width:100,
	            hidden: false
		     },{
		       	 xtype: 'gridcolumn',
		         width: 100,
		         itemId:'stockDetail_inOrOut',
		         dataIndex: 'inOrOut',
		         text: '出库OR入库',
		         sortable: true,
		         renderer:function(value){
		        	 if(value=='1'){
		        		 return '入库';
		        	 }else{
		        		 return '出库';
		        	 }
		         }
		    },{
		       	 xtype: 'gridcolumn',
		         width: 100,
		         itemId:'stockDetail_number',
		         dataIndex: 'number',
		         text: '数量',
		         sortable: true
		    },{
			   	 xtype: 'gridcolumn',
			     width: 100,
			     itemId:'stockDetail_remainderNumber',
			     dataIndex: 'remainderNumber',
			     text: '结余数量',
			     sortable: true
			}]
        });
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    onSelectChange: function(selModel, selections){
    	if(Ext.getCmp('win')){
    		Ext.getCmp('win').destroy();
    	}
        if(selections && selections.length>0){
        	
        	
    		var id = selections[0].get('orderId');
    		var simple;
    		var order;
    		if(selections[0].get('inOrOut')=='1'){
    			var store= Ext.create('MyApp.store.MyInStockStore');
    			var myInStockOrderStore= Ext.create('MyApp.store.MyInStockOrderStore');

    			var stockStore=Ext.data.StoreManager.get('MyStockStore');
    			
    			var departmentStore=Ext.create('MyApp.store.MyDepartmentStore');
    			var staffStore=Ext.create('MyApp.store.MyStaffStore');
 			    
    			// 订单
    			order=Ext.create('Ext.grid.Panel',{
    			    store: myInStockOrderStore,
    			    requires: [
    			        'Ext.grid.plugin.CellEditing',
    			        'Ext.form.field.Text',
    			        'Ext.toolbar.TextItem'
    			    ],

    			    itemId: 'stockDetailOrderQuery',
    			    layout: {
    			        type: 'border'
    			    },
    			    title: '入库订单',
    			    
    			    features: [{
    			        ftype: 'summary',
    			        dock: 'bottom'
    			    }],
    			    
		            columns: [new Ext.grid.RowNumberer({width: 50}),{
			            	 xtype: 'gridcolumn',
			                 width: 200,
			                 itemId:'stockDetailOrder_id',
			                 dataIndex: 'id',
			                 text: '订单号',
			                 sortable: true,
			                 summaryType: 'count',
			                 summaryRenderer: function (value, summaryData, dataIndex) {
			                     return '总数'+value;
			                 }
			            },{
				           	 xtype: 'datecolumn',
				             width: 100,
				             itemId:'stockDetailOrder_createDate',
				             dataIndex: 'createDate',
				             text: '创建时间',
				             sortable: true,
				             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
				        },{
					       	 xtype: 'datecolumn',
					         width: 100,
					         itemId:'stockDetailOrder_modifyDate',
					         dataIndex: 'modifyDate',
					         text: '修改时间',
					         sortable: true,
					         renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
				        },{
				            header: "部门",
				            itemId:'stockDetailOrder_department',
				            dataIndex: 'department',
				            hidden: false,
				            width:100,
				            renderer:function(value,metadata,record,store){
				            	var index = departmentStore.find('id',value);
				            	var record = departmentStore.getAt(index).get('name');
				            	return record; 
				            },
					     }, 
				        {
				            header: "出库人",
				            itemId:'stockDetailOrder_staff',
				            dataIndex: 'staff',
				            width:100,
				            hidden: false,
				            renderer:function(value,metadata,record,store){
				            	var index = staffStore.find('id',value);
				            	var record = staffStore.getAt(index).get('name');
				            	return record; 
				            },
					     },{
				        	xtype: 'gridcolumn',
				        	text: "笔数",
				            itemId:'stockDetailOrder_stock',
				            dataIndex: 'totalNumber',
				            hidden: false,
				            width: 108
					     },{
					       	 xtype: 'gridcolumn',
					         width: 100,
					         itemId:'stockDetailOrder_number',
					         dataIndex: 'totalWorth',
					         text: '总金额',
					         sortable: true,
			                 summaryType: 'sum'
					    },{
						   	 xtype: 'gridcolumn',
						     width: 100,
						     itemId:'stockDetailOrder_status',
						     dataIndex: 'mark',
						     text: '备注',
						     sortable: true
						}]
    			});
    			
    			
    			// 定义表单
    			simple = Ext.create('Ext.grid.Panel',{
    				store: store,
    			    requires: [
			               'Ext.grid.plugin.CellEditing',
			               'Ext.form.field.Text',
			               'Ext.toolbar.TextItem'
			           ],

    			    itemId: 'stockDetailForOrderQuery',
    			    layout: {
    			        type: 'border'
    			    },
    			    title: '订单明细',
    			    
    			    features: [{
    			        ftype: 'summary',
    			        dock: 'bottom'
    			    }],
    			    columns: [new Ext.grid.RowNumberer({width: 50}),{
	   	            	 xtype: 'gridcolumn',
	   	                 width: 58,
	   	                 itemId:'stockDetailForOrder_id',
	   	                 dataIndex: 'id',
	   	                 text: '编号',
	   	                 sortable: true,
	   	                 hidden: true
	   	            },{
	   		            header: "物品编号",
	   		            itemId:'stockDetailForOrder_stockid',
	   		            dataIndex: 'stock',
	   		            hidden: false,
	   		            width: 108,
	   		            summaryType: 'count',
	   		            summaryRenderer: function (value, summaryData, dataIndex) {
	   	                     return '总数'+value;
	   	                 }
	   			     },{
	   		           	 xtype: 'datecolumn',
	   		             width: 100,
	   		             itemId:'stockDetailForOrder_createDate',
	   		             dataIndex: 'createDate',
	   		             text: '创建时间',
	   		             sortable: true,
	   		             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
	   		        },{
	   			       	 xtype: 'datecolumn',
	   			         width: 100,
	   			         itemId:'stockDetailForOrder_modifyDate',
	   			         dataIndex: 'modifyDate',
	   			         text: '修改时间',
	   			         sortable: true,
	   			         renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
	   		        }, {
	   		            header: "物品",
	   		            itemId:'stockDetailForOrder_stock',
	   		            dataIndex: 'stock',
	   		            hidden: false,
	   		            width: 108,
	   		            renderer:function(value,metadata,record,store){
	   		            	var index = stockStore.find('id',value);
	   		            	var record = stockStore.getAt(index).get('name');
	   		            	return record; 
	   		            }
	   			     },{
	   			       	 xtype: 'gridcolumn',
	   			         width: 100,
	   			         itemId:'stockDetailForOrder_number',
	   			         dataIndex: 'number',
	   			         text: '入库数量',
	   			         sortable: true,
	   	                 summaryType: 'sum'
	   			    },{
	   				   	 xtype: 'gridcolumn',
	   				     width: 100,
	   				     itemId:'stockDetailForOrder_worth',
	   				     dataIndex: 'worth',
	   				     text: '单价',
	   				     sortable: true
	   				},{
	   				   	 xtype: 'gridcolumn',
	   				     width: 100,
	   				     itemId:'stockDetailForOrder_totalWorth',
	   				     dataIndex: 'totalWorth',
	   				     text: '总金额',
	   				     sortable: true
	   				},{
	   				   	 xtype: 'gridcolumn',
	   				     width: 100,
	   				     itemId:'stockDetailForOrder_status',
	   				     dataIndex: 'status',
	   				     text: '状态',
	   				     sortable: true
	   				}]
    			});
    		}else{
    			 var store= Ext.create('MyApp.store.MyOutStockStore');
    			 var MyOutStockOrderStore = Ext.create('MyApp.store.MyOutStockOrderStore');

    			 var stockStore = Ext.data.StoreManager.get('MyStockStore');
    			 
    			 var departmentStore=Ext.create('MyApp.store.MyDepartmentStore');
    			 var staffStore= Ext.create('MyApp.store.MyStaffStore');
    			 // 订单
    			// 定义表单
     			order = Ext.create('Ext.grid.Panel',{

     			    store: MyOutStockOrderStore,
     			    requires: [
     			        'Ext.grid.plugin.CellEditing',
     			        'Ext.form.field.Text',
     			        'Ext.toolbar.TextItem'
     			    ],

     			    itemId: 'stockDetailOrderQuery',
     			    
     			    layout: {
     			        type: 'border'
     			    },
     			    
     			    title: '出库订单',
     			    
     			    features: [{
     			        ftype: 'summary',
     			        dock: 'bottom'
     			    }],
     			   
		            columns: [new Ext.grid.RowNumberer({width: 50}),{
		            	 xtype: 'gridcolumn',
		                 width: 200,
		                 itemId:'stockDetailOrderQuery_id',
		                 dataIndex: 'id',
		                 text: '订单号',
		                 sortable: true,
		                 summaryType: 'count',
		                 summaryRenderer: function (value, summaryData, dataIndex) {
		                     return '总数'+value;
		                 }
		            },{
			           	 xtype: 'datecolumn',
			             width: 100,
			             itemId:'stockDetailOrderQuery_createDate',
			             dataIndex: 'createDate',
			             text: '创建时间',
			             sortable: true,
			             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
			        },{
			           	 xtype: 'datecolumn',
			             width: 100,
			             itemId:'stockDetailOrderQuery_modifyDate',
			             dataIndex: 'modifyDate',
			             text: '修改时间',
			             sortable: true,
			             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
			        },{
			            header: "出库部门",
			            itemId:'stockDetailOrderQuery_department',
			            dataIndex: 'department',
			            hidden: false,
			            width:100,
			            renderer:function(value,metadata,record,store){
			            	var index = departmentStore.find('id',value);
			            	var record = departmentStore.getAt(index).get('name');
			            	return record; 
			            }
				     },{
			            header: "出库人",
			            itemId:'stockDetailOrderQuery_staff',
			            dataIndex: 'staff',
			            width:100,
			            hidden: false,
			            renderer:function(value,metadata,record,store){
			            	var index = staffStore.find('id',value);
			            	var record = staffStore.getAt(index).get('name');
			            	return record; 
			            }
				     },{
				       	 xtype: 'gridcolumn',
				         width: 100,
				         itemId:'stockDetailOrderQuery_number',
				         dataIndex: 'totalNumber',
				         text: '笔数',
				         sortable: true,
		                 summaryType: 'sum'
				    },{
					   	 xtype: 'gridcolumn',
					     width: 100,
					     itemId:'stockDetailOrderQuery_worth',
					     dataIndex: 'totalWorth',
					     text: '总金额',
					     sortable: true,
		                 summaryType: 'sum'
					},{
					   	 xtype: 'gridcolumn',
					     width: 100,
					     itemId:'stockDetailOrderQuery_mark',
					     dataIndex: 'mark',
					     text: '备注',
					     sortable: true
					}]
     			       
     			});
    			 
        		// 定义表单
    			simple = Ext.create('Ext.grid.Panel',{
    				store: store,
    			    requires: [
    			        'Ext.grid.plugin.CellEditing',
    			        'Ext.form.field.Text',
    			        'Ext.toolbar.TextItem'
    			    ],

    			    itemId: 'stockDetailForOrderQuery',
    			    layout: {
    			        type: 'border'
    			    },
    			    title: '订单明细',
    			    
    			    features: [{
    			        ftype: 'summary',
    			        dock: 'bottom'
    			    }],
    			    
    			    stockStore:stockStore,
    			    	
    		 
    	            columns: [new Ext.grid.RowNumberer({width: 50}),{
    		            header: "物品编号",
    		            itemId:'stockDetailForOrder_stockid',
    		            dataIndex: 'stock',
    		            width:100,
    		            hidden: false,
    	                summaryType: 'count',
    		            summaryRenderer: function (value, summaryData, dataIndex) {
    	                    return '总数'+value;
    	                }
    			     },{
    		           	 xtype: 'datecolumn',
    		             width: 100,
    		             itemId:'stockDetailForOrder_createDate',
    		             dataIndex: 'createDate',
    		             text: '出库时间',
    		             sortable: true,
    		             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
    		        }, {
    		            header: "物品",
    		            itemId:'outStockDetail_stock',
    		            dataIndex: 'stock',
    		            width:100,
    		            hidden: false,
    		            renderer:function(value,metadata,record,store){
    		            	var index = stockStore.find('id',value);
    		            	var record = stockStore.getAt(index).get('name');
    		            	return record; 
    		            }
    			     },{
    			       	 xtype: 'gridcolumn',
    			         width: 100,
    			         itemId:'stockDetailForOrder_number',
    			         dataIndex: 'number',
    			         text: '出库数量',
    			         sortable: true,
    	                 summaryType: 'sum'
    			    },{
    				   	 xtype: 'gridcolumn',
    				     width: 100,
    				     itemId:'stockDetailForOrder_worth',
    				     dataIndex: 'worth',
    				     text: '总金额',
    				     sortable: true,
    	                 summaryType: 'sum'
    				}]
    			});
    		}
    			
			var proxy = simple.store.getProxy(); 
            proxy.extraParams['orderId'] = id; 
            simple.store.load();
            
            var orderProxy = order.store.getProxy(); 
            orderProxy.extraParams['orderId'] = id; 
            order.store.load();
    		// 定义窗体
			var win = new Ext.Window({
				id : 'win',
				layout : 'fit', // 自适应布局
				align : 'center',
				width : 630,
				height : 482,
				resizable : true,
				draggable : true,
				border : false,
				maximizable : false, 
				closeAction : 'destroy',
				closable : true, 
				layout: {
			        type: 'accordion',
			        multi:true
			    },
				items : [order,simple]
			});
			win.show();// 显示窗体
    	};
    },
});
