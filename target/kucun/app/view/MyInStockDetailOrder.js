Ext.define('MyApp.view.MyInStockDetailOrder', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyInStockDetailOrder',
    store: 'MyInStockOrderStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'inStockDetailOrderQuery',
    layout: {
        type: 'border'
    },
    title: '入库订单',
    
    departmentStore:Ext.create('MyApp.store.MyDepartmentStore'),
    staffStore:Ext.create('MyApp.store.MyStaffStore'),  
    
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
                    iconCls: 'icon-delete',
                    text: 'Delete',
                    disabled: true,
                    itemId: 'delete',
                    scope: this,
                    handler: this.onDeleteClick
                },{
                    xtype: 'label',
                    text: '从'
                },
                {
                    xtype: 'datefield',
                    id: 'btnInOrderCreateTimeBegin',
                    format: 'Y-m-d',
                    value:new Date(),
                    listeners: {
	                	change: function (filed, newValue, oldValue, op) {
                			var btnInOrderTime = Ext.getCmp('btnInOrderTime');
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
                    id: 'btnInOrderCreateTimeEnd',
                    format: 'Y-m-d',
                    value:new Date(),
                    listeners: {
	                	change: function (filed, newValue, oldValue, op) {
                			var btnInOrderTime = Ext.getCmp('btnInOrderTime');
                			btnInOrderTime.setValue("0");
	                	}
	                }
                },{
                	id:'btnInOrderTime',
                	xtype: 'combo',
                    fieldLabel: '快捷时间',
                    anchor: '100%',
                    store:'MyQuictTimeStore',
                    value:'0',
                    valueField: 'id',
                    displayField: 'name'
                },{
                    xtype: 'label',
                    text: '部门'
                },{
                	id: 'btnInStockDetailOrderDepartment',
                	xtype: 'combo',
                    store:Ext.create('store.MyDepartmentStore'),
                    valueField: 'id',
                    displayField: 'name',
	                listeners: {
	                	beforequery:function(e){
	                        var combo = e.combo;
	                        if(!e.forceAll){
	                            var input = e.query;
	                            var regExp = new RegExp(".*" + input + ".*");  // 检索的正则
	                            combo.store.filterBy(function(record,id){
	                                var text = record.get("pinyinForName");
	                                return regExp.test(text);
	                            });
	                            combo.expand();
	                            return false;
	                        }
	                	}
	                }
                },{
                	iconCls: 'icon-query',
                	text: '查询',
                	disabled: false,
                	itemId: 'btnQry',
                	scope: this,
                    handler: this.onQueryClick
                }]
            },{
                weight: 2,
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    text: '自动同步',
                    enableToggle: true,
                    pressed: true,
                    tooltip: 'When enabled, Store will execute Ajax requests as soon as a Record becomes dirty.',
                    scope: this,
                    toggleHandler: function(btn, pressed){
                        this.store.autoSync = pressed;
                    }
                }, {
                    text: '批量同步',
                    enableToggle: true,
                    pressed: true,
                    tooltip: 'When enabled, Store will batch all records for each type of CRUD verb into a single Ajax request.',
                    scope: this,
                    toggleHandler: function(btn, pressed){
                        this.store.getProxy().batchActions = pressed;
                    }
                }, {
                    text: '同步所有字段',
                    enableToggle: true,
                    pressed: false,
                    tooltip: 'When enabled, Writer will write *all* fields to the server -- not just those that changed.',
                    scope: this,
                    toggleHandler: function(btn, pressed){
                        this.store.getProxy().getWriter().writeAllFields = pressed;
                    }
                }]
            },{
                weight: 1,
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                    iconCls: 'icon-save',
                    text: 'Sync',
                    scope: this,
                    handler: this.onSync
                }]
            }],
            columns: [new Ext.grid.RowNumberer({width: 50}),{
	            	 xtype: 'gridcolumn',
	                 width: 200,
	                 itemId:'inStockDetailOrder_id',
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
		             itemId:'inStockDetailOrder_createDate',
		             dataIndex: 'createDate',
		             text: '创建时间',
		             sortable: true,
		             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
		        },{
			       	 xtype: 'datecolumn',
			         width: 100,
			         itemId:'inStockDetailOrder_modifyDate',
			         dataIndex: 'modifyDate',
			         text: '修改时间',
			         sortable: true,
			         renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
		        },{
		            header: "部门",
		            itemId:'inStockDetailOrder_department',
		            dataIndex: 'department',
		            hidden: false,
		            width:100,
		            renderer:function(value,metadata,record,store){
		            	var kvstore =  this.departmentStore;
		            	var index = kvstore.find('id',value);
		            	var record = kvstore.getAt(index).get('name');
		            	return record; 
		            },
		            editor: new Ext.form.ComboBox({
		                store: Ext.create('store.MyDepartmentStore'),
		                triggerAction: 'all',
		                displayField: 'name',
		                valueField: 'id',
		                allowBlank: false,
		                editable: true,
		                mode: 'local',
		                triggerAction: 'all',
			            lastQuery: '',
		                listeners: {
		                	beforequery:function(e){
		                        var combo = e.combo;
		                        if(!e.forceAll){
		                            var input = e.query;
		                            var regExp = new RegExp(".*" + input + ".*");// 检索的正则
		                            combo.store.clearFilter();
		                            combo.store.filterBy(function(record,id){
		                                var text = record.get("pinyinForName"); // 得到每个record的项目名称值
		                                return regExp.test(text);
		                            });
		                            combo.expand();
		                            return false;
		                        }
		                	},
		                	change: function (filed, newValue, oldValue, op) {
		                		if (newValue != oldValue) {
		                			// 获得选择的编辑行
		                			var selected = Ext.getCmp('inStockDetailOrderQuery').getView().getSelectionModel().getSelection()[0];
		                			// 设置改行的city列为空
		                			selected.set("staff", "");
			                		// 找到该列的控件
		                			var cmbStaff = Ext.getCmp("inStockDetailOrder_staff");
		                			// 过滤控件的数据源
		                			filed.store.filterBy(function (item) {
		                				return item.get("department") == newValue;
		                			});
		                		}
		                	}
		                }
		            })
			     }, 
		        {
		            header: "出库人",
		            itemId:'inStockDetailOrder_staff',
		            dataIndex: 'staff',
		            width:100,
		            hidden: false,
		            renderer:function(value,metadata,record,store){
		            	var kvstore =  this.staffStore;
		            	var index = kvstore.find('id',value);
		            	var record = kvstore.getAt(index).get('name');
		            	return record; 
		            },
		            editor: new Ext.form.ComboBox({
		            	id:'gridStaff',
		                store: Ext.create('store.MyStaffStore'),
		                triggerAction: 'all',
		                displayField: 'name',
		                valueField: 'id',
		                allowBlank: false,
		                editable: true,
		                mode: 'local',
		                listeners: {
		                	beforequery:function(e){
		                        var combo = e.combo;
		                        if(!e.forceAll){
		                            var input = e.query;
		                            var regExp = new RegExp(".*" + input + ".*");  // 检索的正则
		                            combo.store.filterBy(function(record,id){
		                                var text = record.get("pinyinForName");
		                                return regExp.test(text);
		                            });
		                            combo.expand();
		                            return false;
		                        }
		                	}
		                }
		            })
			     },{
		        	xtype: 'gridcolumn',
		        	text: "笔数",
		            itemId:'inStockDetailOrder_stock',
		            dataIndex: 'totalNumber',
		            hidden: false,
		            width: 108
			     },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         itemId:'inStockDetailOrder_number',
			         dataIndex: 'totalWorth',
			         text: '总金额',
			         sortable: true,
	                 summaryType: 'sum'
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'inStockDetailOrder_status',
				     dataIndex: 'mark',
				     text: '备注',
				     sortable: true
				}]
        });
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    
    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
        
    	if(selections){
    		var id = selections[0].get('id');
    		
    		var store = Ext.getCmp('inStockDetailPanelId').items.items[1].store;
    		var proxy = store.getProxy(); 
            proxy.extraParams['orderId'] = id; 
        	store.load();
    	};
        
    },

    onSync: function(){
    	var me = this;
    
    	me.store.sync({
            success: function(e, opt) {
            	if(opt.batch.proxy.reader.jsonData.success==true){
            		var me = this;
            		me.store.commitChanges(); // commit 承诺。提交
            		me.store.load();
                    Ext.Msg.alert('提示信息', "保存成功"); 
            	}else{
            		this.store.rejectChanges();  
               	 	Ext.Msg.alert("错误", opt.batch.proxy.reader.jsonData.msg);
            	}
            },  
            failure: function(e, opt) {
            	 var me = this, msg = "";
            	 this.store.rejectChanges();
            	 if(e.exceptions[0].error==undefined){
            		 Ext.Msg.alert("错误", opt.batch.proxy.reader.jsonData.msg);
            	 }else            		 {
            		 Ext.Msg.alert("错误", e.exceptions[0].error.statusText);
           		 }
            },
            scope: me
    	});
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            this.store.remove(selection);
        }
    },

    onQueryClick:function(){
    	var btnCreateTimeBegin = Ext.getCmp('btnInOrderCreateTimeBegin').getValue();
    	var btnCreateTimeEnd = Ext.getCmp('btnInOrderCreateTimeEnd').getValue();
    	var btnInStockDetailOrderDepartment = Ext.getCmp('btnInStockDetailOrderDepartment').getValue();
    	var btnInOrderTime = Ext.getCmp('btnInOrderTime').getValue();
    	if(btnInOrderTime==1){ // 今日
    		btnCreateTimeBegin = new Date();
    		btnCreateTimeEnd =new Date();
    	}else if(btnInOrderTime==2){// 昨日
    		btnCreateTimeBegin = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
        	btnCreateTimeEnd = Ext.Date.add(new Date(), Ext.Date.DAY, -1);
    	}else if(btnInOrderTime==3){ // 本月
    		btnCreateTimeBegin = Ext.Date.getFirstDateOfMonth(new Date());
        	btnCreateTimeEnd = Ext.Date.getLastDateOfMonth(new Date());
    	}else if(btnInOrderTime==4){// 上月
    		btnCreateTimeBegin = Ext.Date.add(Ext.Date.getFirstDateOfMonth(new Date()), Ext.Date.MONTH, -1);
        	btnCreateTimeEnd = Ext.Date.getLastDateOfMonth(btnCreateTimeBegin);
    	}
    	
    	
    	var proxy = this.store.getProxy(); 
        proxy.extraParams['beginTimeStr'] = Ext.Date.format(btnCreateTimeBegin, 'Y-m-d'); 
        proxy.extraParams['endTimeStr'] = Ext.Date.format(btnCreateTimeEnd, 'Y-m-d');
        proxy.extraParams['department'] = btnInStockDetailOrderDepartment; 
        
    	this.store.load();
    }
});
