from common.models.tags import Tag
from civictechprojects.models import Project
from common.helpers.constants import TagCategory
import sys
import os
import csv


def get_tags_by_category(categoryName):
    return Tag.objects.filter(category__contains=categoryName)


def get_tag_dictionary():
    return {tag.tag_name: tag for tag in Tag.objects.all()}


def import_tags_from_csv():
    dir = os.path.dirname(__file__)
    filename = os.path.join(dir, '../models/Tag_definitions.csv')
    tags = []
    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        try:
            #skip header row
            next(reader)
            for row in reader:
                tag = Tag(tag_name=row[0],
                          display_name=row[1],
                          caption=row[2],
                          category=row[3],
                          subcategory=row[4],
                          parent=row[5]
                          )
                tags.append(tag)
        except csv.Error as e:
            sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))
    merge_tags_with_existing(tags)


def import_tags(tags):
    for tag in tags:
        tag.save()


# Delete all references to the tag before removing the tag
def delete_tag_and_references(tag):
    print('Deleting tag ' + tag.tag_name)
    remove_tag_from_projects(tag)
    tag.delete()


def merge_tags_with_existing(tags):
    existing_tags = Tag.objects.all()

    if existing_tags.count() == 0:
        import_tags(tags)
    else:
        indexed_tags = {tag.tag_name: tag for tag in existing_tags}
        for tag in tags:
            if tag.tag_name in indexed_tags:
                # print('Updating tag ' + tag.tag_name)
                existing_tag = indexed_tags[tag.tag_name]
                existing_tag.display_name = tag.display_name
                existing_tag.caption = tag.caption
                existing_tag.category = tag.category
                existing_tag.subcategory = tag.subcategory
                existing_tag.parent = tag.parent
                existing_tag.save()
                del indexed_tags[tag.tag_name]
            else:
                print('Adding tag ' + tag.tag_name)
                tag.save()


# Remove any project tags that aren't part of the canonical list
def remove_tags_not_in_list():
    for project in Project.objects.all():
        for issue in project.project_issue_area.all():
            issue_tag = Tag.get_by_name(issue)
            if not issue_tag:
                project.project_issue_area.remove(issue)


def remove_tag_from_projects(tag):
    if tag.category == TagCategory.ISSUE_ADDRESSED.value:
        for project in Project.objects.filter(project_issue_area__name__in=[tag.tag_name]):
            print('Deleting', tag.tag_name, 'from project', project.id)
            project.project_issue_area.remove(tag.tag_name)