Permission = Astro.Class({
    name: 'Permission',
    collection: Permissions,
    fields: {
        module: 'string',
        operation: 'string'
    },
    validators: {
        module: [
            Validators.required(null, "Please provide the Module"),
            Validators.string()
        ],
        operation: [
            Validators.required(null, "Please provide the Operation"),
            Validators.string()
        ]
    }
});
