TORTOISE_ORM = {
    "connections": {
        "default": "postgres://postgres:kr3310@localhost:5432/BTD-Management"
    },
    "apps": {
        "myapp": {
            # Ensure your model paths are correctly specified here.
            # If you're encountering a ModuleNotFoundError, make sure the path to your models is correct.
            # For instance, if your models are defined in 'appapi/models.py', you should specify 'appapi.models' here.
            "models": ["appapi.models.role_model", "appapi.models.user_model"], 
            "default_connection": "default",
        },
    },
}