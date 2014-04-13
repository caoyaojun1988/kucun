Ext.Loader.setConfig({
    enabled: true,   
    paths: {
        'Extention': 'js'
    }
});

Ext.application({
    requires: [
        'Extention.RandomGen'
    ],

    views: [
        'MyViewport'
    ],
    
    autoCreateViewport: true,
    name: 'MyApp',
    controllers: [
        'AppLaunchCtrl'
    ],

    findTab: function(tabPanel,  record) {
        var ret,
        activeTab = tabPanel.getActiveTab();
        if (activeTab && activeTab.record === record) {
            return activeTab;
        }
        tabPanel.items.each(function(t, idx) {
            if (t && t.record === record) {
                ret = t;
                return false;
            }
        });
        return ret;
    },

    activateTab: function(tabPanel, targetTab) {
        if (targetTab) {
            tabPanel.setActiveTab(targetTab);
            return true;
        }
        return false;
    },

    widget: function(tabPanel, controllerName, widgetName, record, cfg) {
        var findRes = this.findTab(tabPanel, record);
        if (findRes) {
            this.activateTab(tabPanel, findRes);   
        } else {
            var ctrl = this.getController(controllerName),
            tab = Ext.widget(widgetName, {record: record, closable: true});
            if (cfg) {
                Ext.apply(tab, cfg);
            }
            tabPanel.setActiveTab(tabPanel.add(tab));
            ctrl.init();
        }
    }

});
