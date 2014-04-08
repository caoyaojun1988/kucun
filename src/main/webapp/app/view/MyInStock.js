Ext.define('MyApp.view.MyInStock', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyInStock',
    store: 'MyInStockStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'inStockQuery',
    layout: {
        type: 'border'
    },
    title: '入库明细',
    
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
                    id: 'btnInCreateTimeBegin',
                },
                {
                    xtype: 'label',
                    text: '到'
                },
                {
                    xtype: 'datefield',
                    id: 'btnInCreateTimeEnd',
                },{
                    xtype: 'label',
                    text: '物品'
                },
                {
                	id: 'btnInStock',
                	xtype: 'combo',
                    store:'MyStockStore',
                    valueField: 'id',
                    displayField: 'name',
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
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                store: 'MyStockStore',
                displayInfo: true
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
            columns: [{
	            	 xtype: 'gridcolumn',
	                 width: 58,
	                 dataIndex: 'id',
	                 text: '编号',
	                 sortable: true
	            },{
		           	 xtype: 'datecolumn',
		             width: 100,
		             dataIndex: 'createDate',
		             text: '创建时间',
		             sortable: true,
		             renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
		        },{
			       	 xtype: 'datecolumn',
			         width: 100,
			         dataIndex: 'modifyDate',
			         text: '修改时间',
			         sortable: true,
			         renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s')
		        }, {
		            header: "物品",
		            dataIndex: 'stock',
		            hidden: false,
		            width: 108,
		            renderer:function(value,metadata,record,store){
		            	var kvstore =  Ext.data.StoreManager.get('MyStockStore');
		            	var index = kvstore.find('id',value);
		            	var record = kvstore.getAt(index).get('name');
		            	return record; 
		            }
			     },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         dataIndex: 'number',
			         text: '入库数量',
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
				     text: '单价',
				     sortable: true
				},{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         dataIndex: 'remainderNumber',
			         text: '剩余数量',
			         sortable: true
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
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
        	if(selection.data.number == selection.data.remainderNumber){
        		this.store.remove(selection);
        	}else{
        		Ext.Msg.alert("错误", "已经出库不能删除");
        	}
        }
    },

    onQueryClick:function(){
    	var kvstore =  Ext.data.StoreManager.get('MyStockStore');
    	kvstore.load();
    	
    	var btnCreateTimeBegin = Ext.getCmp('btnInCreateTimeBegin').getValue();
    	var btnCreateTimeEnd = Ext.getCmp('btnInCreateTimeEnd').getValue();

    	var btnOutStock = Ext.getCmp('btnInStock').getValue();
    	
    	
    	var proxy = this.store.getProxy(); 
        proxy.extraParams['beginTimeStr'] = Ext.Date.format(btnCreateTimeBegin, 'Y-m-d'); 
        proxy.extraParams['endTimeStr'] = Ext.Date.format(btnCreateTimeEnd, 'Y-m-d');
        proxy.extraParams['stock'] = btnOutStock; 
        
    	this.store.load();
    }
});