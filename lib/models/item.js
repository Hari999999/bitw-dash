Item = Astro.Class({
    name: 'Item',
    collection: Items,
    fields: {
        name: 'string',
        description: 'string',
        price: 'number',
        isActive: {
            type: 'boolean',
            default: true
        },
        createdAt: {
            type: 'date',
            default: function () {
                return new Date();
            }
        }
    },
    validators: {
        name: [
            Validators.required(null, "Please provide the Name for the item."),
            Validators.string()
        ],
        price: [
            Validators.required(null, "Please provide the price for the item."),
            Validators.number()
        ]
    },
    methods: {

    }
});
