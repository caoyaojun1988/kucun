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

Ext.define('MyApp.store.MyDepartmentStore', {
    extend: 'Ext.data.Store',
    alias: 'store.MyDepartmentStore',
    requires: [
        'MyApp.model.DepartmentData'
    ],
    model: 'MyApp.model.DepartmentData',
    
    autoLoad: true,
 	proxy: {
        type: 'ajax',

        api: {
        	read: '/kucun/department/listAll.do?xwl=23PSMZ8URAE8',
        	update: '/kucun/department/update.do?xwl=23PSMZ8URAF5',
        	create: '/kucun/department/add.do?xwl=23PSMZ8URAMI',
        	destroy: '/kucun/department/delete.do?xwl=23PSMZ8URAMK'
        },
        	
        reader: {
            type: 'json',
            successProperty: 'success'
        }
    } 
});