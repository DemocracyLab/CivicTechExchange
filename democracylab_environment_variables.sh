# S3 bucket and credentials for uploading files
#export AWS_ACCESS_KEY_ID=ASK
#export AWS_SECRET_ACCESS_KEY=ASK
#export S3_BUCKET=ASK

# Password for account used to send email
export EMAIL_HOST_PASSWORD=betterDemocracyViaTechnology

# Url prefix to generate links on the back-end
export PROTOCOL_DOMAIN=http://127.0.0.1:8000

# Email of the admin account, used to
export ADMIN_EMAIL=marlonakeating+1111@gmail.com

# Secret key used to encrypt session tokens
export DJANGO_SECRET_KEY="d!01@gn+%1ql1n(*)8xo+nx$$&n@mg$0_)9g+!(t-2vncaq!j8"

# Whether to show django debug info page on errors
export DJANGO_DEBUG=True

# Configure footer links
export FOOTER_LINKS='[{"u":"http://connect.democracylab.org","n":"About"},{"u":"mailto:hello@democracylab.org","n":"Contact Us"}]'

# Configure project description example link
export PROJECT_DESCRIPTION_EXAMPLE_URL='https://www.democracylab.org/index/?section=AboutProject&id=1'

# Configure position description example link
export POSITION_DESCRIPTION_EXAMPLE_URL='https://docs.google.com/document/d/142NH4uRblJP6XvKdmW4GiFwoOmVWY6BJfEjGrlSP3Uk/edit'

# If True, emails won't be sent to their recipients, but to the ADMIN_EMAIL address (with metadata for debugging)
export FAKE_EMAILS=True

# ONLY FOR USE IN PRODUCTION
#export HOTJAR_APPLICATION_ID=1097784