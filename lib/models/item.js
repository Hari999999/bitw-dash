Item = Astro.Class({
    name: 'Item',
    collection: Items,
    fields: {
        name: 'string',
        description: 'string',
        prices: {
            type: 'array',
            default: function(){
                return [];
            }
        },
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
        prices: [
            Validators.required(null, "Please provide the Price for the item.")
        ]
    },
    methods: {
        currentPrice: function () {
            var latestPrice = {
                price: 0,
                effectiveDate: null
            };
            _.each(this.prices, function(price){
                if(!latestPrice.effectiveDate){
                    latestPrice = price;
                } else if(moment(price.effectiveDate).subtract(moment(latestPrice.effectiveDate)) > 0){
                    latestPrice = price;
                }
            });
            return latestPrice.price ;
        }
    }
});
