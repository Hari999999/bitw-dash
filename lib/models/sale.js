Sale = Astro.Class({
    name: 'Sale',
    collection: Sales,
    fields: {
        salespersonId: 'string',
        salespersonName: 'string',
        itemId: 'string',
        itemPrice: 'number',
        itemName: 'string',
        goal: 'number',
        sold: 'number',
        transactionDate: 'date',
        createdAt: {
            type: 'date',
            default: function () {
                return new Date();
            }
        }
    },
    validators: {
        salespersonId: [
            Validators.required(null, "Please provide the Salesperson."),
            Validators.string()
        ],
        salespersonName: [
            Validators.required(null, "Please provide the Salesperson's name."),
            Validators.string()
        ],
        itemId: [
            Validators.required(null, "Please provide the Item."),
            Validators.string()
        ],
        itemPrice: [
            Validators.required(null, "Please provide the Item price."),
            Validators.number()
        ],
        itemName: [
            Validators.required(null, "Please provide the Item name."),
            Validators.string()
        ],
        goal: [
            Validators.required(null, "Please provide the Goal."),
            Validators.number()
        ],
        sold: [
            Validators.required(null, "Please provide the amount Sold."),
            Validators.number()
        ],
        transactionDate: [
            Validators.required(null, "Please provide the Transaction date."),
            Validators.date()
        ]
    }
});
