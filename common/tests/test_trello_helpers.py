from django.conf import settings
from django.test import TestCase
from unittest.mock import patch

from common.helpers.trello import fetch

class MockResponse:
 
    def __init__(self):
        self.status_code = 200
 
    def json(self):
        return {
                "id": "5f04a55ed530343818ae923a",
                "actions": [
                    {
                        "id": "60392b2af3c54a5779271c2e",
                        "idMemberCreator": "5f03968c9a27fe8566943cd1",
                        "data": {
                            "old": {
                                "idList": "5f0f4e217e866809e2b85c0a"
                            },
                            "card": {
                                "idList": "5f0f4e374746841ab26fe013",
                                "id": "5f061631060e411fa66cdd31",
                                "name": "Enlarge chat box in Lobby",
                                "idShort": 18,
                                "shortLink": "Jtgu2F7y"
                            },
                            "board": {
                                "id": "5f04a55ed530343818ae923a",
                                "name": "Roadmap",
                                "shortLink": "Ttgwsv3v"
                            },
                            "listBefore": {
                                "id": "5f0f4e217e866809e2b85c0a",
                                "name": "Complete"
                            },
                            "listAfter": {
                                "id": "5f0f4e374746841ab26fe013",
                                "name": "In Progress"
                            }
                        },
                        "type": "updateCard",
                        "date": "2021-02-26T17:08:58.777Z",
                        "limits": {},
                        "memberCreator": {
                            "id": "5f03968c9a27fe8566943cd1",
                            "fullName": "Gary M Green"
                        }
                    }
                ]
            }

class TrelloHelperTests(TestCase):

    @patch("requests.get", return_value=MockResponse())
    def test_fetch(self, mocked):
        self.assertEqual(
            fetch(""),
            MockResponse().json()
        )
        