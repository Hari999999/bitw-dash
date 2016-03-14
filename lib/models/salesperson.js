Salesperson = Astro.Class({
    name: 'SalesPerson',
    collection: SalesTeam,
    fields: {
        firstName: 'string',
        lastName: 'string',
        telephone: 'string',
        position: 'string',
        isActive: {
            type: 'boolean',
            default: true
        },
        createdAt: {
            type: 'date',
            default: function(){
                return new Date();
            }
        }
    },
    validators: {
        firstName: [
            Validators.required(null, "Please provide the salesperson's First Name"),
            Validators.string()
        ],
        lastName: [
            Validators.required(null, "Please provide the salesperson's Last Name"),
            Validators.string()
        ],
        telephone: [
            Validators.required(null, "Please provide the salesperson's Telephone"),
            Validators.string()
        ],
        position: Validators.string()
    },
    methods: {
        fullName: function () {
            return this.firstName + " " + this.lastName;
        }
    }
});
