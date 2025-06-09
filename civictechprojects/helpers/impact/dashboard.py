from collections import Counter
from civictechprojects.models import DollarsSaved, Hackathons, Project, VolunteerRelation
from civictechprojects.helpers.search.volunteers import volunteer_history_list


def impact_dashboard_data(request):
    return {
        "dollar_impact": dollar_impact(),
        "volunteer_history": volunteer_history(request),
        "volunteer_roles": volunteer_roles(),
        "project_area": project_area(),
        "hackathon_stats": hackathon_stats(),
        "overall_stats": get_overall_stats(),
    }

def dollar_impact():
    impact = DollarsSaved.objects.all()
    history = []
    total_impact_value = 0
    total_expense = 0
    roi = 0
    for data in impact:
        quarter_date = data.quarterly
        if quarter_date is not None:
            quarterly_impact = data.impact
            expense = data.expense
            history.append(
                {
                    "quarter_date": quarter_date,
                    "quarterly_impact": quarterly_impact,
                    "expense": expense,
                }
            )
            total_impact_value += quarterly_impact
            total_expense += expense

    # Sort the history list by year
    if len(history) > 0:
        history = sorted(history, key=lambda x: x["quarter_date"])
        roi = (total_impact_value - total_expense) / total_expense

    return {
        "history": history,
        "total_impact": total_impact_value,
        "total_expense": total_expense,
        "roi": roi,
    }

def volunteer_history(response):
    yearly_stats = volunteer_history_list(response)
    total_applications = sum(
        year_data["applications"] for year_data in yearly_stats.values()
    )
    total_approved = sum(year_data["approved"] for year_data in yearly_stats.values())
    total_renewals = sum(year_data["renewals"] for year_data in yearly_stats.values())
    if total_approved > 0:
        cumulative_renewal_percentage = total_renewals / total_approved
        volunteer_matching = total_approved / total_applications
    else:
        cumulative_renewal_percentage = 0
        volunteer_matching = 0
    sorted_yearly_stats = sorted(yearly_stats.items(), key=lambda x: x[0])
    # Convert the dictionary to a list of JSON objects
    stats_list = [{"year": year, **data} for year, data in sorted_yearly_stats]
    data = {
        "yearly_stats": stats_list,
        "cumulative_renewal_percentage": cumulative_renewal_percentage,
        "volunteer_matching": volunteer_matching,
    }

    return data

def volunteer_roles():
    volunteers = VolunteerRelation.unfiltered_objects.filter(
        is_approved=True
    ).prefetch_related("role")

    role_counts = Counter()
    for volunteer in volunteers:
        role = volunteer.get_role()
        role_counts[role] += 1

    role_counts_sorted = dict(sorted(role_counts.items(), key=lambda x: x[0]))

    return role_counts_sorted

def project_area():
    projects = Project.objects.all()

    area_counts = Counter()
    for project in projects:
        project_areas = project.get_project_issue_area()
        # Check if there are no issue areas assigned
        if len(project_areas) == 0:
            area = "No Specific Issue"
        else:
            area = project_areas[0]["display_name"]

        area_counts[area] += 1

    # Sort area_counts by count number in descending order and then convert to dictionary
    area_counts_sorted = dict(
        sorted(area_counts.items(), key=lambda x: x[1], reverse=True)
    )

    return area_counts_sorted

def hackathon_stats():
    hdata = Hackathons.objects.all()
    if hdata:
        return (
            {
                "total_hackathon_count": hdata[0].total_hackathon_count,
                "total_hackathon_participants": hdata[0].total_hackathon_participants,
            }
        )
    else:
        return (
            {"total_hackathon_count": 0, "total_hackathon_participants": 0}
        )

def get_overall_stats():
    active_volunteers = VolunteerRelation.objects.filter(is_approved=True)

    stats = {
        "projectCount": Project.objects.filter(
            is_searchable=True, deleted=False
        ).count(),
        "activeVolunteerCount": active_volunteers.distinct("volunteer__id").count(),
    }

    return stats
