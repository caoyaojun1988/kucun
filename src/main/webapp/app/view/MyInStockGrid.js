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
                items: [{
                    xtype: 'numberfield',
                    id: 'btnAddInstock',
                    value:1
                }, {
                    iconCls: 'icon-add',
                    text: 'Add',
                    scope: this,
                    handler: this.onAddClick
                },{
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
	    	        	width: 400
	                }, {
	                	xtype: 'label',
	    	        	id:'inStocktotalC',
	    	        	width: 100,
	    	            text: '0'
	                },{
	                	width: 110
	                },{
	                	xtype: 'label',
	    	        	id:'inStocktotalM',
	    	        	width: 100,
	    	            text: '0'
	                }]
            }],
            columns: [new Ext.grid.RowNumberer({width: 50}),{
	            	 xtype: 'gridcolumn',
	                 width: 58,
	                 itemId:'inStockGrid_id',
	                 dataIndex: 'id',
	                 text: '编号',
	                 hidden: true,
	                 sortable: true
	            },{
		            header: "物品编号",
		            itemId:'inStock_stock_id',
		            dataIndex: 'stock',
		            hidden: false,
		            width: 108,
	            },{
		            header: "物品",
		            itemId:'inStock_stock',
		            dataIndex: 'stock',
		            hidden: false,
		            width: 108,
		            renderer:function(value,metadata,record,store){
		            	if(value==0){
		            		return "请选择";
		            	}
		            	var kvstore = this.stockStore;
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
		         	 				var category = Ext.getCmp("inStockPanelId").form.findField('category').value;
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
	                			var myStockStore = this.store;
	                			var index = myStockStore.find('id',field.getValue());
	    		            	var unit = myStockStore.getAt(index).get('unit');
	    		            	var number = myStockStore.getAt(index).get('number');
	    		            	
	    		            	var selection =	Ext.getCmp("inStockGridId").getView().getSelectionModel().getSelection()[0];
	    		            	if(selection){
	    		            		selection.set('unit',unit);
	    		            		selection.set('totalNumber',number);
	    		            	};
	    		            	
	    		            	Ext.getCmp("inStockGridId").editing.startEdit(selection,5);
		                    }
		                }
		            })
			     },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         itemId:'inStock_unit',
			         dataIndex: 'unit',
			         text: '单位',
			         sortable: true,
			         renderer:function(value,metadata,record,store){
			        	 	if(value==0){
			            		return "请选择";
			            	}
			            	var kvstore = this.unitStore;
			            	var index = kvstore.find('id',value);
			            	var record = kvstore.getAt(index).get('name');
			            	return record; 
			            }
			    },{
			       	 xtype: 'gridcolumn',
			         width: 100,
			         itemId:'inStock_totalNumber',
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
	                     type: 'NumberField',
	                     allowBlank:false, 
	                     blankText:'该项不能为空!',
	                     listeners : {
	                    	    change : function(field, newValue,oldValue ,e) {
		                    	    	var selectedModel = Ext.getCmp("inStockGridId").getView().getSelectionModel().getSelection()[0];
		                    	        var text =  Ext.util.Format.round(field.value*selectedModel.get('worth'),2);
		                    	        var totalworth = selectedModel.get('totalWorth');
	                    	            selectedModel.set('totalWorth', text);
	                    	            
	                    	            var  inStocktotalCF   = Ext.getCmp('inStocktotalC');
	                    	          
	                    	            var totalC=0;
	                    	            if(Ext.isNumeric(inStocktotalCF.text)){
	                    	            	totalC = totalC+parseInt(inStocktotalCF.text);
	                    	            }
	                    	            
	                    	            if(Ext.isNumeric(oldValue)){
	                    	            	totalC = totalC-parseInt(oldValue);
	                    	            }
	                    	            
	                    	            if(Ext.isNumeric(newValue)){
	                    	            	totalC = totalC+parseInt(newValue);
	                    	            }
	                    	            
	                    	            inStocktotalCF.setText(totalC);
	                    	            
	                    	            
	                    	            var  inStocktotalMF   = Ext.getCmp('inStocktotalM');
		                      	          
	                    	            var totalM=0;
	                    	            if(Ext.isNumeric(inStocktotalMF.text)){
	                    	            	totalM = totalM+parseFloat(inStocktotalMF.text);
	                    	            }
	                    	            
	                    	            if(Ext.isNumeric(totalworth)){
	                    	            	totalM = totalM-parseFloat(totalworth);
	                    	            }
	                    	            
	                    	            if(Ext.isNumeric(text)){
	                    	            	totalM = totalM+parseFloat(text);
	                    	            }
	                    	            
	                    	            inStocktotalMF.setText(totalM.toFixed(2));
	                    	    }
	                    	}
	                 }
			    },{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'inStock_worth',
				     dataIndex: 'worth',
				     text: '单价',
				     sortable: true,
				     field: {
	                     type: 'NumberField',
	                 //    allowBlank:false, 
	                     blankText:'该项不能为空!',
	                     listeners : {
	                    	 change : function(field, newValue,oldValue ,e) {
	                    	    	var selectedModel = Ext.getCmp("inStockGridId").getView().getSelectionModel().getSelection()[0];
	                    	        var text = Ext.util.Format.round(field.value*selectedModel.get('number'),2);
	                    	        var totalworth = selectedModel.get('totalWorth');
	                    	        selectedModel.set('totalWorth', text);
                    	            
                    	            var  inStocktotalMF   = Ext.getCmp('inStocktotalM');
	                      	          
                    	            var totalM=0;
                    	            if(Ext.isNumeric(inStocktotalMF.text)){
                    	            	totalM = totalM+parseFloat(inStocktotalMF.text);
                    	            }
                    	            
                    	            if(Ext.isNumeric(totalworth)){
                    	            	totalM = totalM-parseFloat(totalworth);
                    	            }
                    	            
                    	            if(Ext.isNumeric(text)){
                    	            	totalM = totalM+parseFloat(text);
                    	            }
                    	            
                    	            inStocktotalMF.setText(totalM.toFixed(2));
	                    		 }
	                    	    }
	                 }
				},{
				   	 xtype: 'gridcolumn',
				     width: 100,
				     itemId:'inStock_totalworth',
				     dataIndex: 'totalWorth',
				     text: '总金额',
				     sortable: true,
				     field: {
	                     type: 'NumberField',
	                   //  allowBlank:false, 
	                     blankText:'该项不能为空!',
	                     listeners : {
	                    	 change : function(field, newValue,oldValue ,e) {
	                    		// 	if(Math.abs(oldValue-newValue)>0.001){
	                    		 		var selectedModel = Ext.getCmp("inStockGridId").getView().getSelectionModel().getSelection()[0];
		                    	    	var worth =  Ext.util.Format.round(field.value/selectedModel.get('number'),2);
	                    	            selectedModel.set('worth', worth);
	                    	            
	                    	            
	                    	            var  inStocktotalMF   = Ext.getCmp('inStocktotalM');
	                      	          
	                    	            var totalM=0;
	                    	            if(Ext.isNumeric(inStocktotalMF.text)){
	                    	            	totalM = totalM+parseFloat(inStocktotalMF.text);
	                    	            }
	                    	            
	                    	            if(Ext.isNumeric(oldValue)){
	                    	            	totalM = totalM-parseFloat(oldValue);
	                    	            }
	                    	            
	                    	            if(Ext.isNumeric(newValue)){
	                    	            	totalM = totalM+parseFloat(newValue);
	                    	            }
	                    	            
	                    	            inStocktotalMF.setText(totalM.toFixed(2));
	                    		 	}
                    	    //	}
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
    	
    	var btnAddInstock = Ext.getCmp('btnAddInstock').getValue();
    	var count = parseInt(btnAddInstock)>0 ? parseInt(btnAddInstock):1;
    	
    	edit = this.editing;
        edit.cancelEdit();
        
        var startRaw = this.store.getCount();
    	for (var i=0;i<count;i++){
    		var rec = new MyApp.model.InStockData({
          	  'id':'',
          	  'stock':'',
          	  'unit':'',
          	  'totalNumber':'',
          	  'number':'',
          	  'remainderNumber':'',
          	  'worth':'',
          	  'status':'in',
          	  'totalworth':''
          }); 
    	  this.store.insert(this.store.getCount(), rec);
    	}
        edit.startEditByPosition({
            row: startRaw>1 ? startRaw-1 : 0,
            column: 2
        });
    }
});