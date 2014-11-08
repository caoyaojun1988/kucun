Ext.define('MyApp.view.MyFinancialCreate', {
    extend: 'Ext.form.FormPanel',
    alias: 'widget.MyFinancialCreate',

    requires: ['Ext.form.*'],

    itemId: 'financialCreate',
    id: 'financialCreateId',
    title: '导入文件',
    items: [
        {
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [
                        {
                            id: 'templateFileUp',
                            xtype: 'filefield',
                            name: 'templateFile',
                            fieldLabel: '模板文件',
                            labelWidth: 150,
                            allowBlank: true,
                            anchor: '50%',
                            buttonText: 'Select a File...'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [
                        {
                            id: 'dnzzFileUp',
                            xtype: 'filefield',
                            name: 'dnzzFile',
                            fieldLabel: '历史总账余额表',
                            labelWidth: 150,
                            allowBlank: true,
                            anchor: '50%',
                            buttonText: 'Select a File...'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [
                        {
                            id: 'dyzzFileUp',
                            xtype: 'filefield',
                            name: 'dyzzFile',
                            fieldLabel: '当月总账余额表',
                            labelWidth: 150,
                            allowBlank: true,
                            anchor: '50%',
                            buttonText: 'Select a File...'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [
                        {
                            id: 'dyjbFileUp',
                            xtype: 'filefield',
                            name: 'dyjbFile',
                            fieldLabel: '当月基本发生额',
                            labelWidth: 150,
                            allowBlank: true,
                            anchor: '50%',
                            buttonText: 'Select a File...'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [
                        {
                            id: 'dyxmFileUp',
                            xtype: 'filefield',
                            name: 'dyxmFile',
                            fieldLabel: '当月项目发生额',
                            labelWidth: 150,
                            allowBlank: true,
                            anchor: '50%',
                            buttonText: 'Select a File...'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [
                        {
                            id: 'xmmxFileUp',
                            xtype: 'filefield',
                            name: 'xmmxFile',
                            fieldLabel: '当月项目明细',
                            labelWidth: 150,
                            allowBlank: true,
                            anchor: '50%',
                            buttonText: 'Select a File...'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [
                        {
                            id: 'mothNumber',
                            xtype: 'numberfield',
                            name: 'mothNumber',
                            fieldLabel: '数据所属月份',
                            labelWidth: 150,
                            allowBlank: false,
                            anchor: '50%',
                            minimum: 1,
                            maximum: 12
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            anchor: '100%',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'anchor',
                    items: [
                        {
                            xtype: 'button',
                            text: '上传',
                            handler: function () {
                                var form = Ext.getCmp("financialCreateId");
                                form.submit({
                                    method: 'post',
                                    url: '/kucun/financial/create.do?xwl=23PSMZ8URAE8&defaultDir=false',
                                    waitMsg: '文件上传中...',
                                    success: function (e, opt) {
                                        Ext.Msg.alert("系统提示", "文件上传成功！");
                                    },
                                    failure: function (e, opt) {
                                        Ext.Msg.alert("系统提示", "文件上传失败！" + opt.result.msg);
                                    }
                                });
                            }
                        },
                        {
                            xtype: 'button',
                            text: '使用默认一键上传',
                            handler: function () {
                                var mothNumber= Ext.getCmp("mothNumber").value;
                                Ext.Ajax.request({
                                    url: '/kucun/financial/create.do?xwl=23PSMZ8URAE8&defaultDir=true&mothNumber=' + Ext.getCmp("mothNumber").value,
                                    method: 'post',
                                    waitMsg: '文件上传中...',
                                    success: function (e, opt) {
                                        Ext.Msg.alert("系统提示", "文件上传成功！");
                                    },
                                    failure: function (e, opt) {
                                        Ext.Msg.alert("系统提示", "文件上传失败！" + opt.result.msg);
                                    }
                                });
                            }
                        }
                    ]
                }
            ]
        }
    ]
});
