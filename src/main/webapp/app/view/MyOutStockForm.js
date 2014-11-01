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
                         format: 'Y-m-d',
                         value:new Date()
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
                        store:Ext.create('MyApp.store.MyCategoryStore'),
                        allowBlank: false,
                        valueField: 'id',
                        displayField: 'name',
                        listeners: {
                        	beforequery:function(e){
    	                        var combo = e.combo;
    	                        if(!e.forceAll){
    	                            var input = e.query;
    	                            var regExp = new RegExp(".*" + input + ".*");// 检索的正则
    	                            combo.store.filterBy(function(record,id){
    	                                var text = record.get("pinyinForName"); // 得到每个record的项目名称值
    	                                return regExp.test(text);
    	                            });
    	                            combo.expand();
    	                            return false;
    	                        }
    	                	},
                        	expand: function(combo ,record,value) {
		                			var store = Ext.getCmp("outStockPanelId").items.items[1].store;
		                			if(store.count()>0){
		                				Ext.MessageBox.confirm("警告", "切换类目出库明细将全部清除", function (btn) {
		                					if(btn==='no'){
		                						return false;
		                					}else{
		                						store.removeAll();
                                                store.loadData([],false);
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
                    store:Ext.create('MyApp.store.MyDepartmentStore'),
                    allowBlank: false,
                    valueField: 'id',
                    displayField: 'name',
	                listeners: {
	                	beforequery:function(e){
	                        var combo = e.combo;
	                        if(!e.forceAll){
	                            var input = e.query;
	                            var regExp = new RegExp(".*" + input + ".*");// 检索的正则
	                            combo.store.filterBy(function(record,id){
	                                var text = record.get("pinyinForName"); // 得到每个record的项目名称值
	                                return regExp.test(text);
	                            });
	                            combo.expand();
	                            return false;
	                        }
	                	},
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
   		                store: Ext.create('MyApp.store.MyStaffStore'),
   		                allowBlank: false,
   		                valueField: 'id',
   		                displayField: 'name',
   		                triggerAction: 'all',
   		                lastQuery: '',
   		                listeners: {
   		                	beforequery:function(e){
   		                        var combo = e.combo;
   		                        if(!e.forceAll){
   		                            var input = e.query;
   		                            var regExp = new RegExp(".*" + input + ".*");// 检索的正则
   		                            combo.store.clearFilter();
   		                            combo.store.filterBy(function(record,id){
   		                                var text = record.get("pinyinForName"); // 得到每个record的项目名称值
   		                                return regExp.test(text);
   		                            });
   		                            combo.expand();
   		                            return false;
   		                        }
   		                	},
   		                	expand: function(combo ,record,value) {
 	                			var department = Ext.getCmp('outDepartment').getValue()
 	                			//过滤控件的数据源
 	                			combo.store.filterBy(function (item) {
 	                				return item.get("department") == department;
 	                			});
   		                	}
   		                }
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
                		id:'outStockMark',
                        xtype: 'textfield',
                        fieldLabel: '备注',
                        anchor: '100%',
   		                allowBlank: true
                }]
            },{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                	id:'outStockFileUp',
                	xtype: 'filefield',
                	name: 'upfile',
                	fieldLabel: 'File',
                	labelWidth: 50,
                	allowBlank: true,
                	anchor: '100%',
                	buttonText: 'Select a File...'
                }]
            },{
            	xtype: 'container',
            	flex: 1,
                layout: 'anchor',
                items:[{
                	xtype: 'button',
                    text:'上传',  
                    handler:function(){
                    	var panel=Ext.getCmp("outStockPanelId");
                        if(Ext.getCmp("outStockFileUp").value!=""){
                        	panel.form.submit({
                                method:'post',  
                                url:'/kucun/outStock/import.do?xwl=23PSMZ8URAE8',  
                                waitMsg:'文件上传中...',  
                                success: function(e, opt) {
                                    Ext.Msg.alert("系统提示", "文件上传成功！");
                                    
                                    var girdStore=panel.items.items[1].store;
                                    var startRaw = girdStore.getCount();
                                    
                                    var totalC=0;
                                    for (var index = 0; index < opt.result.value.length; ++index) {
                                		var rec = new MyApp.model.OutStockData(opt.result.value[index]); 
                                		girdStore.insert(girdStore.getCount(), rec);
                                		
                                		if(Ext.isNumeric(rec.data.number)){
  	                    	            	totalC = totalC+parseInt(rec.data.number);
  	                    	            }
                                	}
                                    
                                    var  outStocktotalCF   = Ext.getCmp('outStocktotalC');
    	             	            if(Ext.isNumeric(outStocktotalCF.text)){
    	             	            	totalC = totalC+parseInt(outStocktotalCF.text);
    	             	            }
    	             	            outStocktotalCF.setText(totalC);
                                    
                                },  
                                failure: function(e, opt) {  
                                    Ext.Msg.alert("系统提示", "文件上传失败！");  
                                }  
                            });  
                        }else{
                            Ext.Msg.alert("系统提示","请选择文件后再上传！");  
                        }  
                    }  
                }]
            }]
        }]
});
