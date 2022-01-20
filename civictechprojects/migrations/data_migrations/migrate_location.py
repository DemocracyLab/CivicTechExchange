from civictechprojects.models import Project
from django.contrib.gis.geos import Point

city_data = {
    "Seattle, WA": {
        "location_id": "NT_CbPeqdRa32sVQMUTQ08D9C",
        "latitude": 47.60358,
        "longitude": -122.32945,
        "country": "US",
        "state": "WA",
        "city": "Seattle"
    },
    "Redmond, WA": {
        "location_id": "NT_d.OYCK1kz7SakO9I4kZqUA",
        "latitude": 47.67858,
        "longitude": -122.13158,
        "country": "US",
        "state": "WA",
        "city": "Redmond"
    },
    "Kirkland, WA": {
        "location_id": "NT_VyvcFZFRjJOcrPyS7OwZ0A",
        "latitude": 47.67887,
        "longitude": -122.20664,
        "country": "US",
        "state": "WA",
        "city": "Kirkland"
    },
    "Bellevue, WA": {
        "location_id": "NT_V.cegwTGmjVI-lfdHaRkAB",
        "latitude": 47.61003,
        "longitude": -122.18791,
        "country": "US",
        "state": "WA",
        "city": "Bellevue"
    },
    "Tacoma, WA": {
        "location_id": "NT_sHEOjAIscPhGaDlr-5I.JA",
        "latitude": 47.25514,
        "longitude": -122.44164,
        "country": "US",
        "state": "WA",
        "city": "Tacoma"
    },
    "Olympia, WA": {
        "location_id": "NT_7UA8mAj3c3ThpWSHnPRm.C",
        "latitude": 47.03956,
        "longitude": -122.89166,
        "country": "US",
        "state": "WA",
        "city": "Olympia"
    },
    "Portland, OR": {
        "location_id": "NT_AuilSnazFMDxJ0LLqZ1gWB",
        "latitude": 45.5118,
        "longitude": -122.67563,
        "country": "US",
        "state": "OR",
        "city": "Portland"
    },
    "Bay Area, CA": {
        "location_id": "NT_R09PQHIIFEIptp3vXs5qEC",
        "latitude": 37.77713,
        "longitude": -122.41964,
        "country": "US",
        "state": "CA",
        "city": "San Francisco"
    },
    "Baltimore, MD": {
        "location_id": "NT_fe9IUAqC2ucydEAm37jDhC",
        "latitude": 39.29058,
        "longitude": -76.60926,
        "country": "US",
        "state": "MD",
        "city": "Baltimore"
    }
}


def migrate_locations_from_city_list(*args):
    if Project.objects.count() > 0:
        for project in Project.objects.all():
            if project.project_location in city_data:
                print('Migrating location data for ' + str(project))
                data = city_data[project.project_location]
                project.project_location = data["location_id"]
                project.project_country = data["country"]
                project.project_state = data["state"]
                project.project_city = data["city"]
                project.project_location_coords = Point(data['longitude'], data['latitude'])
                project.save()


