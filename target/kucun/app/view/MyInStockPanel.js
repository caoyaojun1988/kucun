Ext.define('MyApp.view.MyInStockPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.MyInStockPanel',
    
    itemId: 'inStockPanel',
    id:'inStockPanelId',
    frame: true,
    title: '入库表单',
    
    layout: {
        type: 'border'
    },
    
    
    items:[{
    	region:'north',
    	xtype: 'MyInStockForm',
    },{
    	region:'center',
    	xtype: 'MyInStockGrid',
    }],
    
    initComponent: function(){
    	Ext.QuickTips.init();
    	Ext.applyIf(this, {
    		
    		dockedItems:[{
    	        weight: 1,
    	        xtype: 'toolbar',
    	        dock: 'bottom',
    	        ui: 'footer',
    	        items: ['->',{
    	        	xtype: 'textfield',
    	        	id:'inStocktotalM',
    	        	width: 600,
    	            value: '总入库量：0                                 总金额：0                             ',
    	        }, {
    	            iconCls: 'icon-save',
    	            text: 'Sync',
    	            scope: this,
    	            handler: this.onSync
    	        }]
    	    }]
    	});
    	this.callParent(arguments);
    	Ext.getCmp('instockWay').focus(false, 200);
    },
    
	onSync: function(){
		var me = this;
    	
		if(!this.form.isValid()){
			alert('请填写必填信息');
			return false;
		}
		
		var instockWay = this.form.findField('instockWay').value;
		var createDate = this.form.findField('createDate').value;
		var staff = this.form.findField('staff').value;
		
		var inOutDepartment =  this.form.findField('inOutDepartment').value;
		var inOutStockStaff =  this.form.findField('inOutStockStaff').value;
		
		if(instockWay=="2"){
			if(!Ext.isNumeric(inOutDepartment) || inOutDepartment<=0){
				Ext.Msg.alert('提示信息', "请选择出库部门");
				return false;
			}
			
			if(!Ext.isNumeric(inOutStockStaff) || inOutStockStaff<=0){
				Ext.Msg.alert('提示信息', "请选择出库经办人");
				return false;
			}		
		}
		
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
    		if(!Ext.isNumeric(this.data.worth) || this.data.worth<=0){
    			Ext.Msg.alert('提示信息', "请填写单价");
    			isNeedSync=false;
    			return false;
    		}
    		
			record.set('createDate',createDate);
			record.set('staff',staff);
	    });  
		
		girdStore.getProxy().extraParams.instockWay = instockWay;   
		girdStore.getProxy().extraParams.inOutDepartment = inOutDepartment;   
		girdStore.getProxy().extraParams.inOutStockStaff = inOutStockStaff;   
		
		if(isNeedSync){
			girdStore.sync({
	            success: function(e, opt) {
	            	if(opt.batch.proxy.reader.jsonData.success==true){
	                //	me.store.commitChanges(); //commit 承诺。提交  
	                //	me.store.load();  
	                    Ext.Msg.alert('提示信息', "保存成功"); 
	                    this.form.reset();
	                    this.items.items[1].store.removeAll();
	            	}else{
	            		this.store.rejectChanges();  
	               	 	Ext.Msg.alert("错误", opt.batch.proxy.reader.jsonData.msg);
	            	}
	            },  
	            failure: function(e, opt) {
	            	var me = this, msg = "";
	            	//this.store.rejectChanges();  
	            	 Ext.Msg.alert("错误", e.exceptions[0].error.statusText);
	            },
	            scope: me
			});
		}
	}
});