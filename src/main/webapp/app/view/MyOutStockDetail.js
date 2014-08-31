Ext.define('MyApp.view.MyOutStockDetail', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyOutStockDetail',
    store: 'MyOutStockStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'outStockDetailQuery',
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
                 itemId:'outStockDetail_id',
                 dataIndex: 'id',
                 text: '编号',
                 sortable: true,
                 hidden: true
            },{
	            header: "物品编号",
	            itemId:'outStockDetail_stockid',
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
	             itemId:'outStockDetail_createDate',
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
	            	var kvstore =  this.stockStore;
	            	var index = kvstore.find('id',value);
	            	var record = kvstore.getAt(index).get('name');
	            	return record; 
	            }
		     },{
		       	 xtype: 'gridcolumn',
		         width: 100,
		         itemId:'outStockDetail_number',
		         dataIndex: 'number',
		         text: '出库数量',
		         sortable: true,
		         field: {
                     type: 'numberfield',
                     allowBlank:false, 
                     blankText:'该项不能为空!'
                 },
                 summaryType: 'sum'
		    },{
			   	 xtype: 'gridcolumn',
			     width: 100,
			     itemId:'outStockDetail_worth',
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
	      	  'createDate':'',
	    	  'stock':'',
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
    	this.store.load();
    }
});
