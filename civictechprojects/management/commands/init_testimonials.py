import json
import os
from django.core.management.base import BaseCommand


def upsert_testimonial(testimonial_json, priority):
    from civictechprojects.models import Testimonial
    testimonial = Testimonial.objects.filter(name=testimonial_json['name']).first()
    if not testimonial:
        testimonial = Testimonial.objects.create(**testimonial_json)
    else:
        testimonial.avatar_url = testimonial_json['avatar_url']
        testimonial.title = testimonial_json['title']
        testimonial.text = testimonial_json['text']
        testimonial.source = testimonial_json['source']
        categories = testimonial_json['categories'] if 'categories' in testimonial_json else None
        if categories:
            testimonial.categories.set(*(categories.strip().split(',')))

    testimonial.priority = testimonial_json['priority'] if 'priority' in testimonial_json else priority
    testimonial.save()


class Command(BaseCommand):
    help = 'Initializes Testimonials in the database'

    def handle(self, *args, **options):
        priority = 50
        dir = os.path.dirname(__file__)
        filename = os.path.join(dir, 'testimonials.json')
        with open(filename) as json_file:
            data = json.load(json_file)
            for testimonial in data:
                upsert_testimonial(testimonial, priority)
                priority -= 5
