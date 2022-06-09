import json
import requests
import threading
from .client import SalesforceClient
from common.models import Tag

''' ProjectPosition model maps to the Volunteer Job object in Salesforce '''
client = SalesforceClient()


def run(request):
    SalesforceClient().send(request)


def save(project_position):
    from civictechprojects.models import ProjectPosition
    if not ProjectPosition(project_position).position_project.is_searchable:
        pass

    position_role = Tag.tags_field_descriptions(project_position.position_role)
    platform_id__c = f'{project_position.position_project.id}{position_role.lower().replace(" ", "")}'
    # Skip if the role tag is blank
    if position_role != '':
        data = {
            "GW_Volunteers__Campaign__r":
                {
                    "platform_id__c": project_position.position_project.id
                },
            "name": position_role,
            "gw_volunteers__description__c": project_position.position_description
        }
        req = requests.Request(
            method="PATCH",
            url=f'{client.job_endpoint}/platform_id__c/{platform_id__c}',
            data=json.dumps(data)
        )
        ''' Changed this to a synchronous call to avoid record locks (duplicate position names are possible) '''
        SalesforceClient().send(req)

        #thread = threading.Thread(target=run, args=(req,))
        #thread.daemon = True
        #thread.start()


def delete(job_id):
    req = requests.Request(
        method="DELETE",
        url=f'{client.job_endpoint}/platform_id__c/{job_id}'
    )
    thread = threading.Thread(target=run, args=(req,))
    thread.daemon = True
    thread.start()


def import_jobs():
    from civictechprojects.models import ProjectPosition
    import traceback
    print('Importing project positions ...')
    job_ids = set()
    counter = 0
    for position in ProjectPosition.objects.all():
        try:
            position_role = Tag.tags_field_descriptions(position.position_role)
            platform_id__c = f'{position.position_project.id}{position_role.lower().replace(" ", "")}'
            if platform_id__c not in job_ids:
                job_ids.add(platform_id__c)
                counter = counter + 1
                if counter % 100 == 0: print(f'{counter} positions')
                save(position)
        except Exception:
            print(
                f'Error merging ProjectPosition in Salesforce for project {position.position_project.id}:{Tag.tags_field_descriptions(position.position_role)}')
            print(traceback.format_exc())
    print(f'{counter} positions')
