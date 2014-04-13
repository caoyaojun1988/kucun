Ext.define('MyApp.view.MyStock', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyStock',
    store: 'MyStockStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'Ext.Ajax.request'
    ],

    itemId: 'stockQuery',
    layout: {
        type: 'border'
    },
    title: '库存',
    
    features: [{
        ftype: 'summary'
    }],
    
    initComponent: function(){
    	Ext.QuickTips.init();
        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                store: 'MyStockStore',
                items: [{
                    xtype: 'numberfield',
                    id: 'btnInstock',
                    value:1
                },{
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
                    xtype: 'label',
                    text: '数量小于'
                },
                {
                    xtype: 'numberfield',
                    id: 'btnNumber',
                },{
                	iconCls: 'icon-query',
                	text: '查询',
                	disabled: false,
                	itemId: 'btnQry',
                	scope: this,
                    handler: this.onQueryClick
                },{
                	iconCls: 'icon-export',
                	text: '导出当前条件',
                	disabled: false,
                	itemId: 'btnCurrentExport',
                	scope: this,
                    handler: this.onCurrentExportClick
                },{
                	iconCls: 'icon-export',
                	text: '导出全部',
                	disabled: false,
                	itemId: 'btnExport',
                	scope: this,
                    handler: this.onExportClick
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
	             width: 208,
	             itemId:'stock_uid',
	             dataIndex: 'uid',
	             text: '编号',
	             hidden:true
	        },{
            	 xtype: 'gridcolumn',
                 width: 108,
                 itemId:'stock_id',
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
                 },
                 summaryType: 'count',
                 summaryRenderer: function (value, summaryData, dataIndex) {
                     return '总数'+value;
                 }
            }, {
	            header: "类目",
	            itemId:'stock_category',
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
	                store: Ext.create('store.MyCategoryStore'),
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
                 width: 135,
                 itemId:'stock_name',
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
		         itemId:'stock_specification',
		         dataIndex: 'specification',
		         text: '规格',
		         sortable: true,
		         field: {
	                    type: 'textfield',
	                }
		    },{
		    	header: "单位",
		    	itemId:'stock_unit',
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
		         width: 135,
		         itemId:'stock_number',
		         dataIndex: 'number',
		         text: '库存数量',
		         sortable: true,
                 summaryType: 'sum'
		    }, {
			   	 xtype: 'gridcolumn',
			     width: 135,
			     itemId:'stock_worth',
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
    	
    	var isNeedSync=true;
    	
    	me.store.each(function(record) {
    		if(!Ext.isNumeric(this.data.id) || this.data.id<=0){
    			Ext.Msg.alert('提示信息', "请check ID");
    			isNeedSync=false;
    			return false;
    		}
    		if(!Ext.isNumeric(this.data.category) || this.data.category<=0){
    			Ext.Msg.alert('提示信息', "请选择类目");
    			isNeedSync=false;
    			return false;
    		}
    		if(Ext.isEmpty(this.data.name)){
    			Ext.Msg.alert('提示信息', "请填写名称");
    			isNeedSync=false;
    			return false;
    		}
    		if(!Ext.isNumeric(this.data.unit) || this.data.unit<=0){
    			Ext.Msg.alert('提示信息', "请选择单位");
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
	                	Ext.data.StoreManager.get('MyUnitStore').load();
	                	Ext.data.StoreManager.get('MyCategoryStore').load();
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

    	var btnInstock = Ext.getCmp('btnInstock').getValue();
    	var count = parseInt(btnInstock)>0 ? parseInt(btnInstock):1;
    	
    	edit = this.editing;
        edit.cancelEdit();
        
        var startRaw = this.store.getCount();
    	for (var i=0;i<count;i++){
	        var rec = new MyApp.model.StockData({
	        	  'uid':'',
	        	  'id':'',
	        	  'category':'',
	        	  'name':'',
	        	  'number':'',
	        	  'worth':'',
	        	  'specification':'',
	        	  'unit':''
	        	 });
	        this.store.insert(this.store.getCount(), rec);
    	}
        edit.startEditByPosition({
        	row: startRaw>1 ? startRaw-1 : 0,
            column: 1
        });
    },
    
    onQueryClick:function(){
    	var btnNumber = Ext.getCmp('btnNumber').getValue();
    	
    	var proxy = this.store.getProxy(); 
        proxy.extraParams['minNumber'] = btnNumber; 
    	
    	this.store.load();
    	Ext.data.StoreManager.get('MyUnitStore').load();
    	Ext.data.StoreManager.get('MyCategoryStore').load();
    },
    
    onCurrentExportClick: function (){
    	var btnNumber = Ext.getCmp('btnNumber').getValue();
    	window.location.href = '/kucun/stock/export.do?minNumber='+btnNumber+'&xwl=23PSMZ8URAE8';
    },
    
    onExportClick: function(){
    	window.location.href = '/kucun/stock/export.do?xwl=23PSMZ8URAE8';  
    }
});