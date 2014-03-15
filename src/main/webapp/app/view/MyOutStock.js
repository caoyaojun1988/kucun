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
    
    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.CellEditing',{
        	 clicksToEdit: 1,
        	 	listeners: {
        	 		beforeEdit: function (editor, e) {
        	 			if (e.field == "staff") {
        	 				//编辑之前，过滤下市的数据源
        	 				var department = e.record.get("department");
        	 				var myStaffStore =  Ext.data.StoreManager.get('MyStaffStore');
        	 				myStaffStore.clearFilter();
        	 				myStaffStore.filterBy(function (item) {
        	 					return item.get("department") == department;
        	 				});
        	 			}
        	 		}
        	 	} 
        });

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
                	iconCls: 'icon-query',
                	text: '查询',
                	disabled: false,
                	itemId: 'btnQry',
                	scope: this,
                    handler: this.onQueryClick
                }]
            }, {
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
            columns: [{
            	 xtype: 'gridcolumn',
                 width: 58,
                 dataIndex: 'id',
                 text: '编号',
                 sortable: true
            }, {
	            header: "物品",
	            dataIndex: 'stock',
	            width:100,
	            hidden: false,
	            renderer:function(value,metadata,record,store){
	            	var kvstore =  Ext.data.StoreManager.get('MyStockStore');
	            	var index = kvstore.find('id',value);
	            	var record = kvstore.getAt(index).get('name');
	            	return record; 
	            }
//	            editor: new Ext.form.ComboBox({
//	                store: 'MyStockStore',
//	                triggerAction: 'all',
//	                displayField: 'name',
//	                valueField: 'id',
//	                allowBlank: false,
//	                editable: false,
//	                mode: 'local'
//	            })
		     }, {
	            header: "出库部门",
	            dataIndex: 'department',
	            hidden: false,
	            width:100,
	            renderer:function(value,metadata,record,store){
	            	var kvstore =  Ext.data.StoreManager.get('MyDepartmentStore');
	            	var index = kvstore.find('id',value);
	            	var record = kvstore.getAt(index).get('name');
	            	return record; 
	            },
	            editor: new Ext.form.ComboBox({
	                store: 'MyDepartmentStore',
	                triggerAction: 'all',
	                displayField: 'name',
	                valueField: 'id',
	                allowBlank: false,
	                editable: false,
	                mode: 'local',
	                listeners: {
	                	change: function (filed, newValue, oldValue, op) {
	                		if (newValue != oldValue) {
	                			//获得选择的编辑行
	                			var selected = Ext.getCmp('outStockQuery').getView().getSelectionModel().getSelection()[0];
	                			//设置改行的city列为空
	                			selected.set("staff", "1");
		                		//找到该列的控件
	                			var cmbStaff = Ext.getCmp("gridStaff");
	                			//过滤控件的数据源
	                			var myStaffStore =  Ext.data.StoreManager.get('MyStaffStore');
	                			myStaffStore.clearFilter();
	                			myStaffStore.filterBy(function (item) {
	                				return item.get("department") == newValue;
	                			});
	                		}
	                	}
	                }
	            })
		     }, {
	            header: "出库人",
	            dataIndex: 'staff',
	            width:100,
	            hidden: false,
	            renderer:function(value,metadata,record,store){
	            	var kvstore =  Ext.data.StoreManager.get('MyStaffStore');
	            	var index = kvstore.find('id',value);
	            	var record = kvstore.getAt(index).get('name');
	            	return record; 
	            },
	            editor: new Ext.form.ComboBox({
	            	id:'gridStaff',
	                store: 'MyStaffStore',
	                triggerAction: 'all',
	                displayField: 'name',
	                valueField: 'id',
	                allowBlank: false,
	                editable: false,
	                mode: 'local'
	            })
		     },{
		       	 xtype: 'gridcolumn',
		         width: 100,
		         dataIndex: 'number',
		         text: '出库数量',
		         sortable: true,
		         field: {
                     type: 'numberfield',
                     allowBlank:false, 
                     blankText:'该项不能为空!',
                 }
		    },{
			   	 xtype: 'gridcolumn',
			     width: 100,
			     dataIndex: 'worth',
			     text: '总价格',
			     sortable: true
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
        	  'stock':'1',
        	  'department':'1',
        	  'staff':'1',
        	  'number':'0',
        	  'worth':'0'
        	 }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 1
        });
    },
    
    onQueryClick:function(){
    	this.store.load();
    }
});