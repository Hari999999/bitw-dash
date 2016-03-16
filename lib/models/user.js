User = Astro.Class({
    name: 'User',
    collection: Meteor.users,
    fields: {
        username: 'string',
        password: 'string',
        profile: 'object',
        "profile.roleId": 'string',
        "profile.isSuper": {
            type: 'boolean',
            default: false
        },
        services: 'object',
        createdAt: {
            type: 'date',
            default: function() {
                return new Date();
            }
        }
    },
    validators: {
        username: [
            Validators.required(null, "Please provide a username"),
            Validators.string(),
            Validators.minLength(5)
        ],
        password: [
            Validators.required(null, "Please provide a password"),
            Validators.string(),
            Validators.minLength(8, "Your password should at least be 8 characters long"),
            Validators.maxLength(14, "Your password's length should not exceed 14 characters"),
            Validators.regexp(/^(?=.*[0-9])/, "Your password should contain at least one number (0-9)"),
            Validators.regexp(/^(?=.*[A-Z])/, "Your password should contain at least one UPPERCASE letter"),
            Validators.regexp(/^(?=.*[a-z])/, "Your password should contain at least one lowercase letter"),
            Validators.regexp(/^(?=.*[$@#?!%*&^|])/, "Your password should contain at least one one special character, e.g. $@#?!%*&^|"),
        ],
        profile: Validators.required(),
        "profile.roleId": [
            Validators.required(null, "Please select the Role for the user"),
            Validators.string()
        ],
        createdAt: [
            Validators.required(),
            Validators.date()
        ]
    },
    methods: {
        role: function() {
          return Roles.findOne({_id: this.profile.roleId});
        }
    }
});
