sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"com/sap/upl/StockReport/model/formatter"
], function (Controller, MessageBox, JSONModel, Device, formatter) {
	"use strict";

	return Controller.extend("com.sap.upl.StockReport.controller.Report", {
		formatter: formatter,
		onInit: function () {
			/*this.byId("filledData").setExpanded(true);
			this.byId("reportdata").setExpanded(false);*/
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("warehouseno").focus();
			});

			this.path = "/sap/fiori/zstockreport/" + this.getOwnerComponent().getModel("soundModel").sServiceUrl +
				"/SoundFileSet('sapmsg1.mp3')/$value";
		},

		onAfterRendering: function () {
			/*this.byId("filledData").setExpanded(true);
			this.byId("reportdata").setExpanded(false);*/
			jQuery.sap.delayedCall(400, this, function () {
				this.byId("warehouseno").focus();
			});
		},

		onChange: function (oEvt) {
			if (oEvt.getSource().getValue() != "") {
				oEvt.getSource().setValueState("None");
			}
			if (oEvt.getSource().getName() == "Whnumber") {
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Whnumber", oEvt.getSource().getSelectedKey());
				if (oEvt.getSource().getSelectedKey() != "") {

					this.getOwnerComponent().getModel("reportmodel").setProperty("/Storagetype", "");
					this.getOwnerComponent().getModel("reportmodel").setProperty("/Material", "");
					this.getOwnerComponent().getModel("reportmodel").setProperty("/Bin", "");
					this.getOwnerComponent().getModel("reportmodel").setProperty("/Batch", "");
					this.getOwnerComponent().getModel("reportmodel").setProperty("/Storageloc", "");
					// this.getOwnerComponent().getModel("settingsModel").setProperty("/enableexecute", true);
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("storagetype").focus();
					});
				}
			} else if (oEvt.getSource().getName() == "Storagetype") {
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Storagetype", oEvt.getSource().getValue().toUpperCase());
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Material", "");
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Bin", "");
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Batch", "");
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Storageloc", "");
				jQuery.sap.delayedCall(400, this, function () {
					this.byId("itemcode").focus();
				});

			} else if (oEvt.getSource().getName() == "Material") {
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Material", oEvt.getSource().getValue().toUpperCase());
				jQuery.sap.delayedCall(400, this, function () {
					this.byId("bin").focus();
				});
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Bin", "");
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Batch", "");
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Storageloc", "");
			} else if (oEvt.getSource().getName() == "Bin") {
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Bin", oEvt.getSource().getValue().toUpperCase());
				jQuery.sap.delayedCall(400, this, function () {
					this.byId("batch").focus();
				});
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Batch", "");
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Storageloc", "");
			} else if (oEvt.getSource().getName() == "Batch") {
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Batch", oEvt.getSource().getValue().toUpperCase());
				jQuery.sap.delayedCall(400, this, function () {
					// document.activeElement.blur();
					this.byId("storageLoc").focus();
				});
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Storageloc", "");
			} else if (oEvt.getSource().getName() == "StorageLoc") {
				this.getOwnerComponent().getModel("reportmodel").setProperty("/Storageloc", oEvt.getSource().getValue().toUpperCase());
				jQuery.sap.delayedCall(400, this, function () {
					document.activeElement.blur();
				});
			}
		},

		handleValueHelpRequest: function (oEvent) {
			this.sInputValue = oEvent.getSource();
			this.inputIdMat = oEvent.getSource().getId().split("--")[1];
			var oPath = oEvent.getSource().getBindingInfo("suggestionItems").path;
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.sap.upl.StockReport.fragments.SearchHelp",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}
			this._setListBinding(oPath, this.inputIdMat);
			this._valueHelpDialog.open();
		},

		_setListBinding: function (oPath, idInput) {

			switch (idInput) {
			case "storagetype":
				this.id = "storagetype";
				this.title = "TYPE";
				this.desc = "WHNUMBER";
				this.text = "Storage type";
				break;
			case "bin":
				this.id = "bin";
				this.title = "BIN";
				this.desc = "WHNUMBER";
				this.text = "Bin";
				break;
			case "storageLoc":
				this.id = "storageLoc";
				this.title = "STORAGELOCATION";
				this.desc = "PLANT";
				this.text = "Storage Location";
				break;
			default:
				return;
			}
			var oTemplate = new sap.m.StandardListItem({
				title: "{" + this.title + "}",
				description: "{" + this.desc + "}"
			});

			var aTempFlter = [];
			if (this.id === "bin") {
				aTempFlter.push(new sap.ui.model.Filter([
						new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
							"/Whnumber")),
						new sap.ui.model.Filter("STORAGETYPE", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
							"/Storagetype"))
					],
					true));
			} else {
				aTempFlter.push(new sap.ui.model.Filter([
						new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
							"/Whnumber"))
					],
					true));
			}

			this._valueHelpDialog.bindAggregation("items", oPath, oTemplate);
			this._valueHelpDialog.getBinding("items").filter(aTempFlter);

			this._valueHelpDialog.setTitle(this.text);
		},

		onOk: function (oEvent) {
			debugger;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.sKey = oSelectedItem.getTitle();
				if (this.id === "storagetype") {
					this.getOwnerComponent().getModel("reportmodel").setProperty(
						"/Storagetype", this.sKey);
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("itemcode").focus();
					});
				} else if (this.id === "bin") {
					this.getOwnerComponent().getModel("reportmodel").setProperty(
						"/Bin", this.sKey);
					jQuery.sap.delayedCall(400, this, function () {
						this.byId("batch").focus();
					});
				} else if (this.id === "storageLoc") {
					this.getOwnerComponent().getModel("reportmodel").setProperty(
						"/Storageloc", this.sKey);
					jQuery.sap.delayedCall(400, this, function () {
						document.activeElement.blur();
					});
				}
			}
			this.sInputValue.setValueStateText("");
			this.sInputValue.setValueState("None");

			/*var Whnumber = this.getOwnerComponent().getModel("reportmodel").getProperty("/Whnumber");
			var Material = this.getOwnerComponent().getModel("reportmodel").getProperty("/Material");
			var Storagetype = this.getOwnerComponent().getModel("reportmodel").getProperty("/Storagetype");
			var Bin = this.getOwnerComponent().getModel("reportmodel").getProperty("/Bin");
			var Batch = this.getOwnerComponent().getModel("reportmodel").getProperty("/Batch");
			var Storageloc = this.getOwnerComponent().getModel("reportmodel").getProperty("/Storageloc");

			if ((Whnumber != "" && Storagetype != "" && Bin != "" && Storageloc != "") && (Material != "" || Material == "") && (Batch != "" ||
					Batch == "")) {
				this.onExecute();
			}*/
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = [];
			if (sValue) {
				if (this.id === "bin") {
					oFilter.push(new sap.ui.model.Filter([
							new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
								"/Whnumber")),
							new sap.ui.model.Filter("STORAGETYPE", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
								"/Storagetype")),
							new sap.ui.model.Filter(this.title, sap.ui.model.FilterOperator.Contains, sValue)
						],
						true));
				} else {
					oFilter.push(new sap.ui.model.Filter([
							new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
								"/Whnumber")),

							new sap.ui.model.Filter(this.title, sap.ui.model.FilterOperator.Contains, sValue)
						],
						true));
				}

				evt.getSource().getBinding("items").filter(oFilter);
			} else {
				if (this.id === "bin") {
					oFilter.push(new sap.ui.model.Filter([
							new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
								"/Whnumber")),
							new sap.ui.model.Filter("STORAGETYPE", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
								"/Storagetype"))
						],
						true));
					evt.getSource().getBinding("items").filter(oFilter);
				} else {
					oFilter.push(new sap.ui.model.Filter([
							new sap.ui.model.Filter("WHNUMBER", sap.ui.model.FilterOperator.Contains, this.getOwnerComponent().getModel("reportmodel").getProperty(
								"/Whnumber"))
						],
						true));
					evt.getSource().getBinding("items").filter(oFilter);
				}

			}

		},

		onExecute: function () {
			debugger;
			var count;
			count = this.getFormField(this.byId("stockDetails").getContent());
			if (count > 0) {
				var audio = new Audio(this.path);
				audio.play();
				// this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
				jQuery.sap.delayedCall(400, this, function () {
					// this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
					MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("allMandatoryField"), {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						contentWidth: "100px",
						onClose: function (oAction) {
							if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
								// this.getOwnerComponent().getModel("settingsModel").setProperty("/enableexecute", false);
								jQuery.sap.delayedCall(400, this, function () {
									this.byId("storagetype").focus();
								});
							}
						}.bind(this)
					});
				});
				return;
			}

			var InputFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Whnumber", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
						"/Whnumber")),
					new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
						"/Material")),
					new sap.ui.model.Filter("Storagetype", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
						"/Storagetype")),
					new sap.ui.model.Filter("Bin", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
						"/Bin")),
					new sap.ui.model.Filter("Batch", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
						"/Batch")),
					new sap.ui.model.Filter("Storageloc", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().getModel("reportmodel").getProperty(
						"/Storageloc"))
				],
				and: true
			});

			var filter = new Array();
			filter.push(InputFilter);

			this.getOwnerComponent().getModel("settingsModel").setProperty(
				"/busy", true);
			this.getOwnerComponent().getModel().read("/POITEMSSet", {
				filters: filter,
				success: function (oData, oResponse) {
					this.getOwnerComponent().getModel("settingsModel").setProperty(
						"/busy", false);
					this.byId("warehouseno").setSelectedKey("");
					var oModel = new JSONModel();
					oModel.setSizeLimit(100000000000000000);
					oModel.setData({
						results: oData.results
					});
					if (oData.results.length > 0) {
						this.byId("tableItem").setText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("items") + " (" + oData.results
							.length + ")");
					} else {
						this.byId("tableItem").setText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("items"));
					}

					this.getView().setModel(oModel, "reportlist");
					this.getView().getModel("reportlist").setSizeLimit(10000000);
					this.getView().getModel("reportlist").refresh();
					this.getView().getModel("reportlist").updateBindings();

					// this.getOwnerComponent().getModel("settingsModel").setProperty("/enableexecute", false);
					/*for (var key in this.getOwnerComponent().getModel("reportmodel").getData()) {
						this.getOwnerComponent().getModel("reportmodel").getData()[key] = "";
					}
					this.getOwnerComponent().getModel("reportmodel").refresh();
					this.getOwnerComponent().getModel("reportmodel").updateBindings();*/
					this.getOwnerComponent().getModel("settingsModel").setProperty("/formpanel", false);
					this.getOwnerComponent().getModel("settingsModel").setProperty("/reportpanel", true);
				}.bind(this),
				error: function (error) {
					var audio = new Audio(this.path);
					audio.play();
					this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", true);
					jQuery.sap.delayedCall(5000, this, function () {
						this.getOwnerComponent().getModel("settingsModel").setProperty("/busy", false);
						var oModel = new JSONModel();
						oModel.setData({
							results: []
						});
						this.getView().setModel(oModel, "reportlist");
						this.getView().getModel("reportlist").refresh();
						this.getView().getModel("reportlist").updateBindings();
						this.byId("tableItem").setText(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("items"));
						if (JSON.parse(error.responseText).error.innererror.errordetails.length > 1) {
							var x = JSON.parse(error.responseText).error.innererror.errordetails;
							var details = '<ul>';
							var y = '';
							if (x.length > 1) {
								for (var i = 0; i < x.length - 1; i++) {
									y = '<li>' + x[i].message + '</li>' + y;
								}
							}
							details = details + y + "</ul>";

							MessageBox.error(this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("unabletoExecute"), {
								icon: MessageBox.Icon.ERROR,
								title: "Error",
								details: details,
								contentWidth: "100px",
								onClose: function (oAction) {
									if (oAction == "OK" || oAction == "CANCEL" || oAction == "CLOSE") {
										// this.getOwnerComponent().getModel("settingsModel").setProperty("/enableexecute", true);
										this.getOwnerComponent().getModel("settingsModel").setProperty("/formpanel", true);
										this.getOwnerComponent().getModel("settingsModel").setProperty("/reportpanel", false);
									}
								}.bind(this)
							});
						} else {
							MessageBox.error(JSON.parse(error.responseText).error.message.value, {
								icon: MessageBox.Icon.ERROR,
								title: "Error",
								contentWidth: "100px",
								onClose: function (oAction) {
									if (oAction === "OK" || oAction === "CANCEL" || oAction === "CLOSE") {
										// this.getOwnerComponent().getModel("settingsModel").setProperty("/enableexecute", true);
										this.getOwnerComponent().getModel("settingsModel").setProperty("/formpanel", true);
										this.getOwnerComponent().getModel("settingsModel").setProperty("/reportpanel", false);
									}
								}.bind(this)
							});
						}
					});
				}.bind(this)
			});

		},
		getFormField: function (oFormContent) {
			var c = 0;
			for (var i = 0; i < oFormContent.length; i++) {
				if (oFormContent[i].getMetadata()._sClassName === "sap.m.Input" && oFormContent[i].getRequired() ==
					true) {
					if (oFormContent[i].getValue() == "") {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " + this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText("isX"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				} else if (oFormContent[i].getMetadata()._sClassName === "sap.m.ComboBox" && oFormContent[i].getRequired() ==
					true) {
					if (oFormContent[i].getSelectedKey() == "") {
						oFormContent[i].setValueState("Error");
						oFormContent[i].setValueStateText(oFormContent[i - 1].getText() + " " + this.getOwnerComponent().getModel("i18n").getResourceBundle()
							.getText("isX"));
						oFormContent[i].focus();
						c++;
						return c;
					}
				}
			}
		}

	});

});