Ext.define('MyApp.view.MyStaff', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyStaff',
    store: 'MyStaffStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.form.ComboBox'
    ],

    itemId: 'staffQuery',
    layout: {
        type: 'border'
    },
    title: '人员管理',
    
    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                store: 'MyStaffStore',
                items: [{
                    iconCls: 'icon-add',
                    text: 'Add',
                    scope: this,
                    handler: this.onAddClick
                }, {
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
            columns: [new Ext.grid.RowNumberer({width: 50}),{
            	 xtype: 'gridcolumn',
                 width: 40,
                 itemId:'staff_id',
                 dataIndex: 'id',
                 text: '编号',
                 hidden: false
            },{
	           	 header: "部门",
	           	itemId:'staff_department',
	             dataIndex: 'department',
	             hidden: false,
	             renderer:function(value,metadata,record,store){
	            	if(value==0){
		            	return "请选择";
		            }
	            	var kvstore =  Ext.data.StoreManager.get('MyDepartmentStore');
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
	        }, {
            	 xtype: 'gridcolumn',
                 width: 235,
                 itemId:'staff_name',
                 dataIndex: 'name',
                 text: '姓名',
                 sortable: true,
                 field: {
                    type: 'textfield',
                    allowBlank:false, 
                    blankText:'该项不能为空!'
                }
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
    	var isNeedSync=true;

    	me.store.each(function(record) {
    		if(!Ext.isNumeric(this.data.department) || this.data.department<=0){
    			Ext.Msg.alert('提示信息', "请选择部门");
    			isNeedSync=false;
    			return false;
    		}
    		if(Ext.isEmpty(this.data.name)){
    			Ext.Msg.alert('提示信息', "请填写名称");
    			isNeedSync=false;
    			return false;
    		}
    	});
    	
    	if(isNeedSync){
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
    	}
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            this.store.remove(selection);
        }
    },

    onAddClick: function(){
        var rec = new MyApp.model.StaffData({
        	  'id':'',
        	  'department':'',
        	  'name':''
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