Ext.define('MyApp.view.MyOutStock', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyOutStock',
    store: 'MyOutStockStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'outStockQuery',
    layout: {
        type: 'border'
    },
    title: '出库明细',
    
    features: [{
        ftype: 'summary',
        dock: 'bottom'
    }],
    
    stockStore:Ext.create('MyApp.store.MyStockStore'),
    departmentStore:Ext.create('MyApp.store.MyDepartmentStore'),
    staffStore:Ext.create('MyApp.store.MyStaffStore'),  
    	
    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                store: 'MyOutStockStore',
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
                    id: 'btnCreateTimeBegin',
                    format: 'Y-m-d',
                    value:new Date()
                },{
                    xtype: 'label',
                    text: '到'
                },
                {
                    xtype: 'datefield',
                    id: 'btnCreateTimeEnd',
                    format: 'Y-m-d',
                    value:new Date()
                },{
                    xtype: 'label',
                    text: '物品'
                },
                {
                	id: 'btnOutStock',
                	xtype: 'combo',
                    store:Ext.create('store.MyStockStore'),
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
                    xtype: 'label',
                    text: '部门'
                },
                {
                	id: 'btnOutDepartment',
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
                    text: 'autoSync',
                    enableToggle: true,
                    pressed: true,
                    tooltip: 'When enabled, Store will execute Ajax requests as soon as a Record becomes dirty.',
                    scope: this,
                    toggleHandler: function(btn, pressed){
                        this.store.autoSync = pressed;
                    }
                }, {
                    text: 'batch',
                    enableToggle: true,
                    pressed: true,
                    tooltip: 'When enabled, Store will batch all records for each type of CRUD verb into a single Ajax request.',
                    scope: this,
                    toggleHandler: function(btn, pressed){
                        this.store.getProxy().batchActions = pressed;
                    }
                }, {
                    text: 'writeAllFields',
                    enableToggle: true,
                    pressed: false,
                    tooltip: 'When enabled, Writer will write *all* fields to the server -- not just those that changed.',
                    scope: this,
                    toggleHandler: function(btn, pressed){
                        this.store.getProxy().getWriter().writeAllFields = pressed;
                    }
                }]
            }, {
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
                 width: 58,
                 itemId:'outStock_id',
                 dataIndex: 'id',
                 text: '编号',
                 sortable: true,
                 summaryType: 'count',
                 summaryRenderer: function (value, summaryData, dataIndex) {
                     return '总数'+value;
                 }
            },{
	           	 xtype: 'datecolumn',
	             width: 100,
	             itemId:'outStock_createDate',
	             dataIndex: 'createDate',
	             text: '出库时间',
	             sortable: true,
	             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
	        }, {
	            header: "物品",
	            itemId:'outStock_stock',
	            dataIndex: 'stock',
	            width:100,
	            hidden: false,
	            renderer:function(value,metadata,record,store){
	            	var kvstore =  this.stockStore;
	            	var index = kvstore.find('id',value);
	            	var record = kvstore.getAt(index).get('name');
	            	return record; 
	            }
		     }, {
	            header: "出库部门",
	            itemId:'outStock_department',
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
	                			//获得选择的编辑行
	                			var selected = Ext.getCmp('outStockQuery').getView().getSelectionModel().getSelection()[0];
	                			//设置改行的city列为空
	                			selected.set("staff", "1");
		                		//找到该列的控件
	                			var cmbStaff = Ext.getCmp("gridStaff");
	                			//过滤控件的数据源
	                			filed.store.filterBy(function (item) {
	                				return item.get("department") == newValue;
	                			});
	                		}
	                	}
	                }
	            })
		     }, {
	            header: "出库人",
	            itemId:'outStock_staff',
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
		         width: 100,
		         itemId:'outStock_number',
		         dataIndex: 'number',
		         text: '出库数量',
		         sortable: true,
		         field: {
                     type: 'numberfield',
                     allowBlank:false, 
                     blankText:'该项不能为空!',
                 },
                 summaryType: 'sum'
		    },{
			   	 xtype: 'gridcolumn',
			     width: 100,
			     itemId:'outStock_worth',
			     dataIndex: 'worth',
			     text: '总金额',
			     sortable: true,
                 summaryType: 'sum'
			}]
        });
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    
    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
    },

    onSync: function(){
    	var me = this;
    	me.store.getProxy().extraParams.method = 'update';
    	me.store.sync({
            success: function(e, opt) {
            	if(opt.batch.proxy.reader.jsonData.success==true){
            		var me = this;
            		me.store.commitChanges(); //commit 承诺。提交
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
            	 Ext.Msg.alert("错误", e.exceptions[0].error.statusText);
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

    onAddClick: function(){
        var rec = new MyApp.model.OutStockData({
        	  'id':'',
        	  'stock':'',
        	  'department':'',
        	  'staff':'',
        	  'number':'',
        	  'worth':''
        	 }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 1
        });
    },
    
    onQueryClick:function(){
    	
    	var btnCreateTimeBegin = Ext.getCmp('btnCreateTimeBegin').getValue();
    	var btnCreateTimeEnd = Ext.getCmp('btnCreateTimeEnd').getValue();

    	var btnOutDepartment = Ext.getCmp('btnOutDepartment').getValue();
    	var btnOutStock = Ext.getCmp('btnOutStock').getValue();
    	
    	
    	var proxy = this.store.getProxy(); 
        proxy.extraParams['beginTimeStr'] = Ext.Date.format(btnCreateTimeBegin, 'Y-m-d'); 
        proxy.extraParams['endTimeStr'] = Ext.Date.format(btnCreateTimeEnd, 'Y-m-d');
        proxy.extraParams['department'] = btnOutDepartment; 
        proxy.extraParams['stock'] = btnOutStock; 
        
    	this.store.load();
    }
});