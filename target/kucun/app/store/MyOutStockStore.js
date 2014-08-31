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

Ext.define('MyApp.store.MyOutStockStore', {
    extend: 'Ext.data.Store',
    alias: 'store.MyOutStockStore',
    requires: [
        'MyApp.model.OutStockData'
    ],
    model: 'MyApp.model.OutStockData',
    
    autoLoad: false,
 	proxy: {
        type: 'ajax',
        
        api: {
        	read: '/kucun/outStock/listAll.do?xwl=23PSMZ8URAE8',
        	update: '/kucun/outStock/update.do?xwl=23PSMZ8URAF5',
        	create: '/kucun/outStock/add.do?xwl=23PSMZ8URAMI',
        	destroy: '/kucun/outStock/delete.do?xwl=23PSMZ8URAMK'
        },
        	
        reader: {
            type: 'json',
            successProperty: 'success',
            root: 'rows', 
            totalProperty: 'total'
        }
    } 
});