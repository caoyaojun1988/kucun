Ext.define('MyApp.view.MyOutStockPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.MyOutStockPanel',
    
    itemId: 'outStockPanel',
    id:'outStockPanelId',
    frame: true,
    title: '出库表单',
    
    layout: {
        type: 'border'
    },
    
    
    items:[{
    	region:'north',
    	xtype: 'MyOutStockForm',
    },{
    	region:'center',
    	xtype: 'MyOutStockGrid',
    }],
    
    initComponent: function(){
    	Ext.applyIf(this, {
    		
    		dockedItems:[{
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
    	    }]
    	});
    	this.callParent(arguments);
    	Ext.getCmp('outStockCreateDate').focus(false, 200);
    },
    
	onSync: function(){
	    var me = this;
    	
	//	if(!this.form.isValid()){
	//		alert('请填写必填信息');
	//		return false;
	//	}
		
		var createDate = this.form.findField('outStockCreateDate').value;
		var department = this.form.findField('outDepartment').value;
		var staff = this.form.findField('outStockStaff').value;
		var outStockMark = this.form.findField('outStockMark').value;
		
		var girdStore=this.items.items[1].store;
		
		var isNeedSync=true;
		girdStore.each(function(record) {  
			if(!Ext.isNumeric(this.data.stock) || this.data.stock<=0){
    			Ext.Msg.alert('提示信息', "请选择物品");
    			isNeedSync=false;
    			return false;
    		}
    		if(!Ext.isNumeric(this.data.number) || this.data.number<=0){
    			Ext.Msg.alert('提示信息', "请填写数量");
    			isNeedSync=false;
    			return false;
    		}
			record.set('createDate',createDate);
	    });  
		
		girdStore.getProxy().extraParams.outStockMark = outStockMark;  
		girdStore.getProxy().extraParams.createDate = Ext.Date.format(new Date(createDate),'Y-m-d H:i:s');
		girdStore.getProxy().extraParams.staff = staff;
		girdStore.getProxy().extraParams.department = department;
		girdStore.getProxy().extraParams.method = 'add';
		
		if(isNeedSync){
			girdStore.sync({
	            success: function(e, opt) {
	            	if(opt.batch.proxy.reader.jsonData.success==true){
	                    Ext.Msg.alert('提示信息', "保存成功"); 
	                    this.form.reset();
	                    this.items.items[1].store.removeAll();
                        this.items.items[1].store.loadData([],false);
	            	}else{
	            		this.store.rejectChanges();  
	               	 	Ext.Msg.alert("错误", opt.batch.proxy.reader.jsonData.msg);
	            	}
	            },  
	            failure: function(e, opt) {
	            	var me = this, msg = "";
	            	 Ext.Msg.alert("错误", e.exceptions[0].error.statusText);
	            },
	            scope: me
			});
		}
	}
});
