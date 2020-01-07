sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/sap/upl/StockReport/model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("com.sap.upl.StockReport.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			var oModel = new JSONModel({
				busy: false,
				enableexecute: false,
				formpanel: true,
				reportpanel: false
			});
			this.setModel(oModel, "settingsModel");

			var data = new JSONModel({
				Whnumber: "",
				Storagetype: "",
				Material: "",
				Bin: "",
				Batch: "",
				Storageloc: ""
			});
			this.setModel(data, "reportmodel");

			var report = new JSONModel({
				results: []
			});
			this.setModel(report, "reportlist");
			this.getModel("reportlist").setSizeLimit(1000000000000000000000);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});