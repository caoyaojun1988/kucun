Ext.define('MyApp.controller.InStockPanelCtrl', {
    extend: 'Ext.app.Controller',

    stores: [
             'MyStockStore',
             'MyInStockAddStore',
             'MyCategoryStore',
             'MyStaffStore',
             'MyUnitStore',
             'MyInstockWayStore',
             'MyDepartmentStore'
         ],
         
    views: ['MyApp.view.MyInStockGrid','MyApp.view.MyInStockForm','MyApp.view.MyInStockPanel'],

    refs: [
           {
               ref: 'tabPanel',
               selector: '#tabPanel'
           }
       ]
});