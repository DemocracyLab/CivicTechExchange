from .email_reminders import execute_email_reminders

democracylab_management_commands = {
    'emailreminders': execute_email_reminders
}


def execute_democracylab_management_command(argv=None):
    if len(argv) > 1 and argv[1] in democracylab_management_commands:
        democracylab_management_commands[argv[1]](argv)
        return True
    return False
