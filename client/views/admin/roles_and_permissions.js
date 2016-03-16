Template.rolesAndPermissions.helpers({
    canEditRole: function () {
        return Session.get("selectedRoleId") ? "" : "disabled";
    },
    canEditPermission: function () {
        return Session.get("selectedPermissionId") ? "" : "disabled";
    }
});
