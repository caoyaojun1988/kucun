Ext.define('MyApp.view.MyStock', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyStock',
    store: 'MyStockStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'stockQuery',
    layout: {
        type: 'border'
    },
    title: '库存',
    
    initComponent: function(){
    	Ext.QuickTips.init();
        this.editing = Ext.create('Ext.grid.plugin.CellEditing',{
          	 clicksToEdit: 1,
          	 listeners: {
    	 		beforeEdit: function (editor, e) {
    	 			if (e.field == "stock") {
    	 				//编辑之前，过滤下市的数据源
    	 				var category = Ext.getCmp('inStockPanelId').form.findField('category').value;
    	 				var myStockStore =  Ext.data.StoreManager.get('MyStockStore');
    	 				myStockStore.clearFilter();
    	 				myStockStore.filterBy(function (item) {
    	 					return item.get("category") == category;
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
                store: 'MyStockStore',
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
            columns: [{
	           	 xtype: 'gridcolumn',
	             width: 208,
	             dataIndex: 'uid',
	             text: '编号',
	             hidden:true
	        },{
            	 xtype: 'gridcolumn',
                 width: 108,
                 dataIndex: 'id',
                 text: '编号',
                 sortable: true,
                 field: {
                     type: 'numberfield',
                     allowBlank:false, 
                     blankText:'该项不能为空!',
                     validator:function(value){
                    	var kvstore =  Ext.data.StoreManager.get('MyStockStore');
                     	var index = kvstore.findExact('id',value);
                    	if(index >= 0){
                    		return 'ID 重复';
                    	}else{
                    		return true; 
                    	}
                    }
                 }
            }, {
	            header: "类目",
	            dataIndex: 'category',
	            hidden: false,
	            renderer:function(value,metadata,record,store){
	            	if(value==0){
	            		return "请选择";
	            	}
	            	var kvstore =  Ext.data.StoreManager.get('MyCategoryStore');
	            	var index = kvstore.find('id',value);
	            	var record = kvstore.getAt(index).get('name');
	            	return record; 
	            },
	            editor: new Ext.form.ComboBox({
	                store: 'MyCategoryStore',
	                triggerAction: 'all',
	                displayField: 'name',
	                valueField: 'id',
	                allowBlank: false,
	                editable: false,
	                mode: 'local'
	            })
		     },{
            	 xtype: 'gridcolumn',
                 width: 135,
                 dataIndex: 'name',
                 text: '名称',
                 sortable: true,
                 field: {
                    type: 'textfield',
                    allowBlank:false, 
                    blankText:'该项不能为空!',
                    validator:function(value){
                   	var kvstore =  Ext.data.StoreManager.get('MyStockStore');
                    	var index = kvstore.findExact('name',value);
                   	if(index >= 0){
                   		return 'name 重复';
                   	}else{
                   		return true; 
                   	}
                   }
                }
             },{
		       	 xtype: 'gridcolumn',
		         width: 135,
		         dataIndex: 'specification',
		         text: '规格',
		         sortable: true,
		         field: {
	                    type: 'textfield',
	                }
		    },{
		    	header: "单位",
	            dataIndex: 'unit',
	            hidden: false,
	            renderer:function(value,metadata,record,store){
	            	if(value==0){
	            		return "请选择";
	            	}
	            	var kvstore =  Ext.data.StoreManager.get('MyUnitStore');
	            	var index = kvstore.find('id',value);
	            	var record = kvstore.getAt(index).get('name');
	            	return record; 
	            },
	            editor: new Ext.form.ComboBox({
	                store: 'MyUnitStore',
	                triggerAction: 'all',
	                displayField: 'name',
	                valueField: 'id',
	                allowBlank: false,
	                editable: false,
	                mode: 'local'
	            })
		    },{
		       	 xtype: 'gridcolumn',
		         width: 135,
		         dataIndex: 'number',
		         text: '库存数量',
		         sortable: true
		    }, {
			   	 xtype: 'gridcolumn',
			     width: 135,
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
    	
    	var isNeedSync=true;
    	
    	me.store.each(function(record) {
    		if(isNaN(this.data.id) || this.data.id<=0){
    			Ext.Msg.alert('提示信息', "请check ID");
    			isNeedSync=false;
    			return false;
    		}
    		if(isNaN(this.data.category) || this.data.category<=0){
    			Ext.Msg.alert('提示信息', "请选择类目");
    			isNeedSync=false;
    			return false;
    		}
    		if(Ext.isEmpty(this.data.name)){
    			Ext.Msg.alert('提示信息', "请填写名称");
    			isNeedSync=false;
    			return false;
    		}
    		if(isNaN(this.data.unit) || this.data.unit<=0){
    			Ext.Msg.alert('提示信息', "请选择单位");
    			isNeedSync=false;
    			return false;
    		}
    		
//    		var kvstore =  Ext.data.StoreManager.get('MyStockStore');
//         	var index = kvstore.findExact('id',this.data.id);
//        	if(index >= 0){
//        		Ext.Msg.alert('提示信息', "id 重复");
//        		isNeedSync=false;
//    			return false;
//        	} 
//    		
//        	var kvstore =  Ext.data.StoreManager.get('MyStockStore');
//         	var index = kvstore.findExact('name',this.data.name);
//        	if(index >= 0){
//        		Ext.Msg.alert('提示信息', "name 重复");
//        		isNeedSync=false;
//    			return false;
//        	}
    		
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
        if (selection && parseInt(selection.data.number)==0) {
            this.store.remove(selection);
        }else{
        	Ext.Msg.alert("警告", '不能删除库存有剩余的物品');
        }
    },

    onAddClick: function(){
        var rec = new MyApp.model.StockData({
        	  'uid':'',
        	  'id':'请输入ID',
        	  'category':0,
        	  'name':'请输入名称',
        	  'number':'0',
        	  'worth':'0',
        	  'specification':'',
        	  'unit':0
        	 }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 0
        });
    },
    
    onQueryClick:function(){
    	this.store.load();
    }
});