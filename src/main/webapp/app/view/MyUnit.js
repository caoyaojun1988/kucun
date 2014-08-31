Ext.define('MyApp.view.MyUnit', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyUnit',
    store: 'MyUnitStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'unitQuery',
    layout: {
        type: 'border'
    },
    title: '单位维护',
    
    initComponent: function(){
    	Ext.QuickTips.init();
        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                store: 'MyUnitStore',
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
	             itemId:'unit_id',
	             dataIndex: 'id',
	             text: '编号',
	             hidden:false
	        }, {
            	 xtype: 'gridcolumn',
                 width: 235,
                 itemId:'unit_name',
                 dataIndex: 'name',
                 text: '单位名称',
                 sortable: true,
                 field: {
                    type: 'textfield',
                    allowBlank:false, 
                    blankText:'该项不能为空!',
                    validator:function(value){
                     	var kvstore = Ext.data.StoreManager.get('MyUnitStore');
                      	var index = kvstore.findExact('name',value);
                     	if(index >= 0){
                     		return 'name 重复';
                     	}else{
                     		return true; 
                     	}
                     }
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
        var rec = new MyApp.model.UnitData({
        	  'id':'',
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