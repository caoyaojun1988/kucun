Ext.define('MyApp.view.MyInStockGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyInStockGrid',
    
    store: 'MyInStockAddStore',
    
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    layout: {
        type: 'border'
    },
    id:'inStockGridId',
    title: '入库明细',
    
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
		            hidden: false,
		            width: 108,
		            renderer:function(value,metadata,record,store){
		            	if(value==0){
		            		return "请选择";
		            	}
		            	var kvstore =  Ext.data.StoreManager.get('MyStockStore');
		            	var index = kvstore.find('id',value);
		            	var record = kvstore.getAt(index).get('name');
		            	return record; 
		            },
		            editor: new Ext.form.ComboBox({
		                store: 'MyStockStore',
		                triggerAction: 'all',
		                displayField: 'name',
		                valueField: 'id',
		                allowBlank: false,
		                editable: false,
		                mode: 'local',
		                listeners: {
		                	expand: function (combo ,record,value) {
	         	 				//编辑之前，过滤下市的数据源
	         	 				var category = Ext.getCmp("inStockPanelId").form.findField('category').value;
	         	 				//过滤控件的数据源
	                			var myStockStore =  Ext.data.StoreManager.get('MyStockStore');
	                			myStockStore.clearFilter();
	                			myStockStore.filterBy(function (item) {
	         	 					return item.get("category") == category;
	         	 				});
		                	},
		                    select: function(field, value) {
		                    	//过滤控件的数据源
	                			var myStockStore =  Ext.data.StoreManager.get('MyStockStore');
	                			var index = myStockStore.find('id',field.getValue());
	    		            	var unit = myStockStore.getAt(index).get('unit');
	    		            	var number = myStockStore.getAt(index).get('number');
	    		            	
	    		            	var selection =	Ext.getCmp("inStockGridId").getView().getSelectionModel().getSelection()[0];
	    		            	if(selection){
	    		            		selection.set('unit',unit);
	    		            		selection.set('totalNumber',number);
	    		            	}
		                    }
		                }
		            })
			     },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         dataIndex: 'unit',
			         text: '单位',
			         sortable: true,
			         renderer:function(value,metadata,record,store){
			        	 	if(value==0){
			            		return "请选择";
			            	}
			            	var kvstore =  Ext.data.StoreManager.get('MyUnitStore');
			            	var index = kvstore.find('id',value);
			            	var record = kvstore.getAt(index).get('name');
			            	return record; 
			            }
			    },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         dataIndex: 'totalNumber',
			         text: '库存数量',
			         sortable: true
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
				     sortable: true,
				     field: {
	                     type: 'numberfield',
	                     allowBlank:false, 
	                     blankText:'该项不能为空!',
	                 }
				}]
        });
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
    },
    
    onSelectChange: function(selModel, selections){
        this.down('#delete').setDisabled(selections.length === 0);
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            this.store.remove(selection);
        }
    },

    onAddClick: function(){
    	var category = Ext.getCmp("inStockPanelId").form.findField('category').value;
    	if(category==0 || category ==null || category=='null'){
    		Ext.MessageBox.alert('提示', '请先选择物品类目');
    		return;
    	}
    	
        var rec = new MyApp.model.InStockData({
        	  'id':'',
        	  'stock':'0',
        	  'unit':'0',
        	  'totalNumber':'0',
        	  'number':'0',
        	  'remainderNumber':'0',
        	  'worth':'0',
        	  'status':'in'
        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEditByPosition({
            row: 0,
            column: 1
        });
    }
});