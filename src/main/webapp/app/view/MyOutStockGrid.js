Ext.define('MyApp.view.MyOutStockGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.MyOutStockGrid',
    store: 'MyOutStockAddStore',
    requires: [
        'Ext.grid.plugin.CellEditing',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem'
    ],

    itemId: 'outStockAdd',
    id:'outStockGridId',
    layout: {
        type: 'border'
    },
    title: '出库明细',
    
    initComponent: function(){
    	Ext.QuickTips.init();
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
	                editable: true,
	                mode: 'local',
	                triggerAction: 'all',
		            lastQuery: '',
	                listeners: {
	                	beforequery:function(e){
	                        var combo = e.combo;
	                        if(!e.forceAll){
	                            var input = e.query;
	                            // 检索的正则
	                            var regExp = new RegExp(".*" + input + ".*");
	                            // 执行检索
	                            combo.store.filterBy(function(record,id){
	                                // 得到每个record的项目名称值
	                                var text = record.get(combo.displayField);
	                                return regExp.test(text);
	                            });
	                            combo.expand();
	                            return false;
	                        }
	                	},
	                        
	                	expand: function (combo ,record,value) {
         	 				//编辑之前，过滤下市的数据源
         	 				var category = Ext.getCmp("outStockPanelId").form.findField('outStockCategory').value;
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
    		            	
    		            	var selection =	Ext.getCmp("outStockGridId").getView().getSelectionModel().getSelection()[0];
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
		         dataIndex: 'number',
		         text: '出库数量',
		         sortable: true,
		         field: {
                     type: 'numberfield',
                     allowBlank:false, 
                     blankText:'该项不能为空!',
                     listeners: {
                    	 blur: function (field ,record,value) {
                    		 var selection =	Ext.getCmp("outStockGridId").getView().getSelectionModel().getSelection()[0];
                    		 if(field.value>selection.data.totalNumber){
                    			 Ext.MessageBox.alert("警告", "库存不足")
                    			 field.setValue(0);
                    		 }
                    	 }
                     }
                 }
		    },{
		       	 xtype: 'gridcolumn',
		         width: 100,
		         dataIndex: 'unit',
		         text: '单位',
		         sortable: true,
		         renderer:function(value,metadata,record,store){
		        	 	if(value==0 || value==undefined){
		            		return "请选择";
		            	}
		            	var kvstore =  Ext.data.StoreManager.get('MyUnitStore');
		            	kvstore.load();
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
    	var category = Ext.getCmp("outStockPanelId").form.findField('outStockCategory').value;
    	if(category==0 || category ==null || category=='null'){
    		Ext.MessageBox.alert('提示', '请先选择物品类目');
    		return;
    	}
    	
        var rec = new MyApp.model.OutStockData({
        	  'id':'',
        	  'stock':'0',
        	  'number':'0',
        	  'unit':'0',
        	  'totalNumber':'0'
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