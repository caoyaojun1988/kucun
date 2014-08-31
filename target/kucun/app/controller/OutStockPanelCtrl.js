Ext.define('MyApp.controller.OutStockPanelCtrl', {
    extend: 'Ext.app.Controller',

    stores: [
             'MyStockStore',
             'MyOutStockAddStore',
             'MyCategoryStore',
             'MyStaffStore',
             'MyDepartmentStore',
             'MyUnitStore'
         ],
         
    views: ['MyApp.view.MyOutStockGrid','MyApp.view.MyOutStockForm','MyApp.view.MyOutStockPanel'],

    refs: [
           {
               ref: 'tabPanel',
               selector: '#tabPanel'
           }
       ]
});