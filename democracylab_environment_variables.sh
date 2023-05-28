read -n 1 -r -s -p $'This is an example .sh file, and should not be run or changed unless new environment variables are added. Press any key to exit\n'
exit 1

#!/bin/bash

# S3 bucket and credentials for uploading files
#export AWS_ACCESS_KEY_ID=ASK
#export AWS_SECRET_ACCESS_KEY=ASK
#export S3_BUCKET=ASK

# Url prefix to generate links on the back-end
export PROTOCOL_DOMAIN=http://127.0.0.1:8000

# Email of the admin account, used to
export ADMIN_EMAIL=marlonakeating+1111@gmail.com

#Contact Us email address, used for Contact Form
export CONTACT_EMAIL=hello@democracylab.org

# Secret key used to encrypt session tokens
export DJANGO_SECRET_KEY="d!01@gn+%1ql1n(*)8xo+nx$$&n@mg$0_)9g+!(t-2vncaq!j8"

# Hostname for db connection - value is different for docker
export HOSTNAME="127.0.0.1"

# Whether to show django debug info page on errors
export DJANGO_DEBUG=True

# Event Header
export HEADER_ALERT="<p>You are invited to our upcoming event, St. Hat-trick's day!  Come with a team or join a new one on Saturday, March 16.  Be sure to RSVP on <a href='https://www.eventbrite.com/e/st-hack-tricks-day-tickets-54897293282'>Eventbrite</a>!</p>"

# Sponsor information
export SPONSORS_METADATA='[{"displayName":"Microsoft","url":"https://www.microsoft.com/en-us/","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/microsoft_300_transparent.png","description":"We’re on a mission to empower every person and every organization on the planet to achieve more.","category":"Sustaining"},{"displayName":"Amazon","url":"https://www.aboutamazon.com/our-communities/amazon-in-the-community","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/amazon_300_transparent.png","description":"At Amazon, we focus on building long-term and innovative programs that will have a lasting, positive impact in communities around the world.","category":"Sustaining"},{"displayName":"WA Department of Commerce","url":"https://www.commerce.wa.gov/","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/WA%20DOC_270_transparent.png","description":"The Washington State Department of Commerce works with local governments, tribes, businesses and civic leaders throughout the state to strengthen communities so all residents may thrive and prosper.","category":"Supporting"},{"displayName":"WGU","url":"https://www.wgu.edu/","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/WGU_200_transparent.png","description":"WGU exists to change lives. By bridging the gap between talent and opportunity, WGU makes it possible for today’s worker to also be today’s learner—and tomorrow’s success story.","category":"Supporting"},{"displayName":"Google","url":"https://www.google.com/nonprofits/","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/google_200_transparent.png", "category":"In-kind Support"},{"displayName":"Salesforce","url":"https://www.salesforce.org/power-of-us/","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/Salesforce_200_transparent.png","category":"In-kind Support"},{"displayName":"User Testing","url":"https://www.usertesting.com/about-us/usertesting-oneworld","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/User_Testing_200_transparent.png","category":"In-kind Support"},{"displayName":"Heap","url":"https://heap.io/","thumbnailUrl":"https://d1agxr2dqkgkuy.cloudfront.net/img/heap_200_transparent.png","category":"In-kind Support"}]'

# Configure project description example link
export PROJECT_DESCRIPTION_EXAMPLE_URL='https://www.democracylab.org/projects/1'

# Configure position description example link
export POSITION_DESCRIPTION_EXAMPLE_URL='https://docs.google.com/document/d/142NH4uRblJP6XvKdmW4GiFwoOmVWY6BJfEjGrlSP3Uk/edit'

# Configure exit survey url for volunteers concluding their commitment with a project
export VOLUNTEER_CONCLUDE_SURVEY_URL='https://docs.google.com/forms/d/e/1FAIpQLSd4e9FQYX3ARPg7qz1ct5qM_bQW_kkEvQaMuM5LV9Ma1NDgbA/viewform'

# Configure number of projects to display per server request
export PROJECTS_PER_PAGE=20

# Static asset CDN
export STATIC_CDN_URL='https://d1agxr2dqkgkuy.cloudfront.net'

# If True, emails won't be sent to their recipients, but to the ADMIN_EMAIL address (with metadata for debugging)
export FAKE_EMAILS=True

# This array specifies how many days we should space our reminder emails.  In this case, the first reminder comes after
# two days, the second after seven days, and none after that
export APPLICATION_REMINDER_PERIODS='[2,7,-1]'

# This array specifies how many days we should space our volunteer renewal reminder emails.  In this case, the first
# reminder comes two weeks before the volunteer's end date, and the second comes one week before
export VOLUNTEER_RENEW_REMINDER_PERIODS='[7,7,-1]'

# Sample email account configuration
# export EMAIL_SUPPORT_ACCT='{"host":"smtp.gmail.com","port":"587","display_name":"DemocracyLab Support","username":"support@democracylab.org","password":"SECRET","use_tls":"True","use_ssl":"False"}'
# export EMAIL_VOLUNTEER_ACCT='{"host":"smtp.gmail.com","port":"587","display_name":"DemocracyLab Volunteering","username":"volunteer@democracylab.org","password":"SECRET","use_tls":"True","use_ssl":"False"}'

# Mailchimp
# export MAILCHIMP_API_KEY=SECRET
# export MAILCHIMP_SUBSCRIBE_LIST_ID=SECRET

export S3_BUCKET=democracylab-marlok

# ONLY FOR USE IN PRODUCTION
#export HOTJAR_APPLICATION_ID=1097784

#export GOOGLE_PROPERTY_ID='UA-2879129-5'
#export GOOGLE_ADS_ID='AW-736663510'
#export GOOGLE_TAGS_ID='GTM-MBD5H4V'
#export GOOGLE_CONVERSION_IDS='[{'SignedUp':'bYM2CLDDlqMBENavot8C'}]'

# DemocracyLab project ID (for use on About Us page)
export DLAB_PROJECT_ID=1

# Paypal endpoint (sandbox by default)
export PAYPAL_ENDPOINT='https://www.sandbox.paypal.com/cgi-bin/webscr'
# Paypal payee
export PAYPAL_PAYEE='mark@democracylab.org'

# Press page links (TODO: convert to db entries)
export PRESS_LINKS='[{"date":"March 11, 2019","href":"https://www.washingtontechnology.org/the-pulse-of-tech-for-good-in-seattle/","title":"The Pulse of Tech for Good in Seattle","source":"Washington Technology Industry Association"},{"date":"February 10, 2019","href":"https://www.esal.us/blog/democracylab-empowering-the-civic-tech-movement/","title":"DemocracyLab: Empowering the Civic Tech Movement","source":"Engineers and Scientists Acting Locally"},{"date":"January 22, 2019","href":"https://givingcompass.org/article/untapped-potential-of-civic-technology/","title":"The Untapped Potential of Civic Technology","source":"Giving Compass"},{"date":"January 18, 2019","href":"http://techtalk.seattle.gov/2019/01/18/civic-tech-community-tackles-pressing-issues-with-seattles-open-data/","title":"Civic Tech Community Tackles Pressing Issues with Seattle’s Open Data","source":"Seattle IT Tech Talk Blog"},{"date":"January 9, 2019","href":"https://socrata.com/blog/seattle-hackathon-real-world-impact/","title":"Seattle Hackathon Innovates for ‘Real World Impact’","source":"Socrata Blog"},{"date":"August 8, 2018","href":"https://www.geekwire.com/2018/can-tech-government-innovate-together-social-good-inside-new-effort-change-tide/","title":"Can tech and government innovate together for social good? Inside a new effort to change the tide","source":"GeekWire"}]'

# Google ReCaptcha development (NON PRODUCTION) keys
# These should always result in no captcha and always succeeding the check
export GOOGLE_RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
export GOOGLE_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI

# Sample OAuth configuration
# export SOCIAL_APPS='{"github": {"id": 1, "name": "DLab Social Login", "client_id": "CONFIGURE", "secret": "CONFIGURE", "public": True}, "google": {"id": 2,"name": "DLab Social Login","client_id": "CONFIGURE","secret": "CONFIGURE", "public": True}, "linkedin": {"id": 3,"name": "DLab Social Login","client_id": "CONFIGURE","secret": "CONFIGURE", "public": True}, "facebook": {"id": 4,"name": "DLab Social Login","client_id": "CONFIGURE","secret": "CONFIGURE", "public": True}}'

# GitHub token for expanding our rate limit for API calls
# export GITHUB_API_TOKEN=SECRET

# Configuration for HERE location api
# export HERE_CONFIG='{"autocompleteUrl":"https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json","geocodeUrl":"https://geocoder.ls.hereapi.com/6.2/geocode.json","apiKey":"SECRET"}'

# The date the DemocracyLab site was last updated.  Used in our sitemap
export DL_PAGES_LAST_UPDATED='2019-12-05'

# Disallow crawling for non-production environments
export DISALLOW_CRAWLING=True

export BOARD_OF_DIRECTORS='[{"first_name":"Mark","last_name":"Frischmuth","title":["President","Executive Director at DemocracyLab"],"user_thumbnail":"https://d1agxr2dqkgkuy.cloudfront.net/img/Mark%20Frischmuth.jpg","bio_text":"Mark founded DemocracyLab in 2006 to create an online platform to crowdsource public policy. DemocracyLab launched a product that attempted to achieve that vision, but made mistakes now obvious with the benefit of hindsight, and built a platform that didn’t attract enough users to have a long-term impact.\n\nIn 2012, the organization pivoted to address the inefficiency of the tech-for-good sector, which we believe is caused in part by poor flows of information and allocation of resources. Our platform addresses these problems and helps tech-for-good projects attract the volunteer talent they need to launch, test their hypotheses and prove their concepts.\n\nMark spent 20 years working in the financial services industry as a financial advisor and 401(k) wholesaler. In 2016 he enrolled in graduate school at the University of Washington, where he earned MBA and MPA degrees. He now leads DemocracyLab full-time.\n\nMark is married and the father of two daughters, ages 4 and 2."},{"first_name":"Njeri","last_name":"Thande","title":["Secretary", "Business Program Manager, Microsoft"],"user_thumbnail":"https://d1agxr2dqkgkuy.cloudfront.net/img/Njeri%20Thande.jpg","bio_text":"After earning a Masters in Public Administration from the University of Washington’s Evans School of Public Policy & Governance, Njeri joined the Microsoft LEAP program as a Business Program Manager. She is passionate about social justice, civic participation and diversity, equity, and inclusion in policy and operations environments. She is excited to support DemocracyLab in connecting and supporting skilled volunteers with tech-for-good projects."},{"first_name":"Arash","last_name":"Oliaei","title":["Treasurer", "Customer Success Manager, Autodesk"],"user_thumbnail":"https://d1agxr2dqkgkuy.cloudfront.net/img/Arash%20Oliaei.jpg","bio_text":"Arash has been a core member of the organization since 2017. Over the years he has been involved in everything from research, product development, strategy and operations. Today, Arash serves as a member of the organization’s Board of Directors and its Treasurer.\n\nWith his extensive experience in both the non-profit sector, working with Habitat for Humanity, Seattle Goodwill & the Iranian American Community Alliance, and his for-profit and academic background, Arash seeks to merge the two worlds together to further the impact of DemoracyLab.\n\nArash earned his Bachelors and MBA from University of Washington, and currently resides in San Francisco, CA."},{"first_name":"Steven","last_name":"Maheshwary","title":["Partnerships Chair","Governor’s Sector Lead for Information and Communications Technology, State of Washington"],"user_thumbnail":"https://d1agxr2dqkgkuy.cloudfront.net/img/Steven%20Maheshwary.jpg","bio_text":"Steven Maheshwary is the Programs Lead for the Underserved Populations team at Amazon, working to build products and services benefiting low-income and underserved communities. Outside of his day job, Steven was appointed by the Mayor of Seattle to serve on the Community Technology Advisory Board (created to advise the Mayor and City Council on all issues relating to technology and information) and was its chair in 2019. Prior to his current role at Amazon, Steven worked at startups, Microsoft and Amazon in a number of roles spanning finance, business development, marketing, and product. In 2016 he received a Fulbright Scholarship to teach social entrepreneurship, English, and creative non-fiction in Borneo, Malaysia. Steven graduated from Harvard College with a degree in Sociology and Economics. He is committed to leveraging his passion for community engagement, his business acumen, and experience in the tech sector to promote tech-for-good initiatives and social impact among underserved communities."},{"first_name":"Deb","last_name":"Bryant","title":["", "Senior Director, Open Source Program Office at Red Hat"],"user_thumbnail":"https://d1agxr2dqkgkuy.cloudfront.net/img/Deb%20Bryant.jpg","bio_text":"Deborah Bryant is Senior Director, Open Source Program Office, Office of the CTO at Red Hat where she leads a global team responsible for the company’s stewardship in open source software communities.\n\nDeb draws her perspective from an industry-diverse background; Parallel and high-speed computing and commercialized internet and web applications in the 80s, commercial wide area networks, advanced telecommunications and data/voice convergence in the 90s, and worked squarely in the middle of the industry disruption created by open source software thereafter.\n\nDeb serves on numerous boards where open source is a critical element of their mission in the public interest.  She serves as a board director at the Open Source Initiative and DemocracyLab; on the advisory boards of Open Source Elections Technology Foundation and the OASIS Open Project.  She also serves as an advisor to the Brandeis University / Open Source Initiative partnership for the new Open Technology Management program launching January 2020.\n\nIn 2010 Deb received the industry <a href=\"http://en.wikipedia.org/wiki/O%27Reilly_Open_Source_Award\">Open Source Award</a> in recognition of her contribution to open source communities and for her pioneering advocacy of open standards and the use of open source software in the public sector."},{"first_name":"Dwayne","last_name":"King","title":["", "Director of Innovation Research, Iron Mountain"],"user_thumbnail":"https://d1agxr2dqkgkuy.cloudfront.net/img/Dwayne%20King.jpg","bio_text":"Dwayne has a tested and results-oriented approach to understanding audiences and connecting with them in a meaningful ways. His experience spans industries bringing new products and services to life, focusing on creating new customers, reinvigorating existing customers and increasing revenue.\n\nDwayne is a Certified Customer Experience Professional (CCXP), with proven ability to create award-winning customer experiences for recognizable brands and startups alike. Some examples include Microsoft, Nike, Cisco, Healthcare Corporation of America, Boeing, and National Institutes of Health, among others."},{"first_name":"Daria","last_name":"Loi","title":["", "Senior Director, Head of Product Design at Mozilla"],"user_thumbnail":"https://d1agxr2dqkgkuy.cloudfront.net/img/Daria%20Loi.jpg","bio_text":"Daria loves mixing design strategy with user experience research & innovation to enrich people’s life & humanize technology.\n\nShe is a passionate & accomplished creative & technical leader, versed applying UX, tech & design acumen to diverse contexts & experienced deploying innovation to dream, design & develop novel products & services.\n\nShe has broad strategic & operational expertise in planning, project, & innovation management & in navigating highly ambiguous contexts to deliver results.\n\nIn 2018 Daria was recognized as one of Italy’s 50 most inspiring women in tech&received Intel’s Global Diversity&Inclusion Award."},{"first_name":"Elizabeth","last_name":"Scallon","title":["", " Alexa Startup & Fund - GTM & Operations at Amazon"],"user_thumbnail":"https://d1agxr2dqkgkuy.cloudfront.net/img/Elizabeth%20Scallon.jpg","bio_text":"Elizabeth is an award winning leader in the Pacific Northwest startup ecosystem, and Head of WeWork Labs Northern California & Northwest. She is a scientist, mentor, and 15 year leader in scientific and technological innovation.\n\nKnown for a keen ability to locate disruptive and innovative technology, previous to WeWork Elizabeth led the team at CoMotion Labs at the University of Washington coaching and growing the robust bench of NW tech and biotech startups.\n\nAn out lesbian from before the L Word pilot episode, Elizabeth has a passion for spotlighting and developing outsider voices. A tendency that aided her biotech startup team at VLST (her title: Head of Ops) grow to 50 employees and $35M in funding.\n\nObsessed with growth and knowledge, Elizabeth went from a degree in Biochemistry, to Georgetown’s Global Executive MBA in Innovation, Entrepreneurship, Emerging Markets. She was most recently invited to join the 2019 cohort of Harvard Business School’s YALP program which aims to develop leaders who understand cross-sector collaborations for shared prosperity and can implement them more effectively and spread them more rapidly than in the past.\n\nDespite an active travel schedule overseeing labs and showcasing Seattle talent in SF, LA, NYC and internationally, Elizabeth is a hometown hero. She grew up in Seattle, plays the connector and mentor role in building Seattle’s booming economy, and she lives on Beacon Hill with her wife and toddler. Sundays usually mean farmer’s markets and family brunch."}]'

export FAVICON_PATH=https://d1agxr2dqkgkuy.cloudfront.net/img/favicon.png

export BLOG_URL='https://blog.democracylab.org'

# if we have a hackathon or similar event we want displayed in the nav for the duration, put it here
export EVENT_URL='https://democracylab.org/events/1'

# Qiqochat live event iframe url with placeholders
export QIQO_IFRAME_URL='https://qiqochat.com/api/v1/iframe?&source[api_key]={api_key}&source_user_uuid={source_user_uuid}&qiqo_user_uuid={qiqo_user_uuid}&return_to="/breakout/0/EVENT_ID?embedded=true"'
export QIQO_API_KEY=democracylab

# For Qiqochat user registration, do not enable these unless you are working on this feature
# export QIQO_API_SECRET=SECRET
# export QIQO_USERS_ENDPOINT='https://api.qiqochat.com/api/v1/users'
# export QIQO_CIRCLE_UUID=nmitq

#Add CSP variable examples
export CSP_FRAME_SRC='["qiqochat.com", "*.qiqochat.com", "*.google.com", "*.youtube.com", "democracylab.org", "democracy-lab-prod-mirror.herokuapp.com", "democracy-lab-dev.herokuapp.com", "democracy-lab-staging.herokuapp.com"]'
export CSP_FRAME_ANCESTORS='["qiqochat.com", "*.qiqochat.com", "*.google.com", "*.youtube.com", "democracylab.org", "democracy-lab-prod-mirror.herokuapp.com", "democracy-lab-dev.herokuapp.com", "democracy-lab-staging.herokuapp.com"]'

# Max rate for anonymous or authenticated requests. Valid time periods include second, minute, hour or day
export THROTTLE_RATE_ANONYMOUS=5/second
export THROTTLE_RATE_AUTHENTICATED=5/second

# Links and metadata for /videos/ page
export VIDEO_PAGES='{"overview":{"video_url":"https://www.youtube.com/embed/nvIUWtx-nmo"}, "wgu-hack-for-the-future":{"video_url":"https://www.youtube.com/embed/4hujk4liEvw","video_thumbnail":"https://d1agxr2dqkgkuy.cloudfront.net/img/wgu_event_2021.jpeg","video_description":"Western Governors University sponsored this event to give community college students in Alaska, Colorado, Hawaii, Idaho, Montana, Oregon, Utah, Washington, and Wyoming an opportunity to hone their tech skills while contributing to tech-for-good projects."}}'
