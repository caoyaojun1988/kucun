Ext.define('MyApp.view.MyInStockForm', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.MyInStockForm',
    
    requires: ['Ext.form.*'],
           
    itemId: 'inStockForm',
    id:'inStockFormId',
    title: '入库基本信息',
    items: [{
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            title: '入库基本信息',
            items: [{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                		 id:'instockWay',
                		 xtype: 'combo',
                         fieldLabel: '入库方式',
                         anchor: '100%',
                         store:'MyInstockWayStore',
                         value:'1',
                         allowBlank: false,
                         valueField: 'id',
                         displayField: 'name',
                         listeners: {
                        	 change: function (filed, newValue, oldValue, op) {
     	                		if (newValue != oldValue) {
     	                			if(newValue==="2"){
     	                				Ext.getCmp("inOutStockStaff").setVisible(true);
     	                				Ext.getCmp("inOutDepartment").setVisible(true);
     	                			}else{
     	                				Ext.getCmp("inOutStockStaff").setVisible(false);
     	                				Ext.getCmp("inOutDepartment").setVisible(false);
     	                			}
     	                		}
     	                	}
                         }
                	}]
            },{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                		 id:'createDate',
                         xtype: 'datefield',
                         fieldLabel: '入库日期',
                         anchor: '100%',
                         format: 'Y-m-d',
                         allowBlank: false,
                	}]
            },{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                		id:'category',
                        xtype: 'combo',
                        fieldLabel: '物品类目',
                        anchor: '100%',
                        store:'MyCategoryStore',
                        allowBlank: false,
                        valueField: 'id',
                        displayField: 'name',
                        listeners: {
                        	expand: function(combo ,record,value) {
		                			var store = Ext.getCmp("inStockPanelId").items.items[1].store;
		                			if(store.count()>0){
		                				Ext.MessageBox.confirm("警告", "切换类目入库明细将全部清除", function (btn) {
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
                		id:'staff',
                        xtype: 'combo',
                        fieldLabel: '入庫经办人',
                        anchor: '100%',
   		                store: 'MyStaffStore',
   		                allowBlank: false,
   		                valueField: 'id',
   		                displayField: 'name'
                }]
            }]
        },{
        	xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                	id: 'inOutDepartment',
                	xtype: 'combo',
                	fieldLabel: "出库部门",
    	            anchor: '100%',
                    store:'MyDepartmentStore',
                    allowBlank: true,
                    valueField: 'id',
                    displayField: 'name',
                    hidden: true,
	                listeners: {
	                	change: function (filed, newValue, oldValue, op) {
	                		if (newValue != oldValue) {
	                			//清空原来的下拉框
	                			var staff = Ext.getCmp('inOutStockStaff')
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
                		id:'inOutStockStaff',
                        xtype: 'combo',
                        fieldLabel: '出库经办人',
                        anchor: '100%',
   		                store: 'MyStaffStore',
   		                allowBlank: true,
   		                valueField: 'id',
   		                displayField: 'name',
   		                hidden: true,
   		                triggerAction: 'all',
		                lastQuery: '',
   		                listeners: {
   		                	expand: function(combo ,record,value) {
 	                			//清空原来的下拉框
 	                			var department = Ext.getCmp('inOutDepartment').getValue()
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