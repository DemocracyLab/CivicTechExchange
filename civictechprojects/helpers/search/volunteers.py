from civictechprojects.models import (
    VolunteerRelation,
)
from django.db import models
from django.utils import timezone
from django.db.models import Count, Q
from django.db.models.functions import ExtractYear
from collections import Counter
from collections import defaultdict
from datetime import datetime


def volunteer_history_list(request):
    # Initialize the default dictionary with counts for approved, renewals, and total applications
    yearly_data = defaultdict(lambda: {'approved': 0, 'renewals': 0, 'applications': 0})

    # Get the current year and today's date
    current_year = datetime.now().year
    today = datetime.now().date()
    days_elapsed = (today - datetime(today.year, 1, 1).date()).days + 1  # Adding 1 because the first day counts

    # Get all volunteers
    all_volunteers = VolunteerRelation.unfiltered_objects.all()

    # Count all applications per year
    application_counts = all_volunteers.annotate(
        application_year=ExtractYear('application_date')
    ).values('application_year').annotate(
        application_count=Count('id')
    )

    # Update the yearly_data with application counts
    for entry in application_counts:
        year = entry['application_year']
        yearly_data[year]['applications'] = entry['application_count']

    # Get all approved volunteers
    approved_volunteers = all_volunteers.filter(is_approved=True)

    # Count approved volunteers per year
    approved_counts = approved_volunteers.annotate(
        application_year=ExtractYear('application_date')
    ).values('application_year').annotate(
        approved_count=Count('id')
    )

    # Update the yearly_data with approved counts
    for entry in approved_counts:
        year = entry['application_year']
        yearly_data[year]['approved'] = entry['approved_count']

    # Get all volunteers with a re_enrolled_last_date for renewals
    volunteers_with_renewals = approved_volunteers.exclude(re_enrolled_last_date__isnull=True)

    # Iterate over volunteers to count renewals per year
    for volunteer in volunteers_with_renewals:
        start_year = volunteer.application_date.year
        end_year = volunteer.re_enrolled_last_date.year
        # Count each year from application_date's year to re_enrolled_last_date's year
        for year in range(start_year, end_year + 1):
            yearly_data[year]['renewals'] += 1

    # Calculate projected values for the current year and set values for previous years
    for year, data in yearly_data.items():
        if year == current_year:
            data['projected_approved'] = round(data['approved'] * 365 / days_elapsed)
            data['projected_renewals'] = round(data['renewals'] * 365 / days_elapsed)
        else:
            data['projected_approved'] = data['approved']
            data['projected_renewals'] = data['renewals']

    # Convert defaultdict to a regular dict for serialization
    return dict(yearly_data)

