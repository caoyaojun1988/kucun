Ext.define('MyApp.view.MyInStockDetail', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyInStockDetail',
    store: 'MyInStockStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'inStockDetailQuery',
    id: "inStockDetailQueryId",
    layout: {
        type: 'border'
    },
    title: '入库明细',
    
    features: [{
        ftype: 'summary',
        dock: 'bottom'
    }],
    

    stockStore:Ext.create('MyApp.store.MyStockStore'),
    
    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                store: 'MyInStockStore',
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
	                 width: 58,
	                 itemId:'inStock_id',
	                 dataIndex: 'id',
	                 text: '编号',
	                 sortable: true,
	                 hidden: true
	            },{
		            header: "物品编号",
		            itemId:'inStock_stockid',
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
		             itemId:'inStock_createDate',
		             dataIndex: 'createDate',
		             text: '创建时间',
		             sortable: true,
		             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
		        },{
			       	 xtype: 'datecolumn',
			         width: 100,
			         itemId:'inStock_modifyDate',
			         dataIndex: 'modifyDate',
			         text: '修改时间',
			         sortable: true,
			         renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
		        }, {
		            header: "物品",
		            itemId:'inStock_stock',
		            dataIndex: 'stock',
		            hidden: false,
		            width: 108,
		            renderer:function(value,metadata,record,store){
		            	var kvstore =  this.stockStore;
		            	var index = kvstore.find('id',value);
		            	var record = kvstore.getAt(index).get('name');
		            	return record; 
		            }
			     },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         itemId:'inStock_number',
			         dataIndex: 'number',
			         text: '入库数量',
			         sortable: true,
			         field: {
	                     type: 'numberfield',
	                     allowBlank:false, 
	                     blankText:'该项不能为空!',
	                     listeners : {
	                    	    change : function(field, newValue,oldValue ,e) {
		                    	    	var selectedModel = Ext.getCmp("inStockDetailQueryId").getView().getSelectionModel().getSelection()[0];
		                    	        var text =  Ext.util.Format.round(field.value*selectedModel.get('worth'),2);
		                    	        var totalworth = selectedModel.get('totalWorth');
	                    	            selectedModel.set('totalWorth', text);
	                    	    }
	                    	}
	                 },
	                 summaryType: 'sum'
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'inStock_worth',
				     dataIndex: 'worth',
				     text: '单价',
				     sortable: true,
				     field: {
	                     type: 'NumberField',
	                     blankText:'该项不能为空!',
	                     listeners : {
	                    	 change : function(field, newValue,oldValue ,e) {
	                    	    	var selectedModel = Ext.getCmp("inStockDetailQueryId").getView().getSelectionModel().getSelection()[0];
	                    	        var text = Ext.util.Format.round(field.value*selectedModel.get('number'),2);
	                    	        var totalworth = selectedModel.get('totalWorth');
	                    	        selectedModel.set('totalWorth', text);
	                    		 }
	                    	    }
	                 }
				},{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'inStock_totalWorth',
				     dataIndex: 'totalWorth',
				     text: '总金额',
				     sortable: true,
				     field: {
	                     type: 'NumberField',
	                     blankText:'该项不能为空!',
	                     listeners : {
	                    	 change : function(field, newValue,oldValue ,e) {
	                    		 		var selectedModel = Ext.getCmp("inStockDetailQueryId").getView().getSelectionModel().getSelection()[0];
		                    	    	var worth =  Ext.util.Format.round(field.value/selectedModel.get('number'),2);
	                    	            selectedModel.set('worth', worth);
	                    		 	}
	                    	}
	                 }
				},{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'inStock_status',
				     dataIndex: 'status',
				     text: '状态',
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
    
    	me.store.getProxy().extraParams.method = 'update';
		
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
            	 Ext.Msg.alert("错误", e.exceptions[0].error.statusText);
            },
            scope: me
    	});
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
        	if(selection.data.number == selection.data.remainderNumber){
        		this.store.remove(selection);
        	}else{
        		Ext.Msg.alert("错误", "已经出库不能删除");
        	}
        }
    },
    onAddClick: function(){
        var rec = new MyApp.model.InStockData({
            'id':'',
            'createDate':'',
            'modifyDate':'',
            'stock':'',
            'number':'0',
            'worth':'0',
            'totalWorth':'0',
            'status':'in'
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
