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
    	        items: ['->', {
    	            iconCls: 'icon-save',
    	            text: 'Sync',
    	            scope: this,
    	            handler: this.onSync
    	        }]
    	    }]
    	});
    	this.callParent(arguments);
    },
    
	onSync: function(){
		var me = this;
    	
		if(!this.form.isValid()){
			alert('请填写必填信息');
			return false;
		}
		
		var createDate = this.form.findField('createDate').value;
		var staff = this.form.findField('staff').value;
		
		var girdStore=this.items.items[1].store;

		var isNeedSync=true;
		girdStore.each(function(record) {
    		if(isNaN(this.data.stock) || this.data.stock<=0){
    			Ext.Msg.alert('提示信息', "请选择物品");
    			isNeedSync=false;
    			return false;
    		}
    		if(isNaN(this.data.number) || this.data.number<=0){
    			Ext.Msg.alert('提示信息', "请填写数量");
    			isNeedSync=false;
    			return false;
    		}
    		if(isNaN(this.data.worth) || this.data.worth<=0){
    			Ext.Msg.alert('提示信息', "请填写单价");
    			isNeedSync=false;
    			return false;
    		}
    		
			record.set('createDate',createDate);
			record.set('staff',staff);
	    });  
		
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
});