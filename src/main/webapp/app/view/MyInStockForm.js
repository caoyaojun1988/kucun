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
                         displayField: 'name'
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
                         value:new Date()
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
		                			var store = Ext.getCmp("inStockPanelId").items.items[1].store;
		                			if(store.count()>0){
		                				Ext.MessageBox.confirm("警告", "切换类目入库明细将全部清除", function (btn) {
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
                	id: 'inDepartment',
                	xtype: 'combo',
                	fieldLabel: "部门",
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
	                			var staff = Ext.getCmp('inStockStaff')
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
                		id:'inStockStaff',
                        xtype: 'combo',
                        fieldLabel: '经办人',
                        anchor: '100%',
                        store: Ext.create('MyApp.store.MyStaffStore'),
   		                allowBlank: false,
   		                valueField: 'id',
   		                displayField: 'name',
   		                listeners: {
   		                	beforequery:function(e){
   		                        var combo = e.combo;
   		                        if(!e.forceAll){
   		                            var input = e.query;
   		                            var regExp = new RegExp(".*" + input + ".*");  // 检索的正则
   		                            combo.store.filterBy(function(record,id){
   		                                var text = record.get("pinyinForName");
   		                                return regExp.test(text);
   		                            });
   		                            combo.expand();
   		                            return false;
   		                        }
   		                	},
   		                	expand: function(combo ,record,value) {
 	                			var department = Ext.getCmp('inDepartment').getValue()
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
                		id:'inStockMark',
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
                	id:'inStockFileUp',
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
                    	var panel=Ext.getCmp("inStockPanelId");
                        if(Ext.getCmp("inStockFileUp").value!=""){
                        	panel.form.submit({
                                method:'post',
                                url:'/kucun/inStock/import.do?xwl=23PSMZ8URAE8',
                                waitMsg:'文件上传中...',
                                success: function(e, opt) {
                                    Ext.Msg.alert("系统提示", "文件上传成功！");
                                    var stockStore=panel.items.items[1].stockStore;
                                    stockStore.reload({
                                    	callback : function() {
                                    		var panel=Ext.getCmp("inStockPanelId");
                                    		var girdStore=panel.items.items[1].store;
                                    		 var startRaw = girdStore.getCount();

                                    		 var totalC=0;var totalM=0;
                                             for (var index = 0; index < opt.result.value.length; ++index) {
                                         		var rec = new MyApp.model.InStockData(opt.result.value[index]);
                                         		girdStore.insert(girdStore.getCount(), rec);

                                         		if(Ext.isNumeric(rec.data.number)){
          	                    	            	totalC = totalC+parseInt(rec.data.number);
          	                    	            }
                                         		if(Ext.isNumeric(rec.data.totalWorth)){
                                         			totalM = totalM+parseFloat(rec.data.totalWorth);
          	                    	            }
                                         	}


                                            var  inStocktotalCF   = Ext.getCmp('inStocktotalC');
                                            if(Ext.isNumeric(inStocktotalCF.text)){
      	                    	            	totalC = totalC+parseInt(inStocktotalCF.text);
      	                    	            }
     	                    	            inStocktotalCF.setText(totalC);

     	                    	            var  inStocktotalMF   = Ext.getCmp('inStocktotalM');
     	                    	            if(Ext.isNumeric(inStocktotalMF.text)){
     	                    	            	totalM = totalM+parseFloat(inStocktotalMF.text);
     	                    	            }
     	                    	            inStocktotalMF.setText(totalM.toFixed(2));
                                    	}
                                    });
                                },
                                failure: function(e, opt) {
                                    Ext.Msg.alert("系统提示", "文件上传失败！"+opt.result.msg);
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
