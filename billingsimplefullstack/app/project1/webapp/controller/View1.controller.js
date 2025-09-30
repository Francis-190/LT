sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/NumberFormat"
],
    function (Controller, NumberFormat) {
        "use strict";

        return Controller.extend("project1.controller.View1", {


            onInit: function () {


                var oViewModel = new sap.ui.model.json.JSONModel({});
                this.getView().setModel(oViewModel, "viewModel");


            },
            onModelDescPress: async function () {

                console.log("Model Description link pressed");

                this.oDialog ??= await this.loadFragment({
                    name: "project1.view.fragments.VectorFlowTable"
                });

                this.oDialog.open();
            },

            onCloseDialog: function () {
                console.log(`Close dialog pressed`);
                
                if (this.oDialog) {
                    this.oDialog.close();
                }
            },

            onGoPress: function () {
                var oView = this.getView();
                var oComboBox = oView.byId("idDealerCombo");
                var sDealerId = oComboBox.getSelectedKey();

                if (!sDealerId) {
                    sap.m.MessageToast.show("Please select a Dealer first.");
                    return;
                }

                var oModel = oView.getModel();

                var that = this;

                oModel.read("/Dealer(dealerId='" + sDealerId + "')", {
                    urlParameters: {
                        "$expand": "billings"
                    },
                    success: function (oData) {
                        var oViewModel = oView.getModel("viewModel");
                        if (!oViewModel) {
                            oViewModel = new sap.ui.model.json.JSONModel();
                            oView.setModel(oViewModel, "viewModel");
                        }

                        var aBillings = oData.billings?.results || [];

                        oViewModel.setData({
                            DealerName: oData.DealerName,
                            Stock_Availability: oData.Stock_Availability,
                            Limit_available: oData.Limit_available,
                            Billings: aBillings,
                            showTable: true
                        });

                        var oIndianFormatter = NumberFormat.getFloatInstance({
                            groupingEnabled: true,
                            groupingSeparator: ",",
                            decimalSeparator: ".",
                            maxFractionDigits: 2
                        }, new sap.ui.core.Locale("en_IN"));

  
                        var totalStock = 0;
                        var totalAvailable = 0;
                        var totalQuantity = 0;
                        var totalFundRequired = 0;
                        var totalOrderValue = 0;

                        aBillings.forEach(function (item) {
                            totalStock += parseFloat(item.stock) || 0;
                            totalAvailable += parseFloat(item.availability) || 0;
                            totalQuantity += parseFloat(item.totalQuantity) || 0;
                            totalFundRequired += parseFloat(item.fundRequired) || 0;
                            totalOrderValue += parseFloat(item.OrderVAlue) || 0;
                        });

                        var oCurrencyFormatter = NumberFormat.getCurrencyInstance({
                            currencyCode: false
                        }, new sap.ui.core.Locale("en_IN"));

                        oViewModel.setProperty("/TotalStock", oIndianFormatter.format(totalStock));
                        oViewModel.setProperty("/TotalAvailable", oIndianFormatter.format(totalAvailable));
                        oViewModel.setProperty("/TotalQuantity", oIndianFormatter.format(totalQuantity));
                        oViewModel.setProperty("/TotalFundRequired", oCurrencyFormatter.format(totalFundRequired, "INR"));
                        oViewModel.setProperty("/TotalOrderValue", oCurrencyFormatter.format(totalOrderValue, "INR"));


                        var oTableContainer = oView.byId("tableContainer");
                        var oTotalTableContainer = oView.byId("totaltableContainer");
                        if (oTableContainer && oTotalTableContainer) {
                            oTableContainer.removeStyleClass("hiddenTable");
                            oTotalTableContainer.removeStyleClass("hiddenTable");
                            oTableContainer.addStyleClass("visibleTable");
                            oTotalTableContainer.addStyleClass("visibleTable");


                        }
                        else {
                            console.warn("tableContainer not found in view");
                        }

                         var oWizard = that.getView().byId("myWizard");
    // var oStep1 = that.getView().byId("step1");
    // var oStep2 = that.getView().byId("step2");

    // oWizard.validateStep(oStep1);  
    // oWizard.goToStep(oStep2);     
    
    oWizard.nextStep();

                        sap.m.MessageToast.show("Dealer details loaded.");
                    },
                    error: function (oError) {
                        sap.m.MessageToast.show("Failed to fetch dealer details.");
                        console.error("OData Error:", oError);
                    }
                });
            }





        });
    });
