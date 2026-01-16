class DevUser:
    id = 1
    role = "admin"

@property
def is_admin(self):
    return self.role == "admin"
def get_current_user():
    return DevUser()