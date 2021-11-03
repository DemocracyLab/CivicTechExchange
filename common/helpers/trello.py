import requests
from datetime import datetime, timedelta


trello_base_api = 'https://api.trello.com/1'
key = ''
token = ''


class UnauthorizedTrelloRequest(Exception):
    """Trello responded with a 401 Unauthorized"""
    pass


def fetch(rel_url, params={}):
    """
    Make a GET request to the Trello API
    :param rel_url: Relative URL to be appended to the trello_base_api
    :param params: query params to be used in the request
    :return:  response body or None
    """
    url = '{base_url}{rel_url}'.format(
        base_url=trello_base_api, rel_url=rel_url)
    params['key'] = key
    params['token'] = token

    print('trello url : {}'.format(url))

    response = requests.get(url, params=params)

    if response.status_code == 401:
        print("Unauthorized Trello request")
        raise UnauthorizedTrelloRequest()
    try:
        repo_info = response.json()
        if 'message' in repo_info:
            print('Unable to read ' + url + ': ' + repo_info['message'])
            return None
        else:
            return repo_info
    except:
        print(response.status_code)
        print('Invalid json: ' + url)
        return None


def get_board_actions(board_id, last_activity_date):
    """
    Get createCard and updateCard actions for a specified board_id
    :param board_id: Trello board id
    :return: actions list
    """
    rel_url = '/boards/{board_id}'.format(board_id=board_id)
    print("retrieving data from date : {}".format(last_activity_date))
    try:
        actions_json = fetch(rel_url, {'actions_since': last_activity_date,
                                       'actions': 'createCard,updateCard',
                                       'fields': 'actions',
                                       'board_action_memberCreator_fields': 'fullName',
                                       'action_memberCreator_fields': 'fullName'})
        if actions_json is None:
            print('No results found, querying users')
            return []
        else:
            return actions_json['actions']
    except UnauthorizedTrelloRequest:
        print('Could not retrieve actions from private board: {board_id}'.format(
            board_id=board_id))
        return []
