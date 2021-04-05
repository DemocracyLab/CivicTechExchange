# https://hub.docker.com/r/nikolaik/python-nodejs
FROM nikolaik/python-nodejs:python3.8-nodejs12

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code

RUN apt-get update && apt-get install -y libgdal-dev

# Install and set up nvm
RUN mkdir /.nvm
ENV NVM_DIR /.nvm
ENV NODE_VERSION 12.16.0
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.35.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# Install pip and yarn depedencies before copying directory to Docker image.
COPY requirements.txt /code/requirements.txt
RUN pip install -r requirements.txt

# Copy files needed for yarn install.
COPY package.json yarn.lock /code/
RUN yarn config set ignore-engines true
RUN yarn --frozen-lockfile --link-duplicates --ignore-scripts
# Permission issue with node-sass https://github.com/sass/node-sass/issues/1579
RUN npm rebuild node-sass
# Copy folders and files whitelisted by .dockerignore.
COPY . /code/

# Url prefix to generate links on the back-end
ENV PROTOCOL_DOMAIN "http://127.0.0.1:8000"

#Contact Us email address, used for Contact Form
ENV CONTACT_EMAIL "hello@democracylab.org"

# Whether to show django debug info page on errors
ENV DJANGO_DEBUG True

# Event Header
ENV HEADER_ALERT="<p>You are invited to our upcoming event, St. Hat-trick's day!  Come with a team or join a new one on Saturday, March 16.  Be sure to RSVP on <a href='https://www.eventbrite.com/e/st-hack-tricks-day-tickets-54897293282'>Eventbrite</a>!</p>"

# Sponsor information
ENV SPONSORS_METADATA='[{"displayName":"Textio","url":"https://medium.com/democracylab-org/textio-engages-employees-to-accelerate-civic-innovation-5984609a95ce","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/textio_logo_315_trans.png","description":"Textio is the inventor of augmented writing. Textio transforms your rough ideas into powerful language by hitting Tab."},{"displayName":"HERE Technologies","url":"https://www.here.com/","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/here_technologies.png","description":"By building a digital representation of reality entirely built upon location data, we are radically transforming the way the world lives, moves and interacts"},{"displayName":"Amazon","url":"https://www.aboutamazon.com/our-communities/amazon-in-the-community","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/amazon_logo.png","description":"At Amazon, we focus on building long-term and innovative programs that will have a lasting, positive impact in communities around the world."}]'

# Configure project description example link
ENV PROJECT_DESCRIPTION_EXAMPLE_URL "https://www.democracylab.org/projects/1"

# Configure position description example link
ENV POSITION_DESCRIPTION_EXAMPLE_URL "https://docs.google.com/document/d/142NH4uRblJP6XvKdmW4GiFwoOmVWY6BJfEjGrlSP3Uk/edit"

# Configure exit survey url for volunteers concluding their commitment with a project
ENV VOLUNTEER_CONCLUDE_SURVEY_URL "https://docs.google.com/forms/d/e/1FAIpQLSd4e9FQYX3ARPg7qz1ct5qM_bQW_kkEvQaMuM5LV9Ma1NDgbA/viewform"

# Configure number of projects to display per server request
ENV PROJECTS_PER_PAGE 20


# If True, emails won't be sent to their recipients, but to the ADMIN_EMAIL address (with metadata for debugging)
ENV FAKE_EMAILS True

# This array specifies how many days we should space our reminder emails.  In this case, the first reminder comes after
# two days, the second after seven days, and none after that
ENV APPLICATION_REMINDER_PERIODS '[2,7,-1]'

# This array specifies how many days we should space our volunteer renewal reminder emails.  In this case, the first
# reminder comes two weeks before the volunteer's end date, and the second comes one week before
ENV VOLUNTEER_RENEW_REMINDER_PERIODS '[7,7,-1]'

# DemocracyLab project ID (for use on About Us page)
ENV DLAB_PROJECT_ID 1

# Press page links (TODO: convert to db entries)
ENV PRESS_LINKS '[{"date":"March 11, 2019","href":"https://www.washingtontechnology.org/the-pulse-of-tech-for-good-in-seattle/","title":"The Pulse of Tech for Good in Seattle","source":"Washington Technology Industry Association"},{"date":"February 10, 2019","href":"https://www.esal.us/blog/democracylab-empowering-the-civic-tech-movement/","title":"DemocracyLab: Empowering the Civic Tech Movement","source":"Engineers and Scientists Acting Locally"},{"date":"January 22, 2019","href":"https://givingcompass.org/article/untapped-potential-of-civic-technology/","title":"The Untapped Potential of Civic Technology","source":"Giving Compass"},{"date":"January 18, 2019","href":"http://techtalk.seattle.gov/2019/01/18/civic-tech-community-tackles-pressing-issues-with-seattles-open-data/","title":"Civic Tech Community Tackles Pressing Issues with Seattle’s Open Data","source":"Seattle IT Tech Talk Blog"},{"date":"January 9, 2019","href":"https://socrata.com/blog/seattle-hackathon-real-world-impact/","title":"Seattle Hackathon Innovates for ‘Real World Impact’","source":"Socrata Blog"},{"date":"August 8, 2018","href":"https://www.geekwire.com/2018/can-tech-government-innovate-together-social-good-inside-new-effort-change-tide/","title":"Can tech and government innovate together for social good? Inside a new effort to change the tide","source":"GeekWire"}]'

EXPOSE 8000