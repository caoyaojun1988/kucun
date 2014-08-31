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
    
    stockStore:Ext.create('MyApp.store.MyStockStore'),
    unitStore:Ext.create('MyApp.store.MyUnitStore'),
    
    initComponent: function(){
    	Ext.QuickTips.init();
        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.apply(this, {
            iconCls: 'icon-grid',
            frame: true,
            plugins: [this.editing],
            dockedItems: [{
                xtype: 'toolbar',
                store: 'MyOutStockAddStore',
                items: [{
                    xtype: 'numberfield',
                    id: 'btnAddOutStock',
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
                }]
            },{
                weight: 2,
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
	    	        	width: 200
	                }, {
	                	xtype: 'label',
	    	        	id:'outStocktotalC',
	    	        	width: 100,
	    	            text: '0'
	                }]
            }],
            
            columns: [new Ext.grid.RowNumberer({width: 50}),{
            	 xtype: 'gridcolumn',
                 width: 58,
                 itemId:'outStockGrid_id',
                 dataIndex: 'id',
                 text: '编号',
                 hidden: true,
                 sortable: true
            }, {
	            header: "物品编号",
	            itemId:'outStock_stock_id',
	            dataIndex: 'stock',
	            hidden: false,
	            width: 108
            },{
	            header: "物品",
	            itemId:'outStockGrid_stock',
	            dataIndex: 'stock',
	            width:100,
	            hidden: false,
	            renderer:function(value,metadata,record,store){
	            	if(value==0){
	            		return "请选择";
	            	}
	            	var kvstore =  this.stockStore;
	            	var index = kvstore.find('id',value);
	            	var record = kvstore.getAt(index).get('name');
	            	return record; 
	            },
	            editor: new Ext.form.ComboBox({
	                store: Ext.create('store.MyStockStore'),
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
	                            var regExp = new RegExp(".*" + input + ".*");// 检索的正则
	                          //编辑之前，过滤下市的数据源
	         	 				var category = Ext.getCmp("outStockPanelId").form.findField('outStockCategory').value;
	                            combo.store.clearFilter();
	                            combo.store.filterBy(function(record,id){
	                                var text = record.get("pinyinForName"); // 得到每个record的项目名称值
	                                return regExp.test(text) && record.get("category") == category;
	                            });
	                            combo.expand();
	                            return false;
	                        }
	                	},
	                  
	                    select: function(field, value) {
	                    	//过滤控件的数据源
                			var myStockStore =  this.store;
                			var index = myStockStore.find('id',field.getValue());
    		            	var unit = myStockStore.getAt(index).get('unit');
    		            	var number = myStockStore.getAt(index).get('number');
    		            	
    		            	var selection =	Ext.getCmp("outStockGridId").getView().getSelectionModel().getSelection()[0];
    		            	if(selection){
    		            		selection.set('unit',unit);
    		            		selection.set('totalNumber',number);
    		            	};
    		            	
    		            	Ext.getCmp("outStockGridId").editing.startEdit(selection,3); 
	                    }
	                }
	            })
		     },{
		       	 xtype: 'gridcolumn',
		         width: 100,
		         itemId:'outStockGrid_number',
		         dataIndex: 'number',
		         text: '出库数量',
		         sortable: true,
		         field: {
                     type: 'numberfield',
                     allowBlank:false, 
                     blankText:'该项不能为空!',
                     listeners: {
                    	 change : function(field, newValue,oldValue ,e) {
                    		// if(Math.abs(oldValue-newValue)>0.001){
	                    		 var selection =	Ext.getCmp("outStockGridId").getView().getSelectionModel().getSelection()[0];
	                    		 if(newValue>selection.data.totalNumber){
	                    			 Ext.MessageBox.alert("警告", "库存不足")
	                    			 field.setValue(0);
	                    		 }
	                    		 
	                    		var  outStocktotalCF   = Ext.getCmp('outStocktotalC');
	               	          
	             	            var totalC=0;
	             	            if(Ext.isNumeric(outStocktotalCF.text)){
	             	            	totalC = totalC+parseInt(outStocktotalCF.text);
	             	            }
	             	            
	             	            if(Ext.isNumeric(oldValue)){
	             	            	totalC = totalC-parseInt(oldValue);
	             	            }
	             	            
	             	            if(Ext.isNumeric(newValue)){
	             	            	totalC = totalC+parseInt(newValue);
	             	            }
	             	            
	             	            outStocktotalCF.setText(totalC);
                    	//	 }
                    	 }
                     }
                 }
		    },{
		       	 xtype: 'gridcolumn',
		         width: 100,
		         itemId:'outStockGrid_unit',
		         dataIndex: 'unit',
		         text: '单位',
		         sortable: true,
		         renderer:function(value,metadata,record,store){
		        	 	if(value==0 || value==undefined){
		            		return "请选择";
		            	}
		            	var kvstore = this.unitStore;
		            	kvstore.load();
		            	var index = kvstore.find('id',value);
		            	var record = kvstore.getAt(index).get('name');
		            	return record; 
		            }
		    },{
		       	 xtype: 'gridcolumn',
		         width: 100,
		         itemId:'outStockGrid_totalNUmber',
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
    	
    	var btnAddOutStock = Ext.getCmp('btnAddOutStock').getValue();
    	var count = parseInt(btnAddOutStock)>0 ? parseInt(btnAddOutStock):1;
    	
    	edit = this.editing;
        edit.cancelEdit();
        
        var startRaw = this.store.getCount();
    	for (var i=0;i<count;i++){
	        var rec = new MyApp.model.OutStockData({
	        	  'id':'',
	        	  'stock':'',
	        	  'number':'',
	        	  'unit':'',
	        	  'totalNumber':''
	        	 });
        	 this.store.insert(this.store.getCount(), rec);
    	}
        edit.startEditByPosition({
        	row: startRaw>1 ? startRaw-1 : 0,
            column: 2
        });
    },
    
    onQueryClick:function(){
    	this.store.load();
    }
});
