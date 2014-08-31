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

Ext.define('MyApp.store.MyStockStore', {
    extend: 'Ext.data.Store',
    alias: 'store.MyStockStore',
    requires: [
        'MyApp.model.StockData'
    ],
    model: 'MyApp.model.StockData',
    
    autoLoad: true,
 	proxy: {
        type: 'ajax',
        
        api: {
        	read: '/kucun/stock/listAll.do?xwl=23PSMZ8URAE8',
        	update: '/kucun/stock/update.do?xwl=23PSMZ8URAF5',
        	create: '/kucun/stock/add.do?xwl=23PSMZ8URAMI',
        	destroy: '/kucun/stock/delete.do?xwl=23PSMZ8URAMK'
        },
        	
        reader: {
            type: 'json',
            successProperty: 'success',
            root: 'rows', 
            totalProperty: 'total'
        }
    } 
});