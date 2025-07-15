sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "rits/custom/plugin/linemonitorpodplugins/lineMonitorLastIndicatorValueExtensionProvider/PluginEventExtension",
    "rits/custom/plugin/linemonitorpodplugins/utils/ExtensionUtilities"
], function (PluginExtensionProvider, PluginEventExtension, ExtensionUtilities) {
    "use strict";

    return PluginExtensionProvider.extend("rits.custom.plugin.linemonitorpodplugins.lineMonitorLastIndicatorValueExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
        },

        getExtensions: function () {
            const oPluginEventExtension = new PluginEventExtension(this.oExtensionUtilities);
            return [ oPluginEventExtension ];
        }
    })
});
