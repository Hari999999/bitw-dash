Template.salesTeam.onCreated(function () {
    this.pagination = new Meteor.Pagination(SalesTeam, {
        sort: {
            firstName: 1
        }
    });
});

Template.salesTeam.onRendered(function () {
    $.material.init();
    Session.set("salespersonSearchAttr", $("table thead td.active").data("search-name"));
});

Template.salesTeam.helpers({
    templatePagination: function () {
        return Template.instance().pagination;
    },
    salesTeam: function () {
        if (Session.get("salespersonSearchAttr") && Session.get("salespersonSearchValue")) {
            var searchFilter = {};
            var searchObject;

            if (Session.get("salespersonSearchAttr") == "fullName") {
                searchFilter = {
                    $or: [
                        {firstName: {$regex: Session.get("salespersonSearchValue"), $options: 'i'}},
                        {lastName: {$regex: Session.get("salespersonSearchValue"), $options: 'i'}}
                    ]
                };
            } else {
                searchObject = {
                    $regex: Session.get("salespersonSearchValue"), $options: 'i'
                };
                searchFilter[Session.get("salespersonSearchAttr")] = searchObject;
            }

            Template.instance().pagination.filters(searchFilter);
        } else {
            Template.instance().pagination.filters({});
        }
        return Template.instance().pagination.getPage();
    },
    selectedSalesperson: function () {
        return Session.equals("selectedSalespersonId", this._id) ? "active" : "";
    },
    canEditSalesperson: function () {
        return Session.get("selectedSalespersonId") ? "" : "disabled";
    },
    statusIcon: function () {
        var salesPerson = SalesTeam.findOne({_id: Session.get("selectedSalespersonId")});
        return salesPerson && salesPerson.isActive ? "fa-minus-circle" : "fa-check-circle";
    },
    changeStatusText: function () {
        var salesPerson = SalesTeam.findOne({_id: Session.get("selectedSalespersonId")});
        return salesPerson && salesPerson.isActive ? "Deactivate" : "Activate";
    },
    activationState: function () {
        return this.isActive ? "" : "inactive";
    },
    fullName: function () {
        return this.firstName + " " + this.lastName;
    }
});

Template.salesTeam.events({
    "click table#sales-team-list tr": function (e, t) {
        Session.equals("selectedSalespersonId", this._id) ?
            Session.set("selectedSalespersonId", null) : Session.set("selectedSalespersonId", this._id);
    },
    "submit #new-salesperson-form": function (e, t) {
        e.preventDefault();

        var salespersonDoc = {
            _id: null,
            firstName: t.find("#new-salesperson-first-name").value,
            lastName: t.find("#new-salesperson-last-name").value,
            position: t.find("#new-salesperson-position").value,
            telephone: t.find("#new-salesperson-telephone").value
        };

        this.salesperson.set(salespersonDoc);
        var newSalesperson = new Salesperson(salespersonDoc);

        if (this.salesperson.validate()) {
            newSalesperson.save();
            t.find("form").reset();
            toastr.success("Salesperson successfully created!");
        }

        // Prevent form reload
        return false;
    },
    "click button.btn-clear": function (e, t) {
        t.find("#new-salesperson-form").reset();
    },
    "click a#change-salesperson-status": function (e, t) {
        var salesPerson = SalesTeam.findOne({_id: Session.get("selectedSalespersonId")});
        if (salesPerson) {
            SalesTeam.update({_id: salesPerson._id}, {$set: {isActive: !salesPerson.isActive}});
        }
    },
    "click table#sales-team-list thead td": function (e, t) {
        if (!$(e.target).hasClass("disabled")) {
            t.$("table thead td.active").removeClass("active");
            t.$(e.target).addClass("active");

            Session.set("salespersonSearchAttr", $(e.target).data("search-name"));
        }
    },
    "keyup input#search-sales-team": function (e, t) {
        $("#search-sales-team-form").trigger("submit");
    },
    "submit #search-sales-team-form": function (e, t) {
        e.preventDefault();

        var searchTerm = t.find("#search-sales-team").value;
        if (searchTerm) {
            Session.set("salespersonSearchValue", searchTerm);
        } else {
            Session.set("salespersonSearchValue", null);
        }
        return false;
    },
    "change #salesperson-search-field": function (e, t) {
        var selectedOption = t.$(e.target).val();
        Session.set("salespersonSearchAttr", selectedOption);
    }
});

Template.editSalespersonModal.onRendered(function () {
    $.material.init();
});

Template.editSalespersonModal.helpers({
    "selectedSalesperson": function () {
        this.selectedSalesperson = SalesTeam.findOne({_id: Session.get("selectedSalespersonId")});
        return this.selectedSalesperson;
    }
});

Template.editSalespersonModal.events({
    "submit #edit-salesperson-modal form": function (e, t) {
        e.preventDefault();

        var selectedSalespersonId = Session.get("selectedSalespersonId");

        if (selectedSalespersonId) {

            var salespersonDoc = {
                _id: selectedSalespersonId,
                firstName: t.find("#edit-salesperson-first-name").value,
                lastName: t.find("#edit-salesperson-last-name").value,
                position: t.find("#edit-salesperson-position").value,
                telephone: t.find("#edit-salesperson-telephone").value
            };

            this.selectedSalesperson.set(salespersonDoc);


            if (this.selectedSalesperson.validate()) {
                Meteor.call("updateSalesperson", this.selectedSalesperson, function (err) {
                    if (err) throw err;

                    $("#edit-salesperson-modal").modal('hide');
                    toastr.success("Salesperson successfully edited!");
                });
            }
        }

        // Prevent form reload
        return false;
    }
});

Template.deleteSalespersonModal.helpers({
    "selectedSalesperson": function () {
        return SalesTeam.findOne({_id: Session.get("selectedSalespersonId")});
    },
    "fullName": function () {
        return this.fullName();
    }
});

Template.deleteSalespersonModal.events({
    "submit #delete-salesperson-modal form": function (e, t) {
        e.preventDefault();

        var selectedSalesperson = SalesTeam.findOne({_id: Session.get("selectedSalespersonId")});

        if (selectedSalesperson) {

            Meteor.call("deleteSalesperson", selectedSalesperson, function (err) {
                if (err) throw err;

                $("#delete-salesperson-modal").modal('hide');

                Session.set("selectedSalespersonId", null);

                toastr.success("Salesperson successfully removed!");
            });
        }

        // Prevent form reload
        return false;
    }
});
