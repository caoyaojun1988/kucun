Ext.define('MyApp.view.MyOutStockForm', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.MyOutStockForm',
    
    requires: ['Ext.form.*'],
           
    itemId: 'outStockForm',
    title: '出库基本信息',
    items: [{
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                		 id:'outStockCreateDate',
                         xtype: 'datefield',
                         fieldLabel: '出库日期',
                         anchor: '100%',
                         format: 'Y-m-d'
                	}]
            },{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                		id:'outStockCategory',
                        xtype: 'combo',
                        fieldLabel: '物品类目',
                        anchor: '100%',
                        store:'MyCategoryStore',
                        allowBlank: false,
                        valueField: 'id',
                        displayField: 'name',
                        listeners: {
                        	expand: function(combo ,record,value) {
		                			var store = Ext.getCmp("outStockPanelId").items.items[1].store;
		                			if(store.count()>0){
		                				Ext.MessageBox.confirm("警告", "切换类目出库明细将全部清除", function (btn) {
		                					if(btn==='no'){
		                						return false;
		                					}else{
		                						store.removeAll();
		                						return true;
		                					}
		                				});
		                			}
		         	 			}
		                	}
                }]
            },{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                	id: 'outDepartment',
                	xtype: 'combo',
                	fieldLabel: "出库部门",
    	            anchor: '100%',
                    store:'MyDepartmentStore',
                    allowBlank: false,
                    valueField: 'id',
                    displayField: 'name',
	                listeners: {
	                	change: function (filed, newValue, oldValue, op) {
	                		if (newValue != oldValue) {
	                			//清空原来的下拉框
	                			var staff = Ext.getCmp('outStockStaff')
	                			staff.clearValue();
	                		}
	                	}
	                }
                }]
            },{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                		id:'outStockStaff',
                        xtype: 'combo',
                        fieldLabel: '经办人',
                        anchor: '100%',
   		                store: 'MyStaffStore',
   		                allowBlank: false,
   		                valueField: 'id',
   		                displayField: 'name',
   		                triggerAction: 'all',
   		                lastQuery: '',
   		                listeners: {
   		                	expand: function(combo ,record,value) {
 	                			var department = Ext.getCmp('outDepartment').getValue()
 	                			//过滤控件的数据源
 	                			var myStaffStore =  Ext.data.StoreManager.get('MyStaffStore');
 	                			myStaffStore.clearFilter();
 	                			myStaffStore.filterBy(function (item) {
 	                				return item.get("department") == department;
 	                			});
   		                	}
   		                }
                }]
            }]
        }]
});