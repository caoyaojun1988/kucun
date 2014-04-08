/*
 * File: app/store/MyQueryStore.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.store.MyOutStockTotalStore', {
    extend: 'Ext.data.Store',
    alias: 'store.MyOutStockTotalStore',
    requires: [
        'MyApp.model.InOutStockTotalData'
    ],
    model: 'MyApp.model.InOutStockTotalData',
    
    autoLoad: {start: 0, limit: 25},
    pageSize: 25,
 	proxy: {
        type: 'ajax',
        
        url: '/kucun/stockTotal/listOutStock.do?xwl=23PSMZ8URAE8',

        reader: {
            type: 'json',
            successProperty: 'success',
            root: 'rows', 
            totalProperty: 'total'
        }
    } 
});