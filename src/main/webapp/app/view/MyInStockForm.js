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
                        fieldLabel: '经办人',
                        anchor: '100%',
   		                store: 'MyStaffStore',
   		                allowBlank: false,
   		                valueField: 'id',
   		                displayField: 'name'
                }]
            }]
        }]
});